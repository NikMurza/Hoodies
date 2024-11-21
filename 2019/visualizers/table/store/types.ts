import { PPSom } from '@common/api/types/PPSom';

export interface TableVisualizerInstance {
  openId: string;
  tabSheetData: TabSheetRawData;
  isFetching: boolean;
}

export interface TableVisualizersState {
  [instanceId: string]: TableVisualizerInstance;
}

export interface StatePart {
  tableVisualizers?: TableVisualizersState;
}
export type GetState = () => StatePart;

export interface TabSheetPayload<T> {
  instanceId: string;
  data?: T;
}

export interface TabSheetRawData {
  /** Структура и диапазоны данных. */
  Data?: PPSom.TabData[];
  /** Загруженные диапазоны. */
  Ranges?: PPSom.TabRange[];
  /** Метаданные */
  Metadata?: PPSom.TabMd;
  /** Выделение (Дублируется из метаданных). */
  Selection?: PPSom.TabSelection;
}
