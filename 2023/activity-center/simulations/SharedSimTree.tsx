import { Stack } from "@mui/material"
import { rootNodeID } from "features/postflop-strategies/PFTreeInfo"
import { TreeLoadIndicator } from "features/postflop-strategies/TreeLoadIndicator"
import { LeftTree } from "features/postflop-strategies/components/left-tree/LeftTree"
import { defaultSuitMapping } from "features/postflop-strategies/pftree-utils"
import { getActingPostflopPlayers } from "features/postflop-strategies/spot-utils"
import { ReactElement, useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useLazyGetTreeNodeQuery } from "services/postflop/api"
import { NodeTotalsInfo, PFTreeTotalNodes } from "services/postflop/types"
import { useDebounce } from "use-debounce"
import { selectSharedSims } from "./sharedSimsSlice"

export function SharedSimTree(): ReactElement | null {
  const { selectedEvent } = useSelector(selectSharedSims)
  const simData = selectedEvent?.simData

  const players = simData
    ? getActingPostflopPlayers(simData?.spotLookupInfo.players)
    : undefined

  const [loader, { isFetching }] = useLazyGetTreeNodeQuery()

  const [loadedNodes, setLoadedNodes] = useState<PFTreeTotalNodes | undefined>()

  // AG: We use debounce here because load tree in few requests and should not change state between requests
  const [loading] = useDebounce(isFetching, 200, {})

  const loadNode = useCallback(
    async (nodeId: string, treeID: string) => {
      const load = async (nodeId: string) => {
        const params: Record<string, string> =
          nodeId == rootNodeID ? {} : { depth: "1" }
        const query = await loader(
          {
            simId: treeID,
            nodeId: nodeId,
            params: params,
            library: "library",
          },
          true
        )

        return query
      }

      const pathNodes = [rootNodeID, ...nodeId.split(":").slice(2)]

      let newNodesLoaded = false
      let nodes: PFTreeTotalNodes | undefined =
        loadedNodes === undefined ? loadedNodes : Object.assign({}, loadedNodes)

      let node: NodeTotalsInfo | undefined = nodes?.[nodeId]

      let currentNode = ""
      for (const action of pathNodes) {
        currentNode =
          currentNode === "" ? rootNodeID : currentNode + ":" + action
        node = nodes?.[currentNode]
        if (!node) {
          const tree = await load(currentNode)
          if (tree.isError || tree.data == undefined) {
            return false
          }
          nodes = Object.assign({}, nodes || {}, tree.data.nodes)
          newNodesLoaded = true
          node = nodes?.[currentNode]
        }
        // we need to load CHILDRENS TOO!!!
        if (node) {
          if (node.nodeType != "SPLIT_NODE")
            for (const child of node.children) {
              const childID = `${currentNode}:${child}`
              if (nodes?.[childID] === undefined) {
                const childNodes = await load(childID)
                if (childNodes.isError || childNodes.data == undefined) {
                  return false
                }
                nodes = Object.assign({}, nodes, childNodes.data.nodes)
                newNodesLoaded = true
              }
            }
        }
      }

      node = nodes?.[nodeId]
      if (node == undefined) {
        const tree = await load(nodeId)
        if (tree.isError || tree.data == undefined) {
          return false
        }

        nodes = Object.assign({}, nodes || {}, tree.data.nodes)
        node = nodes?.[nodeId]
        newNodesLoaded = true
      }
      if (node) {
        if (node.nodeType != "SPLIT_NODE")
          for (const child of node.children) {
            const childID = `${nodeId}:${child}`
            if (nodes?.[childID] === undefined) {
              const childNodes = await load(childID)
              if (childNodes.isError || childNodes.data == undefined) {
                return false
              }
              nodes = Object.assign({}, nodes, childNodes.data.nodes)
              newNodesLoaded = true
            }
          }
      }

      if (newNodesLoaded) {
        setLoadedNodes(nodes)
      }

      return true
    },
    [loadedNodes, loader]
  )

  useEffect(() => {
    if (!simData || !simData.treeUUID) {
      return
    }

    loadNode(simData.expandedPath, simData.treeUUID).then((data) => {
      if (!data) {
        return
      }
    })
  }, [loadNode, simData])

  if (!selectedEvent) return null

  return (
    <Stack
      sx={{
        mx: { xs: "-16px", xxl: "-24px" },
        overflow: "hidden",
        flexGrow: 1,
        position: "relative",
      }}
    >
      {simData && players && (
        <LeftTree
          first={players.first}
          second={players.second}
          nodes={loadedNodes}
          gameCards={simData.treeLookupInfo.board || Array<string>(9).fill("")}
          requestedPath={simData.expandedPath}
          nodeToExplore={null}
          chooseNodeCallback={(): void | boolean => undefined}
          hideTooltips={true}
          showHandReviewQueue={false}
          chooseCardCallback={(): void | boolean => undefined}
          fixedRootNode={false}
          suitMapping={defaultSuitMapping}
        />
      )}
      {loading && <TreeLoadIndicator />}
    </Stack>
  )
}
