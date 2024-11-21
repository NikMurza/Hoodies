import { useCookies } from "react-cookie"
import { UserProfile } from "services/types"
import { useProfileQuery } from "services/userApi"

const trackdeskCookieName = "trakdesk_cid"

export function useAuthUser(): UserProfile | undefined {
  const profileQuery = useProfileQuery()

  if (profileQuery.error) {
    return undefined
  }

  return profileQuery.data
}

export function useTrackdeskCookieCid(): string | undefined {
  const [cookies] = useCookies()

  if (
    cookies &&
    cookies[trackdeskCookieName] &&
    cookies[trackdeskCookieName]?.cid
  ) {
    return cookies[trackdeskCookieName]?.cid
  }

  return undefined
}

export function useClearTrackdeskCookieCid(): () => void {
  const [cookies, _setCookie, removeCookie] = useCookies()

  if (
    cookies &&
    cookies[trackdeskCookieName] &&
    cookies[trackdeskCookieName]?.cid
  ) {
    return () => removeCookie(trackdeskCookieName)
  }
  return () => undefined
}
