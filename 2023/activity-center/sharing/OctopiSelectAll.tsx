import {
  FormControlLabel,
  Radio,
  RadioGroup,
  SxProps,
  Typography,
} from "@mui/material"
import Flex from "lib/components/foundation/chatbot/Flex"

export type OctopiSelectAllProps<T> = {
  selectAll: boolean
  onChange: (selectAll?: boolean) => void
  selectedCount: number
  totalCount: number
  sx?: SxProps
}

export function OctopiSelectAll<T>({
  selectAll,
  onChange,
  sx,
  selectedCount,
  totalCount,
}: OctopiSelectAllProps<T>) {
  return selectedCount == totalCount ? null : (
    <Flex
      sx={{
        ...sx,
        bgcolor: "custom.extralightexodus",
        borderRadius: "6px",
        p: "4px",
        justifyContent: "center",
      }}
    >
      <RadioGroup
        value={selectAll}
        onChange={(e) => {
          onChange(e.target.value == "true")
        }}
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "24px",
          alignItems: "center",
        }}
      >
        <FormControlLabel
          value={true}
          control={<Radio sx={{ width: 24, height: 24 }} />}
          label={
            <Typography
              variant="b3"
              sx={{
                px: "8px",
                color: "custom.neutralgray80",
              }}
            >
              {`All ${totalCount} hands`}
            </Typography>
          }
        />
        <FormControlLabel
          value={false}
          control={<Radio sx={{ width: 24, height: 24 }} />}
          label={
            <Typography
              variant="b3"
              sx={{
                px: "8px",
                color: "custom.neutralgray80",
              }}
            >
              {`First ${selectedCount} hands`}
            </Typography>
          }
        />
      </RadioGroup>
    </Flex>
  )
}
