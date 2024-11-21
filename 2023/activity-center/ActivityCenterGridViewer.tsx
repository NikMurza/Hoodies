import { Typography } from "@mui/material"
import Flex from "lib/components/foundation/chatbot/Flex"
import {
  ContentGridView,
  ContentGridViewProps,
  NavigationMenuItem,
} from "lib/components/foundation/ContentGridView"
import FollowingIcon from "lib/icons/following.svg?react"
import ForumIcon from "lib/icons/forum.svg?react"
import HandsIcon from "lib/icons/hands-menu-icon.svg?react"
import ShareIcon from "lib/icons/share.svg?react"
import SimulationIcon from "lib/icons/simulation-icon.svg?react"

import { selectUserRoles } from "features/auth/authSlice"
import { isOctopiDevTeam } from "lib/roleHelperFunctions"
import { ReactElement, useMemo } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router"
import { useGetSharingUnreadLogsStatusQuery } from "services/access/api"
import { AggregateType, UnreadLogsStatus } from "services/access/types"
import { useGetNotificationsCountQuery } from "services/forum/api"
import {
  selectHasUnreadCountFollowedUserNotifations,
  selectUnreadCountFollowedUserNotifations,
} from "./following/notificationsSlice"

export function getTotalCount(
  aggregates: AggregateType[],
  status: UnreadLogsStatus[] | undefined
): number {
  return status
    ? aggregates.reduce(
        (sum, type) =>
          sum + (status.find((s) => s.aggregateType == type)?.count || 0),
        0
      )
    : 0
}

export const ActivityCenterGridViewer = (
  props: Omit<Partial<ContentGridViewProps>, "content"> & {
    content: ContentGridViewProps["content"]
    contentSxProps?: ContentGridViewProps["contentSxProps"]
  }
): ReactElement => {
  const page = "/activity-center"
  const roles = useSelector(selectUserRoles)
  const path = useLocation()
  const navigate = useNavigate()
  const currentTab = path.pathname
  const hasUnreadCountFollowedUserNotifations = useSelector(
    selectHasUnreadCountFollowedUserNotifations
  )
  const unreadCountFollowedUserNotifations = useSelector(
    selectUnreadCountFollowedUserNotifations
  )
  const unreadCountText = useMemo(
    () =>
      unreadCountFollowedUserNotifations > 100
        ? "100+"
        : unreadCountFollowedUserNotifations,
    [unreadCountFollowedUserNotifations]
  )

  const { data: notifications } = useGetSharingUnreadLogsStatusQuery()

  const { data: forumNotifications } = useGetNotificationsCountQuery()

  const showForum =
    import.meta.env.VITE_APP_OCTOPI_ENVIRONMENT == null ||
    ["dev", "staging"].includes(import.meta.env.VITE_APP_OCTOPI_ENVIRONMENT) ||
    isOctopiDevTeam(roles)

  const navigation: NavigationMenuItem[] = (
    [
      {
        label: "Sharing",
        endAdornment:
          getTotalCount(["hand", "sim", "hand.pokerbase"], notifications) >
          0 ? (
            <Flex
              sx={{
                width: 6,
                height: 6,
                bgcolor: "custom.mainexodus",
                borderRadius: "50%",
                ml: "4px",
              }}
            />
          ) : undefined,
        icon: <ShareIcon width={20} height={20} />,
        active: currentTab == `${page}/sharing`,
        children: [
          {
            label: "Hands",
            icon: <HandsIcon width={20} height={20} />,
            endAdornment:
              getTotalCount(["hand", "hand.pokerbase"], notifications) > 0 ? (
                <Typography
                  variant="label3"
                  sx={{
                    bgcolor: "custom.mainexodus",
                    borderRadius: "8px",
                    ml: "auto",
                    mr: "8px",
                    p: "3px 6px",
                    color: "custom.neutralwhite",
                  }}
                >
                  {getTotalCount(["hand", "hand.pokerbase"], notifications)}
                </Typography>
              ) : undefined,
            active: currentTab == `${page}/sharing/hands`,
            onClick: (): void => {
              navigate(`${page}/sharing/hands`)
            },
          },
          {
            label: "Sim",
            icon: <SimulationIcon width={20} height={20} />,
            endAdornment:
              getTotalCount(["sim"], notifications) > 0 ? (
                <Typography
                  variant="label3"
                  sx={{
                    bgcolor: "custom.mainexodus",
                    borderRadius: "8px",
                    ml: "auto",
                    mr: "8px",
                    p: "3px 6px",
                    color: "custom.neutralwhite",
                  }}
                >
                  {getTotalCount(["sim"], notifications)}
                </Typography>
              ) : undefined,
            active: currentTab == `${page}/sharing/simulations`,
            onClick: (): void => {
              navigate(`${page}/sharing/simulations`)
            },
          },
        ],
        onClick: (): void => {
          navigate(`${page}/sharing`)
        },
      },
      {
        label: "Following",
        icon: <FollowingIcon width={20} height={20} />,
        active: currentTab == `${page}/following`,
        onClick: (): void => {
          navigate(`${page}/following`)
        },
        endAdornment: hasUnreadCountFollowedUserNotifations ? (
          <Typography
            variant="label3"
            sx={{
              bgcolor: "custom.mainexodus",
              borderRadius: "8px",
              ml: "auto",
              mr: "8px",
              p: "3px 6px",
              color: "custom.neutralwhite",
            }}
          >
            {unreadCountText}
          </Typography>
        ) : (
          <></>
        ),
      },
      showForum
        ? {
            label: "Forum",
            icon: <ForumIcon width={20} height={20} />,
            active: currentTab == `${page}/forum`,
            onClick: (): void => {
              navigate(`${page}/forum`)
            },
            endAdornment: forumNotifications?.unread ? (
              <Typography
                variant="label3"
                sx={{
                  bgcolor: "custom.mainexodus",
                  borderRadius: "8px",
                  ml: "auto",
                  mr: "8px",
                  p: "3px 6px",
                  color: "custom.neutralwhite",
                }}
              >
                {forumNotifications?.unread}
              </Typography>
            ) : (
              <></>
            ),
          }
        : undefined,
    ] as (NavigationMenuItem | undefined)[]
  ).filter((item): item is NavigationMenuItem => item != null)

  return (
    <ContentGridView
      {...props}
      contentSxProps={props.contentSxProps || { px: "34px", py: "16px" }}
      title="Activity Center"
      navigationMenu={navigation}
      content={props.content}
      resizableLeftPane={false}
    />
  )
}
