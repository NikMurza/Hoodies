import CloseIcon from "@mui/icons-material/Close"
import {
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material"
import { selectCurrentUser } from "features/auth/authSlice"
import { BoardCardsRow } from "lib/components/foundation/BoardCardsRow"
import { WLPCheckbox } from "lib/components/foundation/WLPCheckbox"
import Flex from "lib/components/foundation/chatbot/Flex"
import { dateToString } from "lib/hand-history/utilities"
import ShareIcon from "lib/icons/share.svg?react"
import { useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  usePostSharingMarkLogsReadMutation,
  usePostSharingRejectMutation,
} from "services/access/api"
import { SharedAvatars } from "../SharedAvatars"
import {
  selectSharedSims,
  setSharedSimsCheckedEvents,
  setSharedSimsSelectedEvent,
  setSharedSimsToShare,
} from "./sharedSimsSlice"
import { SharedSimEvent } from "./useFullfilledSharedSims"

export function SharedSimCard({
  event,
  index,
}: {
  event: SharedSimEvent
  index: number
}) {
  const theme = useTheme()
  const dispatch = useDispatch()
  const { selectedEvent, checkedEvents, page, rowsPerPage } =
    useSelector(selectSharedSims)
  const user = useSelector(selectCurrentUser)

  const [setRead] = usePostSharingMarkLogsReadMutation()
  const [reject] = usePostSharingRejectMutation()

  const navigate = useNavigate()

  const isSelected = useMemo(
    () => selectedEvent && event.id == selectedEvent.id,
    [event.id, selectedEvent]
  )
  const isChecked = useMemo(
    () => checkedEvents.has(event.id),
    [checkedEvents, event.id]
  )

  const boardCards = useMemo(
    () =>
      event.simData?.treeLookupInfo.board
        ? event.simData?.treeLookupInfo.board
        : [],
    [event.simData?.treeLookupInfo.board]
  )

  const cardInfo = useMemo(
    () =>
      `${event.simData?.spotLookupInfo.action} ${event.simData?.spotLookupInfo.players[0]} vs ${event.simData?.spotLookupInfo.players[1]}`,
    [
      event.simData?.spotLookupInfo.action,
      event.simData?.spotLookupInfo.players,
    ]
  )

  const isRead = useMemo(() => event.read, [event.read])

  return (
    <Stack
      onClick={(): void | boolean => {
        dispatch(setSharedSimsSelectedEvent(event))

        !isRead &&
          setRead({
            searchBy: {
              target: "selected-sharing-logs",
              sharingLogIds: [event.id],
            },
          })
      }}
      sx={{
        pointerEvents: "all",
        border: isSelected
          ? `2px solid ${theme.palette.custom.mainexodus}`
          : `1.5px solid ${theme.palette.custom.mainexodus40}`,
        cursor: "pointer",
        borderRadius: "10px",
        p: "8px",
        gap: "12px",
        backgroundColor: isRead ? "white" : "custom.extralightexodus",
        mb: "16px",
        width: "100%",
        "&:hover": {
          bgcolor: "custom.mainexoduslight",
        },
      }}
    >
      <Flex sx={{ gap: "8px", alignItems: "center", flexGrow: 1, minWidth: 0 }}>
        <WLPCheckbox
          onClick={(e) => e.stopPropagation()}
          onChange={(_, value) => {
            const newSet = new Set(checkedEvents)

            if (!value) newSet.delete(event.id)
            else newSet.add(event.id)

            dispatch(setSharedSimsCheckedEvents(newSet))
          }}
          checked={isChecked}
        />

        <BoardCardsRow boardCards={boardCards} />
        {event.simData && (
          <Flex
            sx={{
              gap: "8px",
              alignItems: "center",
              minWidth: 0,
            }}
          >
            <Tooltip title={cardInfo} placement="top-start">
              <Typography
                sx={{
                  overflowX: "hidden",
                  textOverflow: "ellipsis",
                  fontWeight: isRead ? "unset" : 600,
                }}
                variant="b3"
                color="custom.neutralblack"
              >
                {cardInfo}
              </Typography>
            </Tooltip>

            <Typography variant="b3" color="custom.neutralgray01">
              &bull;
            </Typography>
            <Typography
              sx={{
                overflowX: "hidden",
                textOverflow: "ellipsis",
                fontWeight: isRead ? "unset" : 600,
              }}
              variant="b3"
              color="custom.neutralblack"
            >
              Postflop
            </Typography>

            {!isRead && (
              <Flex
                sx={{
                  borderRadius: "50%",
                  width: 6,
                  height: 6,
                  flexShrink: 0,
                  bgcolor: "custom.mainexodus",
                }}
              />
            )}
          </Flex>
        )}

        <Flex sx={{ ml: "auto", alignItems: "center", gap: "16px" }}>
          {event.canShare && (
            <Tooltip title="Share hand" placement="top-start">
              <IconButton
                onClick={(): void | boolean => {
                  event.simData?.treeUUID &&
                    dispatch(
                      setSharedSimsToShare([
                        {
                          id: event.simData.treeUUID,
                          metadata: event.metadata,
                        },
                      ])
                    )
                }}
                disabled={!event.canShare}
                size="small"
              >
                <ShareIcon
                  style={{
                    color: theme.palette.custom.mainexodus,
                    height: "20px",
                    width: "20px",
                  }}
                />
              </IconButton>
            </Tooltip>
          )}
          {user?.id !== event.sharedByUserId && (
            <Tooltip title="Remove" placement="top-start">
              <IconButton
                size="small"
                aria-label="remove"
                onClick={(e) => {
                  e.stopPropagation()
                  reject({
                    searchBy: {
                      target: "selected-sharing-logs",
                      sharingLogIds: [event.id],
                    },
                  })
                }}
              >
                <CloseIcon
                  style={{
                    color: theme.palette.custom.mainexodus,
                    height: "20px",
                    width: "20px",
                  }}
                />
              </IconButton>
            </Tooltip>
          )}
        </Flex>
      </Flex>

      <Flex>
        <SharedAvatars event={event} />
        <Flex sx={{ ml: "auto", alignItems: "center", gap: "16px" }}>
          <Flex
            sx={{
              bgcolor: "#5C50BD",
              borderRadius: "6px",
              typography: "b3",
              p: "4px 10.5px",
              color: "white",
            }}
          >
            Library
          </Flex>
          <Typography variant="b3" color="custom.neutralgray01">
            {dateToString(new Date(event.sharedAt))}
          </Typography>
          <Flex sx={{ gap: "16px", alignItems: "center" }}>
            <Button
              sx={{
                padding: "6px 22px",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "custom.mainexodusmedium",
                  boxShadow: "none",
                },
                "&:active": {
                  backgroundColor: "#7E70EA",
                  boxShadow: "none",
                },
              }}
              variant="contained"
              onClick={(): void => {
                if (
                  event.metadata &&
                  "sim_state" in event.metadata &&
                  typeof event.metadata.sim_state == "string" &&
                  event.metadata.sim_state
                )
                  navigate(
                    `/analysis/postflop-strategies?sim=${event.metadata.sim_state}`
                  )
              }}
            >
              Review
            </Button>
          </Flex>
        </Flex>
      </Flex>
      {event.message && (
        <Flex sx={{ gap: "16px" }}>
          <Typography
            variant="b3"
            color="custom.neutralblack"
            sx={{
              whiteSpace: "pre-line",
            }}
          >
            {event.message}
          </Typography>
        </Flex>
      )}
    </Stack>
  )
}
