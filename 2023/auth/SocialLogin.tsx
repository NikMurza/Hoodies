import { Box, Button, Link } from "@mui/material"
import discordLogo from "./images/discord-logo.png"
import googleLogo from "./images/google-logo.png"

const OAUTH2_REDIRECT_URI = window.location.href
const GOOGLE_AUTH_URL =
  "/oauth2/authorization/google?redirect_uri=" + OAUTH2_REDIRECT_URI
const DISCORD_AUTH_URL =
  "/oauth2/authorization/discord?redirect_uri=" + OAUTH2_REDIRECT_URI

export default function SocialLogin() {
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Link href={GOOGLE_AUTH_URL} variant="b2" sx={{ flexGrow: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            sx={{ whiteSpace: "nowrap", height: "56px" }}
          >
            <img src={googleLogo} alt="Google" height="56px" />
            Log in with Google
          </Button>
        </Link>
      </Box>
      <Box sx={{ pt: 2 }} />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Link href={DISCORD_AUTH_URL} variant="b2" sx={{ flexGrow: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            sx={{ whiteSpace: "nowrap", height: "56px" }}
          >
            <img src={discordLogo} alt="Google" height="56px" />
            Log in with Discord
          </Button>
        </Link>
      </Box>
    </Box>
  )
}
