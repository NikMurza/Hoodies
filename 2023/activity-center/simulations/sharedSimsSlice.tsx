import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "app/store"
import { FilterDateRange } from "lib/filters/DateRangeFilter"
import { JsonNode } from "services/access/types"
import { SearchPublicUser } from "services/types"
import {
  SharedBy,
  SharedHandSort,
  SharedHandState,
} from "../hands/sharedHandsSlice"
import { SharedSimEvent } from "./useFullfilledSharedSims"

export interface SimToShare {
  id: string
  metadata: JsonNode | undefined
}

interface SharedSimsFilter {
  collaborator?: SearchPublicUser
  dateRange?: FilterDateRange
  state?: SharedHandState[]
}

interface SharedSimsData {
  filter: SharedSimsFilter
  // AG: NOTE: This is not filter! This is analogue of Tab
  sharedBy: SharedBy
  page: number
  count: number
  rowsPerPage: number
  selectedEvent?: SharedSimEvent
  checkedEvents: Set<string>
  sort: SharedHandSort
  selectAll?: boolean
  simsToShare?: SimToShare[]
}

const defaults: SharedSimsData = {
  filter: {},
  page: 0,
  rowsPerPage: 100,
  count: 0,
  sharedBy: "OTHER",
  sort: "NEWEST",
  checkedEvents: new Set(),
}

const slice = createSlice({
  name: "shared-sims",
  initialState: defaults,
  reducers: {
    setSharedSimsSelectAll(state, payload: PayloadAction<boolean | undefined>) {
      state.selectAll = payload.payload
    },
    setSharedSimsSort(state, payload: PayloadAction<SharedHandSort>) {
      state.sort = payload.payload
    },
    setSharedSimsPage(state, payload: PayloadAction<number>) {
      state.page = payload.payload
    },
    setSharedSimsCount(state, payload: PayloadAction<number>) {
      state.count = payload.payload
    },
    setSharedSimsRowsPerPage(state, payload: PayloadAction<number>) {
      state.rowsPerPage = payload.payload
    },
    setSharedSimsSharedBy(state, payload: PayloadAction<SharedBy>) {
      state.sharedBy = payload.payload
    },
    setSharedSimsCollaborator(
      state,
      payload: PayloadAction<SearchPublicUser | undefined>
    ) {
      state.filter.collaborator = payload.payload
    },
    setSharedSimsState(
      state,
      payload: PayloadAction<SharedHandState[] | undefined>
    ) {
      state.filter.state = payload.payload
    },
    setSharedSimsDateRange(
      state,
      payload: PayloadAction<FilterDateRange | undefined>
    ) {
      state.filter.dateRange = payload.payload
    },
    setSharedSimsCheckedEvents(state, payload: PayloadAction<Set<string>>) {
      state.checkedEvents = payload.payload
    },
    setSharedSimsSelectedEvent(
      state,
      payload: PayloadAction<SharedSimEvent | undefined>
    ) {
      state.selectedEvent = payload.payload
    },
    setSharedSimsToShare(
      state,
      payload: PayloadAction<SimToShare[] | undefined>
    ) {
      state.simsToShare = payload.payload
    },
    clearSharedSimsFilter(state) {
      state.filter = { ...defaults.filter }
    },
  },
})

export const {
  setSharedSimsPage,
  setSharedSimsCount,
  setSharedSimsRowsPerPage,
  setSharedSimsSharedBy,
  setSharedSimsCollaborator,
  setSharedSimsState,
  setSharedSimsDateRange,
  setSharedSimsCheckedEvents,
  clearSharedSimsFilter,
  setSharedSimsSelectedEvent,
  setSharedSimsSort,
  setSharedSimsSelectAll,
  setSharedSimsToShare,
} = slice.actions

export default slice.reducer

export const selectSharedSims = (state: RootState): SharedSimsData =>
  state.sharedSims
