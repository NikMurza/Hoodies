import { Box, FormControlLabel, FormGroup, Typography } from "@mui/material"
import { WLPCheckbox } from "lib/components/foundation/WLPCheckbox"
import { PanelViewSwitcher } from "lib/components/PanelViewSwitcher"
import { useCallback, useState } from "react"

export interface CheckboxFilterProps<T> {
  title: string
  changeFilter: (filter: T[] | undefined) => void
  filter: T[]
  options: { label: string; value: T }[]
}
export function CheckboxFilter<T>({
  title,
  filter,
  changeFilter,
  options,
}: CheckboxFilterProps<T>) {
  const [expanded, setExpanded] = useState(true)

  const handleClick = (value: T): void => {
    const newSelected = new Set(filter)

    if (!newSelected.delete(value)) newSelected.add(value)

    changeFilter(newSelected.size == 0 ? undefined : Array.from(newSelected))
  }
  const isSelected = useCallback(
    (value: T) => filter.indexOf(value) !== -1,
    [filter]
  )

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <PanelViewSwitcher
        open={expanded}
        small={true}
        setOpen={(v) => setExpanded(v)}
        label={title}
        showBadge={filter.length > 0}
      />
      {expanded && (
        <FormGroup
          sx={{
            display: "flex",
            gap: "8px",
          }}
        >
          {options.map((s, idx) => {
            return (
              <FormControlLabel
                key={idx}
                sx={{
                  "&.MuiFormControlLabel-root": {
                    m: 0,
                  },
                  "& .MuiButtonBase-root": {
                    p: 0,
                  },
                }}
                control={
                  <WLPCheckbox
                    onChange={(event) => handleClick(s.value)}
                    checked={isSelected(s.value)}
                  />
                }
                label={
                  <Typography
                    variant="b3"
                    sx={{
                      px: "8px",
                      color: "custom.neutralblack",
                    }}
                  >
                    {s.label}
                  </Typography>
                }
              />
            )
          })}
        </FormGroup>
      )}
    </Box>
  )
}
