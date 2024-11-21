import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChartData } from '@common/api/types/chart';
import { ChartVisualizerInstance, ChartVisualizersState, StatePart, ChartPayload } from './types';

// общий стейт всех инстансов - просто мапа
const initialState: ChartVisualizersState = {};

// стейт конкретного инстанса
export const initialInstanceState: Readonly<ChartVisualizerInstance> = {
  openId: '',
  data: {
    json: null,
    image: '',
    toolTipMap: '',
  },
  isFetching: false,
};

export const { actions, reducer } = createSlice({
  name: 'chartVisualizers',
  initialState,
  reducers: {
    createInstance(state: ChartVisualizersState, { payload }: PayloadAction<string>): void {
      state[payload] = { ...initialInstanceState };
    },
    setOpenId(
      state: ChartVisualizersState,
      { payload }: PayloadAction<{ instanceId: string; openedId: string }>,
    ): void {
      state[payload.instanceId].openId = payload.openedId;
    },
    setChartData(
      state: ChartVisualizersState,
      { payload }: PayloadAction<ChartPayload<ChartData>>,
    ): void {
      state[payload.instanceId].data = payload.data;
    },
    setIsFetching(
      state: ChartVisualizersState,
      { payload }: PayloadAction<{ instanceId: string; isFetching: boolean }>,
    ): void {
      state[payload.instanceId].isFetching = payload.isFetching;
    },
  },
});

// selectors
const instance = (state: StatePart, instanceId: string): ChartVisualizerInstance =>
  state.chartVisualizers[instanceId] || null;

const openId = (state: StatePart, instanceId: string): string =>
  state.chartVisualizers[instanceId]?.openId;

const chartData = (state: StatePart, instanceId: string): ChartData =>
  state.chartVisualizers[instanceId]?.data;

const isFetching = (state: StatePart, instanceId: string): boolean =>
  state.chartVisualizers[instanceId]?.isFetching;

export const selectors = {
  instance,
  openId,
  chartData,
  isFetching,
};

const spinner = {
  selectors,
  actions,
  reducer,
};
export default spinner;
