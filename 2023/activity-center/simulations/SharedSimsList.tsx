import { Box, Stack } from "@mui/material"
import { Pagination } from "lib/components/foundation/pagination/Pagination"
import { ReactElement, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { SharedSimCard } from "./SharedSimCard"
import {
  selectSharedSims,
  setSharedSimsCheckedEvents,
  setSharedSimsCount,
  setSharedSimsPage,
  setSharedSimsRowsPerPage,
  setSharedSimsSelectedEvent,
} from "./sharedSimsSlice"
import {
  SharedSimEvent,
  useFullfilledSharedSims,
} from "./useFullfilledSharedSims"

export function SharedSimsList(): ReactElement {
  const [localHands, setLocalHands] = useState<SharedSimEvent[]>([])

  const {
    rawHandsQuery: { data: rawHands },
    hands: loadedEvents,
  } = useFullfilledSharedSims()

  const dispatch = useDispatch()

  const { page, rowsPerPage, count, selectedEvent, checkedEvents } =
    useSelector(selectSharedSims)

  useEffect(() => {
    if (rawHands) {
      if (page > Math.floor(count / rowsPerPage)) {
        dispatch(setSharedSimsPage(0))
      }

      dispatch(setSharedSimsCount(rawHands.totalElements))
    }
  }, [rawHands, dispatch, page, count, rowsPerPage])

  useEffect(() => {
    setLocalHands(loadedEvents)

    if (
      !selectedEvent ||
      !loadedEvents.some((h) => h.id == String(selectedEvent.id))
    ) {
      if (loadedEvents.length > 0) {
        dispatch(setSharedSimsSelectedEvent(loadedEvents[0]))
      } else dispatch(setSharedSimsSelectedEvent(undefined))
    }

    const checked = new Set(checkedEvents)
    checkedEvents.forEach(
      (eventId) =>
        !loadedEvents.some(({ id }) => id == eventId) && checked.delete(eventId)
    )
    dispatch(setSharedSimsCheckedEvents(checked))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedEvents])

  return (
    <Stack sx={{ flexGrow: 1, overflowY: "auto" }}>
      <Stack sx={{ overflowY: "auto" }}>
        {localHands.map((h, index) => (
          <SharedSimCard key={h.id} event={h} index={index} />
        ))}
      </Stack>
      <Box>
        <Pagination
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          changePage={(page): unknown => dispatch(setSharedSimsPage(page))}
          changeRowsPerPage={(rowsPerPage) =>
            dispatch(setSharedSimsRowsPerPage(rowsPerPage))
          }
        />
      </Box>
    </Stack>
  )
}
