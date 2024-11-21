import CloseIcon from "@mui/icons-material/Close"
import { Box, Button, Stack, Typography } from "@mui/material"
import { ShareModal } from "features/hand-history/study-queue/ShareModal"
import { useShareAggregates } from "features/share/useShareAggregates"
import Flex from "lib/components/foundation/chatbot/Flex"
import { OctopiSelect } from "lib/components/OctopiSelect"
import ShareIcon from "lib/icons/share.svg?react"
import NotHandFiltered from "lib/images/not-hand-filtered.png"
import { ReactElement, useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  usePostSharingMarkLogsReadMutation,
  usePostSharingRejectMutation,
} from "services/access/api"
import { HandShareRequest } from "services/new-hand-history/types"
import { useSearchBy } from "../hands/hooks"

import { SharedHandSort } from "../hands/sharedHandsSlice"
import { OctopiSelectAll } from "../OctopiSelectAll"
import { SharedSimDetails } from "./SharedSimDetails"
import { SharedSimsList } from "./SharedSimsList"
import {
  selectSharedSims,
  setSharedSimsCheckedEvents,
  setSharedSimsSelectAll,
  setSharedSimsSelectedEvent,
  setSharedSimsSort,
  setSharedSimsToShare,
  SimToShare,
} from "./sharedSimsSlice"
import { useSharedSims } from "./useSharedSims"

