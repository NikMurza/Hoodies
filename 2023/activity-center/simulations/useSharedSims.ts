import { skipToken } from "@reduxjs/toolkit/dist/query"
import { toAPILowerDate, toAPIUpperDate } from "lib/filters/DateRangeFilter"
import { SIMData, deserializeSIM } from "lib/postflop/postflopSlice"
import { useMemo } from "react"
import { useSelector } from "react-redux"
import {
  useGetSharingSearchLogsQuery,
  useSearchShareAggregatesQuery,
} from "services/access/api"
import { JsonNode, SearchBy } from "services/access/types"
import { HandType } from "../hands/sharedHandsSlice"
import { useSearchBy } from "./hooks"
import { selectSharedSims } from "./sharedSimsSlice"

export type SharingLog = {
  id: string
  handId: string
  sharedAt: string
  sharedByUserId: string
  sharedWithUserIds: string[]
  read?: boolean
  message?: string
  canShare?: boolean
  aggregateDeleted?: boolean
  holeCards?: string[]
  boardCards?: string[]
  simData?: SIMData
  metadata?: JsonNode
}

export type SharingLogData = {
  totalElements: number
  content?: SharingLog[]
}

export function useSharedSims() {
  const {
    page,
    rowsPerPage,
    sharedBy,
    sort,
    filter: { collaborator, dateRange },
  } = useSelector(selectSharedSims)
  const searchBy = useSearchBy()

  const sharedByMe = useSearchShareAggregatesQuery(
    sharedBy == "ME"
      ? {
          aggregateTypes: ["sim"],
          // NOTE: Should read as Current user shared (BY | WITH) collaborators
          sharingDirection: "WITH",
          userIds: collaborator ? [collaborator.id] : undefined,
          sharedAt: dateRange
            ? {
                start: toAPILowerDate(dateRange.lower),
                end: toAPIUpperDate(dateRange.upper),
              }
            : undefined,
          params: {
            rowsPerPage,
            page,
            sort: "sharedAt",
            direction: sort == "NEWEST" ? "desc" : "asc",
          },
        }
      : skipToken
  )

  const sharedWithMe = useGetSharingSearchLogsQuery(
    sharedBy == "OTHER"
      ? {
          searchBy: {
            ...searchBy,
            aggregateTypes: ["sim"],
          } as SearchBy,
          params: {
            rowsPerPage,
            page,
            sort: "sharedAt",
            direction: sort == "NEWEST" ? "desc" : "asc",
          },
        }
      : skipToken
  )

  const data = useMemo<SharingLog[] | undefined>(
    () =>
      sharedBy == "ME"
        ? sharedByMe.data?.content
            .map<SharingLog | undefined>(
              ({
                permissions,
                sharedWithUserIds,
                aggregate,
                metadata,
                ...serverLog
              }) =>
                aggregate && aggregate.type && aggregate.id
                  ? {
                      ...serverLog,
                      read: true,
                      handType: aggregate.type as HandType,
                      handId: aggregate.id,
                      sharedWithUserIds: sharedWithUserIds.content,
                      canShare: permissions.some((x) => x == "SHARE"),
                      simData:
                        metadata &&
                        "sim_state" in metadata &&
                        typeof metadata.sim_state == "string" &&
                        metadata.sim_state
                          ? deserializeSIM(metadata.sim_state)
                          : undefined,
                      metadata,
                    }
                  : undefined
            )
            .filter<SharingLog>((x): x is SharingLog => !!x)
        : sharedWithMe.data?.content
            .map<SharingLog | undefined>(
              ({
                aggregate,
                sharedWithUserId,
                sharing,
                aggregateDeleted,
                aggregateDetails,
                ...serverLog
              }) =>
                aggregate && aggregate.type && aggregate.id
                  ? {
                      ...serverLog,
                      sharedWithUserIds: [sharedWithUserId],
                      handType: aggregate.type as HandType,
                      handId: aggregate.id,
                      message: sharing?.message,
                      canShare: sharing?.permissions.some((x) => x == "SHARE"),
                      boardCards: aggregateDetails?.handDetails?.boardCards,
                      holeCards: aggregateDetails?.handDetails?.holeCards,
                      aggregateDeleted: aggregateDeleted,
                      simData:
                        sharing &&
                        sharing.metadata &&
                        "sim_state" in sharing.metadata &&
                        typeof sharing?.metadata.sim_state == "string" &&
                        sharing?.metadata.sim_state
                          ? deserializeSIM(sharing?.metadata.sim_state)
                          : undefined,
                      metadata: sharing?.metadata,
                    }
                  : undefined
            )
            .filter<SharingLog>((x): x is SharingLog => !!x),
    [sharedByMe.data?.content, sharedBy, sharedWithMe.data?.content]
  )

  return useMemo(() => {
    if (sharedBy == "ME") {
      const { data: rawData, ...query } = sharedByMe
      return {
        data:
          data && rawData
            ? ({
                content: data,
                totalElements: rawData?.totalElements,
              } satisfies SharingLogData)
            : undefined,
        ...query,
      }
    } else {
      const { data: rawData, ...query } = sharedWithMe

      return {
        data:
          data && rawData
            ? ({
                content: data,
                totalElements: rawData?.totalElements,
              } satisfies SharingLogData)
            : undefined,
        ...query,
      }
    }
  }, [data, sharedBy, sharedByMe, sharedWithMe])
}
