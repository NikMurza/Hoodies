import { Box, Button, Stack, Typography } from "@mui/material"
import Flex from "lib/components/foundation/chatbot/Flex"
import { DateRangeFilter } from "lib/filters/DateRangeFilter"
import { InputOwnerFilter } from "lib/filters/OwnerFilter"
import VideoCameraIcon from "lib/icons/24/video-camera.svg?react"
import { ReactElement, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import analytics from "../../../../../analytics/analytics"
import { ACTIVITY_CENTER_SHARED_SIMS_HOW_TO } from "../../../../../analytics/events"
import { HowToVideo } from "../../../../how-to-videos"
import { LeftTreeControls } from "../../../../postflop-strategies/LeftTreeControls"
import { ActivityCenterGridViewer } from "../../ActivityCenterGridViewer"
import { CheckboxFilter } from "../../CheckboxFilter"
import { SharedByFilter } from "../../SharedByFilter"
import { SharedHandState } from "../hands/sharedHandsSlice"
import { SharedSimsContent } from "./SharedSimsContent"
import { useSharedSimsFilterIsEmpty } from "./hooks"
import {
  clearSharedSimsFilter,
  selectSharedSims,
  setSharedSimsCollaborator,
  setSharedSimsDateRange,
  setSharedSimsSharedBy,
  setSharedSimsState,
} from "./sharedSimsSlice"

export function SharedSimsView(): ReactElement {
  const dispatch = useDispatch()

  const isFilterEmpty = useSharedSimsFilterIsEmpty()

  const {
    sharedBy,
    filter: { collaborator, dateRange, state },
  } = useSelector(selectSharedSims)
  const [openVideoPopUp, setOpenVideoPopUp] = useState(false)

  return (
    <ActivityCenterGridViewer
      scrollableContent
      bottomPanel={
        <Stack
          sx={{ gap: "16px", mx: "-16px", flexGrow: 1, overflowY: "hidden" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              px: "16px",
            }}
          >
            <Typography variant="b2" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Filters
            </Typography>
            <Button
              onClick={(): unknown => dispatch(clearSharedSimsFilter())}
              disabled={isFilterEmpty}
              size="small"
              variant="text"
              sx={{
                "&.MuiButton-root": {
                  p: 0,
                  minWidth: 0,
                },
              }}
            >
              Clear all
            </Button>
          </Box>
          <Stack sx={{ gap: "16px", px: "16px", overflowY: "auto" }}>
            <SharedByFilter
              filter={sharedBy}
              changeFilter={(filter): unknown =>
                dispatch(setSharedSimsSharedBy(filter))
              }
            />
            <InputOwnerFilter
              owner={collaborator}
              placeholder="Collaborator"
              changeOwner={(c): unknown =>
                dispatch(setSharedSimsCollaborator(c))
              }
            />
            <Flex>
              <DateRangeFilter
                filter={dateRange || {}}
                placeholderText="Shared date"
                changeFilter={(filter) =>
                  dispatch(setSharedSimsDateRange(filter))
                }
              />
            </Flex>
            {sharedBy == "OTHER" && (
              <CheckboxFilter
                title="State"
                filter={state || []}
                changeFilter={(filter): unknown =>
                  dispatch(setSharedSimsState(filter))
                }
                options={
                  [
                    { label: "Unread", value: "UNREAD" },
                    { label: "Read", value: "READ" },
                  ] as Array<{ label: string; value: SharedHandState }>
                }
              />
            )}
          </Stack>
          <Stack sx={{ px: "16px", mt: "auto" }}>
            <HowToVideo
              open={openVideoPopUp}
              onClose={(): void | boolean => {
                setOpenVideoPopUp(false)
              }}
              pageLink={"activity-center-sh"}
            />
            <LeftTreeControls
              controls={[
                {
                  label: "How to",
                  icon: <VideoCameraIcon width="100%" height="100%" />,
                  onClickCallback: () => {
                    analytics.track(ACTIVITY_CENTER_SHARED_SIMS_HOW_TO)
                    setOpenVideoPopUp(true)
                  },
                },
              ]}
            />
          </Stack>
        </Stack>
      }
      content={<SharedSimsContent />}
    />
  )
}
