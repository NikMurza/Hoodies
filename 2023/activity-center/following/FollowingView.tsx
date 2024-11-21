import { Box, Button, Stack, Typography } from "@mui/material"
import Flex from "lib/components/foundation/chatbot/Flex"
import { DateRangeFilter } from "lib/filters/DateRangeFilter"
import { InputOwnerFilter } from "lib/filters/OwnerFilter"
import {
  clearFollowingsFilter,
  selectFollowings,
  selectIsFollowingsFilterEmpty,
  setFollowingsCollaborator,
  setFollowingsDateRange,
  setFollowingsState,
} from "lib/following/followingSlice"
import VideoCameraIcon from "lib/icons/24/video-camera.svg?react"
import { ReactElement, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import analytics from "../../../../analytics/analytics"
import { ACTIVITY_CENTER_FOLLOWERS_HOW_TO } from "../../../../analytics/events"
import { HowToVideo } from "../../../how-to-videos"
import { LeftTreeControls } from "../../../postflop-strategies/LeftTreeControls"
import { ActivityCenterGridViewer } from "../ActivityCenterGridViewer"
import { CheckboxFilter } from "../CheckboxFilter"
import { FollowingContent } from "./FollowingContent"

export function FollowingView(): ReactElement {
  const dispatch = useDispatch()
  const {
    filter: { collaborator, state, dateRange },
  } = useSelector(selectFollowings)

  const isFilterEmpty = useSelector(selectIsFollowingsFilterEmpty)
  const onClearAllClick = (): void => {
    dispatch(clearFollowingsFilter())
  }
  const [openVideoPopUp, setOpenVideoPopUp] = useState(false)

  const checkboxValueList = [
    { label: "Unread", value: false },
    { label: "Read", value: true },
  ] as Array<{ label: string; value: boolean }>

  return (
    <ActivityCenterGridViewer
      bottomPanel={
        <Stack sx={{ gap: "16px", mx: "-16px", flexGrow: 1 }}>
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
              onClick={onClearAllClick}
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
          <Stack sx={{ gap: "16px", px: "16px" }}>
            <InputOwnerFilter
              owner={collaborator}
              placeholder="User name"
              changeOwner={(c): unknown =>
                dispatch(setFollowingsCollaborator(c))
              }
            />
            <Flex>
              <DateRangeFilter
                filter={dateRange || {}}
                placeholderText="Date"
                changeFilter={(filter) =>
                  dispatch(setFollowingsDateRange(filter))
                }
              />
            </Flex>
            <CheckboxFilter
              title="State"
              filter={state || []}
              changeFilter={(filter): unknown =>
                dispatch(setFollowingsState(filter))
              }
              options={checkboxValueList}
            />
          </Stack>
          <Stack sx={{ px: "16px", mt: "auto" }}>
            <HowToVideo
              open={openVideoPopUp}
              onClose={(): void | boolean => {
                setOpenVideoPopUp(false)
              }}
              pageLink={"activity-center-fw"}
            />
            <LeftTreeControls
              controls={[
                {
                  label: "How to",
                  icon: <VideoCameraIcon width="100%" height="100%" />,
                  onClickCallback: () => {
                    analytics.track(ACTIVITY_CENTER_FOLLOWERS_HOW_TO)
                    setOpenVideoPopUp(true)
                  },
                },
              ]}
            />
          </Stack>
        </Stack>
      }
      content={<FollowingContent />}
    />
  )
}
