import { Tooltip, Typography } from "@mui/material"
import Flex from "lib/components/foundation/chatbot/Flex"
import { UserAvatar } from "lib/components/foundation/profile/UserAvatar"
import { Link as RouterLink } from "react-router-dom"
import { SearchPublicUser } from "services/types"

export function UserInfo({
  user,
  title,
  isPokerbase,
  alignItemsEnd,
}: {
  user?: SearchPublicUser
  title?: string
  isPokerbase?: boolean
  alignItemsEnd?: boolean
}) {
  if (!user) return null

  return (
    <Flex
      sx={{
        gap: "4px",
        alignItems: alignItemsEnd ? "end" : "center",
      }}
    >
      {title && <Typography variant="b3">{title}</Typography>}
      <Flex
        component={RouterLink}
        to={`/account/${user.nickname}`}
        sx={{
          alignItems: alignItemsEnd ? "end" : "center",
        }}
      >
        <UserAvatar
          avatarImageUrl={user.avatarImageUrl}
          nickname={user.name || user.nickname}
          size="32px"
        />
        <Tooltip title={user.name || user.nickname} placement="top-start">
          <Typography
            variant="b3"
            sx={{
              cursor: "pointer",
              color: isPokerbase ? "pokerbase.golden6" : "custom.mainexodus70",
              fontWeight: 600,
              ml: "4px",
              maxWidth: { xl: "150px", lg: "120px", xs: "100px" },
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {user.name || user.nickname}
          </Typography>
        </Tooltip>
      </Flex>
    </Flex>
  )
}
