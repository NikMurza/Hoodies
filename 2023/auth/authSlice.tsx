import { IdToken } from "@auth0/auth0-spa-js"
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "app/store"
import { jwtDecode } from "jwt-decode"
import { getErrorData, MustLinkAccountError, UserProfile } from "services/types"
import { userApi } from "../../services/userApi"

interface AuthState {
  userProfile: null | UserProfile
  auth0Token: null | string
  auth0IdToken: null | IdToken
  authenticationError: null | {
    type: "access_denied" | string
    description: string | null
  }
  auth0Roles: string[]
  auth0Permissions: string[]
}

const slice = createSlice({
  name: "auth",
  initialState: {
    userProfile: null,
    auth0Token: null,
    authenticationError: null,
    auth0Roles: [] as string[],
    auth0Permissions: [] as string[],
  } as AuthState,
  reducers: {
    setUserProfile: (
      state,
      { payload: { user } }: PayloadAction<{ user: UserProfile }>
    ) => {
      state.userProfile = user
    },
    setAuth0Token: (
      state,
      { payload: { auth0Token } }: PayloadAction<{ auth0Token: string }>
    ) => {
      state.auth0Token = auth0Token
      const decode: {
        iss?: string
        sub?: string
        aud?: string[] | string
        exp?: number
        nbf?: number
        iat?: number
        jti?: string
        permissions: string[]
      } = jwtDecode(auth0Token)
      state.auth0Permissions = decode.permissions
    },
    setAuth0IdToken: (
      state,
      { payload: { auth0IdToken } }: PayloadAction<{ auth0IdToken: IdToken }>
    ) => {
      state.auth0IdToken = auth0IdToken
      state.auth0Roles = ((auth0IdToken["octopipoker/roles"] || []) as string[])
        .filter((r) => !!r)
        .map((r) => r.toLowerCase())
    },
    appLogout: (state) => {
      state.userProfile = null
      state.auth0Token = null
    },
    setAuthenticationError: (
      state,
      {
        payload: { type, description },
      }: PayloadAction<{ type: string; description: string | null }>
    ) => {
      state.authenticationError = { type, description }
    },
    clearAuthenticationError: (state) => {
      state.authenticationError = null
    },
  },
})

export const {
  setUserProfile,
  setAuth0Token,
  setAuth0IdToken,
  appLogout,
  setAuthenticationError,
} = slice.actions

export default slice.reducer

export const selectCurrentUser = (state: RootState) => state.auth.userProfile
export const selectAuth0Token = (state: RootState) => state.auth.auth0Token

export const selectAuthenticationError = (state: RootState) =>
  state.auth.authenticationError

export const selectMustLinkProfiles = createSelector(
  [(state) => state],
  (state) => {
    const error = userApi.endpoints.profile.select()(state)?.error
    const data = getErrorData<MustLinkAccountError>(error)
    return (
      (data?.exceptionClass?.includes("MustLinkAccount") &&
        !!data?.linkToProfile) ||
      false
    )
  }
)

export const selectProfileToLink = createSelector(
  [(state) => state],
  (state) => {
    const error = userApi.endpoints.profile.select()(state)?.error
    const data = getErrorData<MustLinkAccountError>(error)
    if (
      !data?.exceptionClass?.includes("MustLinkAccount") ||
      !data?.linkToProfile
    ) {
      return undefined
    }
    return data.linkToProfile
  }
)

export const selectAuth0IdToken = (state: RootState) => state.auth.auth0IdToken

export const selectUserRoles = (state: RootState) => state.auth.auth0Roles

export const selectUserPermissions = (state: RootState) =>
  state.auth.auth0Permissions

export const selectUserProfile = (state: RootState) => state.auth.userProfile

export const selectUiPreferences = createSelector(
  selectUserProfile,
  (userProfile) => userProfile?.uiPreferences
)
