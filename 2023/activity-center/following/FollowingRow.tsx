import { Button, Stack, Tooltip, Typography } from "@mui/material"
import analytics from "analytics/analytics"
import { FOLLOW, UNFOLLOW } from "analytics/events"
import { uiSettingsContext } from "lib/components/UISettingsContext"
import Flex from "lib/components/foundation/chatbot/Flex"
import { UserAvatar } from "lib/components/foundation/profile/UserAvatar"
import {
  selectSelectedFollowingId,
  setFollowingsSelectedId,
} from "lib/following/followingSlice"
import { dateToString } from "lib/hand-history/utilities"
import { useOctopiTheme } from "lib/useTheme"
import { ReactElement, useContext, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link as RouterLink } from "react-router-dom"
import { useReadNotificationsMutation } from "services/notification/notificationApi"
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
} from "services/userApi"
import { NicknameTypography } from "./NicknameTypography"
import { Following } from "./useFullfilledFolowings"

interface FollowingRowProps {
  following: Following
}

export function FollowingRow({ following }: FollowingRowProps): ReactElement {
  const theme = useOctopiTheme()
  const uiContext = useContext(uiSettingsContext)
  const dispatch = useDispatch()

  const {
    read,
    followerAvatarUrl,
    followerNickname,
    followerName,
    sentAt,
    id,
  } = following
  const [isHovered, setIsHovered] = useState(false)
  const selectedId = useSelector(selectSelectedFollowingId)

  const isSelected = selectedId === id
  const buttonSize = { px: "5px", py: "6px", minWidth: "96px" }
  const buttonSizeOulined = { ...buttonSize, py: "5px" } //due to border of a outlined button
  const dotSize = 6

  const background = isSelected
    ? theme.palette.custom.extralightexodus
    : theme.palette.custom.neutralwhite,

  const borderBottom = `1px solid ${isSelected || isHovered
      ? theme.palette.custom.neutralwhite
      : theme.palette.custom.neutralgray05
    }`

  const [unfollowUser] = useUnfollowUserMutation()
  const [followUser] = useFollowUserMutation()
  const [readNotifications] = useReadNotificationsMutation()

  const readNotification = (id: string): void => {
    if (!read) {
      // TODO Add allert for success \ error
      readNotifications([id]).unwrap()
    }
  }

  const onRowClick = (): void => {
    dispatch(setFollowingsSelectedId(id))
    readNotification(id.toString())
  }

  const followingUser = (): Promise<void> | undefined => {
    if (!followerNickname) {
      return
    }

    return followUser(followerNickname)
      .unwrap()
      .then(() => {
        uiContext.showSuccessMessage("Follow " + followerNickname)
        analytics.track(FOLLOW)
        dispatch(setFollowingsSelectedId(undefined))
      })
  }

  const unfollowingUser = (): Promise<void> | undefined => {
    if (!followerNickname) {
      return
    }
    return unfollowUser(followerNickname)
      .unwrap()
      .then(() => {
        uiContext.showSuccessMessage("Unfollow " + followerNickname)
        analytics.track(UNFOLLOW)
        dispatch(setFollowingsSelectedId(undefined))
      })
  }
  return (
    <>
      <Stack justifyContent="center" paddingRight="4px">
        {!read ? (
          <Flex
            sx={{
              width: dotSize,
              height: dotSize,
              bgcolor: "custom.mainexodus",
              borderRadius: "50%",
            }}
          />
        ) : (
          <Flex sx={{ width: dotSize }} />
        )}
      </Stack>
      <Stack
        onClick={onRowClick}
        onMouseOver={(): void | boolean => setIsHovered(true)}
        onMouseOut={(): void | boolean => setIsHovered(false)}
        sx={{
          flex: "1 0",
          cursor: "pointer",
          overflowX: "hidden",
        }}
      >
        <Flex
          sx={{
            p: "8px",
            gap: "24px",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "10px",
            backgroundColor: background
            "&:hover": {
              bgcolor: theme.palette.custom.mainexodus20,
            },
          }}
        >
          <Stack width={"100%"}>
            {!!followerNickname && (
              <Flex
                component={RouterLink}
                to={`/account/${followerNickname}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <UserAvatar
                  avatarImageUrl={followerAvatarUrl}
                  nickname={followerNickname}
                  size="32px"
                />
                <Tooltip title={followerNickname} placement="top-start">
                  <>
                    <NicknameTypography
                      nickname={followerName || followerNickname}
                    />
                  </>
                </Tooltip>
              </Flex>
            )}
          </Stack>

          <Typography
            variant="b3"
            noWrap
            minWidth={"150px"}
            fontWeight={!read ? 600 : 400}
          >
            started following me
          </Typography>
          <Typography
            variant="b3"
            minWidth={"70px"}
            fontWeight={!read ? 600 : 400}
          >
            {sentAt ? dateToString(new Date(sentAt)) : ""}
          </Typography>
          {following && !following.myFollowing ? (
            <Button
              sx={{ ...buttonSize }}
              variant="contained"
              onClick={followingUser}
            >
              Follow back
            </Button>
          ) : (
            <Button
              sx={{ ...buttonSizeOulined }}
              variant="outlined"
              onClick={unfollowingUser}
            >
              Unfollow
            </Button>
          )}
        </Flex>

        <Stack
          borderBottom={borderBottom}
        />
      </Stack>
    </>
  )
}
