import { RootState } from "app/store"
import { ReasonDetail, StatusDTO } from "services/notification/types"

const defaultStatusDTO = { unreadCount: 0, reasonDetails: [] } as StatusDTO

// TODO Rewrite this to normal state part called notifications(for example)
const selectNotifations = (state: RootState): StatusDTO =>
  state.api?.queries["unreadCount(undefined)"]?.data
    ? (state.api?.queries["unreadCount(undefined)"]?.data as StatusDTO)
    : defaultStatusDTO

export const selectUnreadFollowedUserNotifations = (
  state: RootState
): ReasonDetail | undefined =>
  selectNotifations(state).reasonDetails?.find(
    (r) => r.reason === "follow:user"
  ) || ({} as ReasonDetail)

export const selectUnreadCountFollowedUserNotifations = (
  state: RootState
): number => selectUnreadFollowedUserNotifations(state)?.unreadCount || 0

export const selectHasUnreadCountFollowedUserNotifations = (state: RootState) =>
  selectUnreadCountFollowedUserNotifations(state) > 0
