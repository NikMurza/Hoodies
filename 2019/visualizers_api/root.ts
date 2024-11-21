import api from '@common/api/bi/chart';
import { ChartData } from '@common/api/types/chart';
import { postBi } from '@common/api/bi/base';
import {
  Visualizer,
  VisualizerType,
  ChartType,
  VisualizerPositionOptions,
  ExportLayout,
} from '@common/api/types/visualizers/root';
import { IMap } from '@common/types/map';
import Config from '../../config';

const getChart = async (openId: string, instanceId: string): Promise<ChartData> => {
  const chart = await api.getChart(`${openId}!SemanticLayer!MetaModels!${instanceId}!Chart`);
  return chart;
};

interface SSBIVisualizersResult {
  k: number;
  type: string;
  x: number;
  y: number;
  height: number;
  width: number;
  metaModelKey: number;
  parentKey: string;
  title: string;
}

/**
 * Добавление визуализатора
 *
 * @param {string} workspaceOpenId Ид открытого рабочего пространства
 * @param {VisualizerType} type Тип визуализатора
 */
const add = async (
  workspaceOpenId: string,
  type: VisualizerType,
  chartType: ChartType,
  x: number,
  y: number,
  height: number,
  width: number,
  parentId: string,
  useSync: boolean,
): Promise<Visualizer> => {
  const result = await postBi({
    SSBIVisualizersAdd: {
      mon: `${workspaceOpenId}!Visualizers`,
      tArg: {
        type,
        chartType,
        x,
        y,
        height,
        width,
        k: -1,
        parentKey: parentId || 0, // TODO: позднее заменить на -1
        title: '',
        useSync,
      },
    },
  });

  const data: SSBIVisualizersResult = result?.data?.SSBIVisualizersAddResult || {};

  return {
    id: data?.k?.toString() || '',
    type: VisualizerType[type],
    chartType: ChartType[chartType],
    x,
    y,
    height,
    width,
    metaModelId: data?.metaModelKey?.toString() || '',
    parentId,
    title: '',
    useSync,
  };
};

/**
 * Изменение визуализатора
 *
 * @param {string} workspaceOpenId Ид открытого рабочего пространства
 */
const set = async (
  workspaceOpenId: string,
  visualizerOptions: VisualizerPositionOptions,
): Promise<void> => {
  const { id, x, y, height, width, parentId } = visualizerOptions;

  await postBi({
    SetSSBIVisualizers: {
      mon: `${workspaceOpenId}!Visualizers`,
      tArg: {
        its: {
          it: {
            k: id,
            x,
            y,
            height,
            width,
            parentKey: parentId || 0, // TODO: заменить на -1
          },
        },
      },
    },
  });
};

/**
 * Изменение типа визуализатора
 *
 * @param {string} workspaceOpenId Ид открытого рабочего пространства
 * @param {string} visualizerId Ид визуализатора
 * @param {VisualizerType} type Глобальный тип визуализатора
 * @param {ChartType} chartType Подтип графика визуализатора
 */
const setType = async (
  workspaceOpenId: string,
  visualizerId: string,
  type: VisualizerType,
  chartType: ChartType,
  parentId?: string,
): Promise<void> => {
  await postBi({
    SetSSBIVisualizers: {
      mon: `${workspaceOpenId}!Visualizers`,
      tArg: {
        its: {
          it: {
            k: visualizerId,
            type,
            chartType,
            parentKey: parentId || 0,
          },
        },
      },
    },
  });
};

/**
 * Изменение имени визуализатора
 *
 * @param {string} workspaceOpenId Ид открытого рабочего пространства
 * @param {string} visualizerId Ид визуализатора
 * @param {string} title Имя визуализатора
 */
const setTitle = async (
  workspaceOpenId: string,
  visualizerId: string,
  title: string,
): Promise<void> => {
  await postBi({
    SetSSBIVisualizers: {
      mon: `${workspaceOpenId}!Visualizers`,
      tArg: {
        its: {
          it: {
            k: visualizerId,
            title,
          },
        },
      },
    },
  });
};

