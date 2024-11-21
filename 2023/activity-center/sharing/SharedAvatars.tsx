import { AvatarGroup, Box, Theme, Tooltip } from "@mui/material"
import { SystemStyleObject } from "@mui/system"
import { selectCurrentUser } from "features/auth/authSlice"
import Flex from "lib/components/foundation/chatbot/Flex"
import { UserAvatar } from "lib/components/foundation/profile/UserAvatar"
import { useSelector } from "react-redux"
import { Link as RouterLink } from "react-router-dom"
import { UserInfo } from "./UserInfo"
import { SharedHandBase } from "./hands/useFullfilledSharedHands"

export function SharedAvatars({
  event,
  isPokerbase,
  alignItemsEnd,
}: {
  event: SharedHandBase
  isPokerbase?: boolean
  alignItemsEnd?: boolean
}) {
  const user = useSelector(selectCurrentUser)

  return event.sharedBy && user?.id != event.sharedBy.id ? (
    <UserInfo
      user={event.sharedBy}
      isPokerbase={isPokerbase}
      alignItemsEnd={alignItemsEnd}
    />
  ) : event.sharedWith.length == 0 ? null : event.sharedWith.length == 1 ? (
    <UserInfo
      user={event.sharedWith[0]}
      isPokerbase={isPokerbase}
      alignItemsEnd={alignItemsEnd}
    />
  ) : (
    <Flex sx={{ alignItems: alignItemsEnd ? "end" : "center", gap: "8px" }}>
      <AvatarGroup
        max={7}
        total={event.sharedWith.length}
        spacing={"small"}
        sx={(theme): SystemStyleObject<Theme> => ({
          "& .MuiAvatarGroup-avatar.MuiAvatar-colorDefault": {
            position: "initial !important",
            boxSizing: "inherit",
            zIndex: event.sharedWith.length,
            borderColor: "custom.mainexodus",
            border: "2px solid",
          },
          "& .MuiAvatarGroup-avatar": {
            width: 32,
            height: 32,
            color: theme.palette.custom.mainexodus,
            background: theme.palette.custom.mainexoduslight,
            borderRadius: "25%",
            fontFamily: "Inter",
            fontWeight: 700,
            fontSize: 12,
            lineHeight: "16px",
            border: "2px solid",
            borderColor: "custom.neutralwhite",
          },
        })}
      >
        {event.sharedWith.map((u, idx) => {
          return (
            <Tooltip
              key={idx}
              title={u.name || u.nickname}
              placement="top-start"
            >
              <Box
                component={RouterLink}
                to={`/account/${u.nickname}`}
                zIndex={idx}
              >
                <UserAvatar
                  avatarImageUrl={u.avatarImageUrl}
                  nickname={u.name || u.nickname}
                  size="100%"
                />
              </Box>
            </Tooltip>
          )
        })}
      </AvatarGroup>
    </Flex>
  )
}
