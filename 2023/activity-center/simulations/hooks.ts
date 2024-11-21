import { toAPILowerDate, toAPIUpperDate } from "lib/filters/DateRangeFilter"
import { useMemo } from "react"
import { useSelector } from "react-redux"
import { SearchBy } from "services/access/types"
import { selectSharedSims } from "./sharedSimsSlice"

export function useSharedSimsFilterIsEmpty(): boolean {
  const { collaborator, dateRange, state } =
    useSelector(selectSharedSims).filter

  return !collaborator && !dateRange && !state
}

export function useSearchBy(): SearchBy {
  const {
    filter: { collaborator, dateRange, state },
  } = useSelector(selectSharedSims)
  return useMemo(
    (): SearchBy => ({
      target: "search-filter",
      aggregateTypes: ["sim"],
      read:
        !state || state.length == 2 || state.length == 0
          ? undefined
          : state[0] == "READ",
      sharedByUserIds: collaborator ? [collaborator.id] : undefined,
      sharedAt: dateRange
        ? {
            start: toAPILowerDate(dateRange.lower),
            end: toAPIUpperDate(dateRange.upper),
          }
        : undefined,
    }),
    [collaborator, dateRange, state]
  )
}
