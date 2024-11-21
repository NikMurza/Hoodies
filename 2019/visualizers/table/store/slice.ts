import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TableVisualizersState,
  TableVisualizerInstance,
  TabSheetPayload,
  TabSheetRawData,
  StatePart,
} from './types';

// общий стейт всех инстансов - просто мапа
const initialState: TableVisualizersState = {};

// стейт конкретного инстанса
export const initialInstanceState: Readonly<TableVisualizerInstance> = {
  openId: '',
  tabSheetData: {},
  isFetching: false,
};

export const { actions, reducer } = createSlice({
  name: 'tableVisualizers',
  initialState,
  reducers: {
    createInstance(state: TableVisualizersState, { payload }: PayloadAction<string>): void {
      state[payload] = { ...initialInstanceState };
    },
    setOpenId(
      state: TableVisualizersState,
      { payload }: PayloadAction<{ instanceId: string; openedId: string }>,
    ): void {
      state[payload.instanceId].openId = payload.openedId;
    },
    setTabSheetData(
      state: TableVisualizersState,
      { payload }: PayloadAction<TabSheetPayload<TabSheetRawData>>,
    ): void {
      state[payload.instanceId].tabSheetData = payload.data;
    },
    setIsFetching(
      state: TableVisualizersState,
      { payload }: PayloadAction<{ instanceId: string; isFetching: boolean }>,
    ): void {
      state[payload.instanceId].isFetching = payload.isFetching;
    },
  },
});

// selectors
const instance = (state: StatePart, instanceId: string): TableVisualizerInstance =>
  state.tableVisualizers[instanceId] || null;

const openId = (state: StatePart, instanceId: string): string =>
  state.tableVisualizers[instanceId]?.openId;

const tabSheetData = (state: StatePart, instanceId: string): TabSheetRawData =>
  state.tableVisualizers[instanceId]?.tabSheetData;

const isFetching = (state: StatePart, instanceId: string): boolean =>
  state.tableVisualizers[instanceId]?.isFetching;

export const selectors = {
  instance,
  openId,
  tabSheetData,
  isFetching,
};

const spinner = {
  selectors,
  actions,
  reducer,
};
export default spinner;
