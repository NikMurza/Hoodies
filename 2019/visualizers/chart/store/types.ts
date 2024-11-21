import { ChartData } from '@common/api/types/chart';

export interface ChartVisualizerInstance {
  openId: string;
  data?: ChartData;
  isFetching: boolean;
}

export interface ChartVisualizersState {
  [instanceId: string]: ChartVisualizerInstance;
}

export interface StatePart {
  chartVisualizers?: ChartVisualizersState;
}
export type GetState = () => StatePart;

export interface ChartPayload<T> {
  instanceId: string;
  data?: T;
}
