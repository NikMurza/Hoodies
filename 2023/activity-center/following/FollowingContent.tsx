import { Button, Stack, Typography } from "@mui/material"
import { OctopiSelect } from "lib/components/OctopiSelect"
import Flex from "lib/components/foundation/chatbot/Flex"
import {
  FollowingSort,
  selectFollowings,
  selectFollowingsCount,
  setFollowingsSelectedId,
  setFollowingsSort,
} from "lib/following/followingSlice"
import { ReactElement } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useReadAllNotificationsMutation } from "services/notification/notificationApi"
import analytics from "../../../../analytics/analytics"
import { ACTIVITY_CENTER_READ_ALL } from "../../../../analytics/events"
import { FollowingList } from "./FollowingList"

export const sorters = [
  { value: "sentAt,desc", label: "Date (newest first)" },
  { value: "sentAt,asc", label: "Date (oldest first)" },
  { value: "isRead,asc", label: "State (unread first)" },
]

export function FollowingContent(): ReactElement {
  const { sort } = useSelector(selectFollowings)

  const dispatch = useDispatch()
  const unreadCount = useSelector(selectFollowingsCount)

  const [readAllNotifications] = useReadAllNotificationsMutation()
  const readNotifications = (): void => {
    // TODO Add allert for success \ error
    readAllNotifications().unwrap()
    analytics.track(ACTIVITY_CENTER_READ_ALL)
    dispatch(setFollowingsSelectedId(undefined))
  }

  return (
    <Flex sx={{ height: "100%", flex: "1 0", overflowX: "auto" }}>
      <Flex sx={{ flex: "1 0" }}>
        <Stack>
          <Flex pl="10px" alignItems="center">
            <Typography variant="b2" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Notifications
              <Typography
                variant="b1"
                sx={{
                  flexGrow: 1,
                  p: "0 4px",
                  fontWeight: 400,
                  color: (theme) => theme.palette.custom.neutralgray04,
                }}
              >
                ({unreadCount})
              </Typography>
            </Typography>
            <Flex sx={{ alignItems: "center", ml: "auto", gap: "16px" }}>
              <Typography variant="b2" sx={{ flexGrow: 1, fontWeight: 600 }}>
                Sort by
              </Typography>
              <OctopiSelect
                value={sort}
                sx={{ width: "218px" }}
                placeholder="Sort by"
                onChange={(e) => {
                  dispatch(setFollowingsSort(e.target.value as FollowingSort))
                }}
                items={sorters}
              />
            </Flex>
          </Flex>
          <Stack sx={{ gap: "16px", flex: "1 0" }}>
            <Flex sx={{ alignItems: "center" }}>
              <Flex sx={{ gap: "24px", ml: "auto" }}>
                <Button
                  onClick={(): void | boolean => readNotifications()}
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
              </Flex>
            </Flex>
            <FollowingList />
          </Stack>
        </Stack>
      </Flex>
    </Flex>
  )
}