export function SharedSimsContent(): ReactElement {
  const { data: rawSims } = useSharedSims()

  const { checkedEvents, count, sort, selectAll, sharedBy, simsToShare } =
    useSelector(selectSharedSims)

  const dispatch = useDispatch()
  const [setRead] = usePostSharingMarkLogsReadMutation()
  const [reject] = usePostSharingRejectMutation()

  const { submitShare } = useShareAggregates()

  const searchBy = useSearchBy()

  const submitShareSims = useCallback(
    (handShareRequest: HandShareRequest) => {
      if (simsToShare)
        submitShare({
          message: handShareRequest.message,
          allowResharing: handShareRequest.allowResharing,
          shareWithUserIds: handShareRequest.targetUserIds,
          aggregates: simsToShare.map((s) => ({
            id: s.id,
            type: "sim",
            metadata: s.metadata,
          })),
        }).finally(() => {
          dispatch(setSharedSimsToShare(undefined))
        })
    },
    [dispatch, simsToShare, submitShare]
  )

  useEffect(() => {
    if (!rawSims || rawSims.totalElements == 0) {
      dispatch(setSharedSimsSelectedEvent(undefined))
    }
  }, [dispatch, rawSims])

  return (
    <Flex sx={{ height: "100%", width: "100%", pb: "40px" }}>
      <Flex sx={{ flex: "1 0" }}>
        <Stack
          sx={{
            mr: { xl: "104px", md: 0 },
            gap: "16px",
            flex: "50% 0 0",
            maxWidth: "1005px",
            minWidth: "560px",
          }}
        >
          <Flex>
            <ShareModal
              type={"sim"}
              ids={simsToShare?.map(({ id }) => id) || []}
              open={!!simsToShare}
              onClose={(): unknown => dispatch(setSharedSimsToShare(undefined))}
              confirmModal={submitShareSims}
            />
            <Typography variant="b2" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Hands
              <Typography
                variant="b1"
                sx={{
                  flexGrow: 1,
                  p: "0 4px",
                  fontWeight: 400,
                  color: (theme) => theme.palette.custom.neutralgray04,
                }}
              >
                ({count})
              </Typography>
            </Typography>
            <Flex sx={{ alignItems: "center", ml: "auto", gap: "16px" }}>
              <Typography variant="b2" sx={{ flexGrow: 1, fontWeight: 600 }}>
                Sort by
              </Typography>
              <OctopiSelect
                value={sort}
                sx={{ width: "250px" }}
                placeholder="Sorting"
                onChange={(e) => {
                  dispatch(setSharedSimsSort(e.target.value as SharedHandSort))
                }}
                items={[
                  {
                    value: "NEWEST" satisfies SharedHandSort,
                    label: "Shared date (newest first)",
                  },
                  {
                    value: "OLDEST" satisfies SharedHandSort,
                    label: "Shared date (oldest first)",
                  },
                ]}
              />
            </Flex>
          </Flex>

          {!rawSims || rawSims.totalElements === 0 ? (
            <Box sx={{ m: "auto", flex: "1 0" }}>
              <img
                width="100%"
                height="100%"
                style={{ objectFit: "scale-down" }}
                src={NotHandFiltered}
              />
            </Box>
          ) : (
            <Stack sx={{ gap: "16px", flex: "1 0", height: "100%" }}>
              <Flex sx={{ alignItems: "center" }}>
                <Button
                  onClick={(): unknown =>
                    dispatch(
                      setSharedSimsCheckedEvents(
                        checkedEvents.size == rawSims.content.length
                          ? new Set()
                          : new Set(rawSims.content.map((e) => e.id))
                      )
                    )
                  }
                  size="small"
                  variant="text"
                  sx={{
                    "&.MuiButton-root": {
                      p: 0,
                      minWidth: 0,
                    },
                  }}
                >
                  {checkedEvents.size == rawSims.content.length
                    ? "Clear Selection"
                    : "Select all"}
                </Button>
                {checkedEvents.size > 0 && (
                  <Flex sx={{ gap: "24px", ml: "auto" }}>
                    <Button
                      onClick={(): unknown =>
                        dispatch(
                          setSharedSimsToShare(
                            Array.from(checkedEvents)
                              .map((id) => {
                                const event = rawSims.content.find(
                                  (x) => x.id == id && x.canShare
                                )

                                return event?.simData?.treeUUID
                                  ? {
                                      id: event.simData.treeUUID,
                                      metadata: event?.metadata,
                                    }
                                  : undefined
                              })
                              .filter<SimToShare>((x): x is SimToShare => !!x)
                          )
                        )
                      }
                      size="small"
                      variant="text"
                      disabled={
                        checkedEvents.size == rawSims.content.length &&
                        selectAll
                      }
                      sx={{
                        display: "flex",
                        gap: "8px",
                        ml: "auto",
                        "&.MuiButton-root": {
                          p: 0,
                          minWidth: 0,
                        },
                      }}
                    >
                      <ShareIcon
                        style={{
                          color: "custom.mainexodus",
                          height: "20px",
                          width: "20px",
                        }}
                      />
                      Share
                    </Button>
                    {sharedBy == "OTHER" && (
                      <Button
                        onClick={(): void | boolean => {
                          reject(
                            selectAll
                              ? {
                                  searchBy,
                                }
                              : {
                                  searchBy: {
                                    target: "selected-sharing-logs",
                                    sharingLogIds: Array.from(checkedEvents),
                                  },
                                }
                          ).then(() =>
                            dispatch(setSharedSimsCheckedEvents(new Set()))
                          )
                        }}
                        size="small"
                        variant="text"
                        sx={{
                          display: "flex",
                          gap: "8px",
                          ml: "auto",
                          "&.MuiButton-root": {
                            p: 0,
                            minWidth: 0,
                          },
                        }}
                      >
                        <CloseIcon
                          style={{
                            color: "custom.mainexodus",
                            height: "20px",
                            width: "20px",
                          }}
                        />
                        Remove
                      </Button>
                    )}
                    {sharedBy == "OTHER" && (
                      <Button
                        onClick={(): void | boolean => {
                          setRead(
                            selectAll
                              ? {
                                  searchBy,
                                }
                              : {
                                  searchBy: {
                                    target: "selected-sharing-logs",
                                    sharingLogIds: Array.from(checkedEvents),
                                  },
                                }
                          ).then(() =>
                            dispatch(setSharedSimsCheckedEvents(new Set()))
                          )
                        }}
                        size="small"
                        variant="text"
                        sx={{
                          display: "flex",
                          gap: "8px",
                          ml: "auto",
                          "&.MuiButton-root": {
                            p: 0,
                            minWidth: 0,
                          },
                        }}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </Flex>
                )}
              </Flex>
              {checkedEvents.size == rawSims.content.length && (
                <OctopiSelectAll
                  selectAll={!!selectAll}
                  onChange={(value): unknown =>
                    dispatch(setSharedSimsSelectAll(value))
                  }
                  totalCount={rawSims.totalElements || 0}
                  selectedCount={checkedEvents.size}
                  sx={{ mr: "12px" }}
                />
              )}
              <SharedSimsList />
            </Stack>
          )}
        </Stack>
        <Flex
          sx={{
            pl: { md: "64px", xl: 0 },
            flex: "50% 1 1",
            maxWidth: "764px",
            minWidth: "520px",
            "&:empty": { display: "none" },
          }}
        >
          <SharedSimDetails />
        </Flex>
      </Flex>
    </Flex>
  )
}
