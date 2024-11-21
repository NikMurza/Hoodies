import { AuthorizationParams, useAuth0 } from "@auth0/auth0-react"
import { BackdropLoader } from "lib/components/BackdropLoader"
import { ReactElement, useCallback, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { selectCurrentUser } from "./authSlice"
import { useTrackdeskCookieCid } from "./hooks"

export default function SignIn({
  action = "login",
  referrer = "",
}: {
  referrer?: string
  action?: "login" | "signup"
}) {
  const navigate = useNavigate()
  const user = useSelector(selectCurrentUser)
  const cid = useTrackdeskCookieCid()
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0()

  const handleLogin = useCallback(async () => {
    const authorizationParams: AuthorizationParams = {
      prompt: "login",
      screen_hint: action,
      redirect_uri: `${window.location.origin}/analysis`,
    }

    // add cid param name into authorizationParams
    // when it's set
    // otherwise do not add it even with null or undefined value
    if (cid) {
      authorizationParams.affiliateCode = cid
    }

    await loginWithRedirect({
      authorizationParams: { ...authorizationParams },
      appState: {
        returnTo: referrer,
        loginType: action,
      },
    })
  }, [action, cid, loginWithRedirect, referrer])

  useEffect(() => {
    if (!user && !isAuthenticated && !isLoading) {
      handleLogin()
    }
    if (user) {
      navigate("/")
    }
  }, [handleLogin, user, isAuthenticated, isLoading, navigate])

  return <BackdropLoader />
}
export const SignInReferrer = () => (
  <SignIn referrer={window.location.pathname} />
)

export const SignUp = (): ReactElement => {
  return <SignIn action="signup" />
}
