import { useAuth0 } from "@auth0/auth0-react"
import {
  Avatar,
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  Typography,
  useTheme,
} from "@mui/material"
import LoginButton from "./LoginButton"
import LogoutButton from "./LogoutButton"

export default function ProfilePage() {
  const { user } = useAuth0()

  const theme = useTheme()

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        {!user && (
          <>
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h3">Sign in</Typography>
              <Box sx={{ pt: 2 }} />
              <LoginButton />
            </Box>
          </>
        )}
        {user && (
          <>
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h1 id="page-title" className="content__title">
                Profile Page
              </h1>
              <div className="content__body">
                <Avatar
                  variant="rounded"
                  sx={{ width: 80, height: 80, mt: 2 }}
                  src={user.picture}
                />
                <Box sx={{ pt: 2 }}></Box>
                <div className="profile__headline">
                  <div className="profile__title">Username: {user.name}</div>
                  <div className="profile__description">
                    Email :{user.email}
                  </div>
                </div>
              </div>
              <Box sx={{ pt: 2 }}></Box>
              <LogoutButton />
            </Box>
          </>
        )}
      </Container>
    </ThemeProvider>
  )
}
