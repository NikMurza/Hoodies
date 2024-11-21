import { Container, Grid, Typography } from "@mui/material"
import { useAuthUser } from "./hooks"

function Profile() {
  const profile = useAuthUser()

  if (!profile) return <>No user</>

  return (
    <Container>
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12}>
          <Typography variant="h4">Profile</Typography>
        </Grid>

        <Grid item xs={2}>
          <Typography variant="subtitle1">Avatar</Typography>
        </Grid>
        <Grid item xs={10}>
          <img src={profile.avatarImageUrl} />
        </Grid>

        <Grid item xs={2}>
          <Typography variant="subtitle1">Email</Typography>
        </Grid>
        <Grid item xs={10}>
          {profile.email.value}
        </Grid>

        <Grid item xs={2}>
          <Typography variant="subtitle1">Name</Typography>
        </Grid>
        <Grid item xs={10}>
          {profile.name?.value}
        </Grid>
      </Grid>
    </Container>
  )
}

export default Profile