/**
 * Изменение синхронизации визуализатора
 *
 * @param {string} workspaceOpenId Ид открытого рабочего пространства
 * @param {string} visualizerId Ид визуализатора
 * @param {boolean} useSync Флаг включения синхронизации
 * @param {VisualizerType} type Тип визуализатора
 * @param {string} parentId Ид родительского фрейма
 */
const setUseSync = async (
  workspaceOpenId: string,
  visualizerId: string,
  useSync: boolean,
  type: VisualizerType,
  chartType: ChartType,
  parentId: string,
): Promise<void> => {
  await postBi({
    SetSSBIVisualizers: {
      mon: `${workspaceOpenId}!Visualizers`,
      tArg: {
        its: {
          it: {
            k: visualizerId,
            useSync,
            type,
            chartType,
            parentKey: parentId || 0,
          },
        },
      },
    },
  });
};

/**
 * Получение списка визуализаторов
 *
 * @param {string} workspaceOpenId Ид открытого рабочего пространства
 * @param {string} visualizerId Ид визуализатора
 */
const get = async (workspaceOpenId: string, visualizerId?: string): Promise<IMap<Visualizer>> => {
  const result = await postBi({
    GetSSBIVisualizers: {
      mon: `${workspaceOpenId}!Visualizers`,
      tArg: {
        autoGenerate: true,
        its: {
          it: [
            {
              k: visualizerId || -1,
              x: -1,
              y: -1,
              height: -1,
              width: -1,
              type: VisualizerType.Chart,
              chartType: ChartType.Bars,
              metaModelKey: -1,
              parentKey: -1,
              title: 'title',
              useSync: false,
            },
          ],
        },
      },
    },
  });

  const visualizers = result?.data?.GetSSBIVisualizersResult?.its?.it || [];

  return visualizers.reduce((tempVisualizersData, visualizers) => {
    tempVisualizersData[visualizers.k.toString()] = {
      id: visualizers.k.toString(),
      x: visualizers.x,
      y: visualizers.y,
      height: visualizers.height,
      width: visualizers.width,
      type: VisualizerType[visualizers.type],
      chartType: ChartType[visualizers.chartType],
      metaModelId: visualizers.metaModelKey.toString(),
      parentId: visualizers.parentKey ? visualizers.parentKey?.toString() : '',
      title: visualizers.title,
      useSync: !!visualizers.useSync,
    };
    return tempVisualizersData;
  }, {});
};

/**
 * Удаление визуализатора
 *
 * @param {string} workspaceOpenId Ид открытого рабочего пространства
 * @param {string} visualizerId Ид визуализатора
 */
const remove = async (workspaceOpenId: string, visualizerId: string): Promise<boolean> => {
  const result = await postBi({
    SSBIVisualizersDelete: {
      mon: `${workspaceOpenId}!Visualizers`,
      tArg: {
        k: visualizerId,
      },
    },
  });

  return result?.data?.SSBIVisualizersDeleteResult;
};

const exportPdf = async (
  workspaceOpenId: string,
  visualizerId: string,
  name: string,
  orientation: ExportLayout,
): Promise<string> => {
  const req = {
    SSBIVisualizerExport: {
      mon: `${workspaceOpenId}!Visualizers`,
      tArg: {
        k: visualizerId,
        pageSettings: {
          paperOrientation: orientation,
        },
      },
    },
  };
  const res = await postBi(req);
  const fileMoniker = res?.data?.SSBIVisualizerExportResult?.storeId?.id;
  return `${Config.getConfig().serviceUrl}/GetBin?mon=${fileMoniker}&fileName=${name}.pdf`;
};

const visualizers = {
  get,
  set,
  getChart,
  add,
  remove,
  setType,
  setTitle,
  setUseSync,
  exportPdf,
};

export default visualizers;
