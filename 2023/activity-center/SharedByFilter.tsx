import { FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material"
import { SharedBy } from "./sharing/hands/sharedHandsSlice"

export interface SharedByFilterProps {
  changeFilter: (filter: SharedBy) => void
  filter?: SharedBy
}
export const SharedByFilter = ({
  filter,
  changeFilter,
}: SharedByFilterProps) => {
  return (
    <RadioGroup
      value={filter}
      onChange={(e) => changeFilter(e.target.value as SharedBy)}
      sx={{
        display: "flex",
        gap: "8px",
        alignItems: "start",
        px: "16px",
      }}
    >
      <FormControlLabel
        value="OTHER"
        control={<Radio sx={{ ml: "auto", width: 22, height: 22 }} />}
        label={
          <Typography
            variant="b3"
            sx={{
              px: "8px",
              color: "custom.neutralblack",
            }}
          >
            Shared with me
          </Typography>
        }
      />
      <FormControlLabel
        value="ME"
        control={<Radio sx={{ ml: "auto", width: 22, height: 22 }} />}
        label={
          <Typography
            variant="b3"
            sx={{
              px: "8px",
              color: "custom.neutralblack",
            }}
          >
            Shared by me
          </Typography>
        }
      />
    </RadioGroup>
  )
}
