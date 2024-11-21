import { skipToken } from "@reduxjs/toolkit/dist/query"
import { toAPIDateRange } from "lib/filters/DateRangeFilter"
import { selectFollowings } from "lib/following/followingSlice"
import { useMemo } from "react"
import { useSelector } from "react-redux"
import { useSearchNotificationsQuery } from "services/notification/notificationApi"
import { useGetUsersByIdsV2Query } from "services/userApi"
import { selectUnreadCountFollowedUserNotifations } from "./notificationsSlice"

export type Following = {
  id: number
  read: boolean
  sentAt: Date
  followerName: string
  followerNickname: string
  followerAvatarUrl: string
  myFollowing: boolean
}

export function useFullfilledFolowings() {
  const {
    page,
    rowsPerPage,
    sort,
    filter: { collaborator, state, dateRange },
  } = useSelector(selectFollowings)
  const unread = useSelector(selectUnreadCountFollowedUserNotifations)

  const { data: followNotifications } = useSearchNotificationsQuery({
    reasons: ["follow:user"],
    senders:
      !!collaborator && !!collaborator.id ? [collaborator.id] : undefined,
    read:
      !state || (state && (state?.length === 0 || state?.length === 2))
        ? undefined
        : state[0],
    between:
      !dateRange || !(dateRange.lower && dateRange.upper)
        ? undefined
        : toAPIDateRange(dateRange),
    params: {
      pageSize: rowsPerPage,
      pageNumber: page,
      sort: sort,
      trigger: unread,
    },
  })

  const usersQuery = useGetUsersByIdsV2Query(
    followNotifications && followNotifications.numberOfElements > 0
      ? {
          userIds: Array.from(
            new Set(followNotifications.content.map((f) => f.sender || ""))
          ),
        }
      : skipToken
  )
  const { data: users } = usersQuery

  const followings = useMemo<Following[]>(() => {
    return !!followNotifications && !!followNotifications.content && !!users
      ? (followNotifications.content.map((f) => {
          const {
            name: followerName,
            nickname: followerNickname,
            avatarImageUrl: followerAvatarUrl,
            myFollowing,
          } = users.find((u) => f.sender === u.id) || {}

          const { id, read, sentAt } = f

          return {
            id,
            read,
            sentAt,
            followerName,
            followerNickname,
            followerAvatarUrl,
            myFollowing,
          } as unknown as Following
        }) as Following[])
      : []
  }, [followNotifications, users])

  return {
    followings,
    totalElements: followNotifications?.totalElements,
  }
}
