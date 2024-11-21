import { Typography } from "@mui/material"
import { ReactElement } from "react"

type NicknameTypography = {
  nickname: string
}

export function NicknameTypography({
  nickname,
}: NicknameTypography): ReactElement {
  return (
    <Typography
      variant="b3"
      sx={{
        cursor: "pointer",
        fontWeight: 600,
        maxWidth: { xl: "200px", lg: "150px", md: "100px", sm: "100px" },
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      {nickname}
    </Typography>
  )
}
