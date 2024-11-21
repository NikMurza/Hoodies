import base from '@common/api/bi/base';
import {
  GetChart,
  GetEmptyChart,
  GetSSBIVisualizersResultMany,
  GetSSBIVisualizersResultOne,
  GetSSBIVisualizersResultZero,
  SSBIVisualizersDeleteResultTrue,
  SSBIVisualizersDeleteResultFalse,
  SSBIVisualizersAddResult,
  SSBIVisualizersAddResultEmpty,
} from '../__mocks__/visualizers';
import chartApi from '@common/api/bi/chart';
import api from '@common/api/bi/visualizers/root';
import { VisualizerType, ChartType,ExportLayout } from '@common/api/types/visualizers/root';

jest.mock('@common/api/bi/base');
jest.mock('@common/api/bi/chart');

const postBiMocked = base.postBi as jest.MockedFunction<typeof base.postBi>;
const postBiSpy = jest.spyOn(base, 'postBi');

const chartApiMocked = chartApi.getChart as jest.MockedFunction<typeof chartApi.getChart>;
const chartApiSpy = jest.spyOn(chartApi, 'getChart');

describe('visualizers bi api', () => {
  beforeEach(() => {
    postBiMocked.mockClear();
    postBiSpy.mockClear();
  });

  it('getChart', async () => {
    const id = 'id';
    const instanceId = 'instanceId';
    chartApiMocked.mockReturnValue(GetChart());
    expect(await api.getChart(id, instanceId)).toEqual({
      json: { chart: {} },
      image: 'testImage',
      toolTipMap: 'testToolTipImageMap',
    });
    expect(chartApiSpy).toHaveBeenCalledWith('id!SemanticLayer!MetaModels!instanceId!Chart');
  });

  it('getChart GetEmptyChart', async () => {
    const id = 'id';
    const instanceId = 'instanceId';
    chartApiMocked.mockReturnValue(GetEmptyChart());
    expect(await api.getChart(id, instanceId)).toEqual({});
    expect(chartApiSpy).toHaveBeenCalledWith('id!SemanticLayer!MetaModels!instanceId!Chart');
  });

  it('get GetSSBIVisualizersResultMany', async () => {
    const openId = 'openId';

    postBiMocked.mockReturnValue(GetSSBIVisualizersResultMany());
    expect(await api.get(openId)).toEqual({
      '1': {
        height: 100000,
        id: '1',
        metaModelId: '1',
        type: 'Grid',
        width: 2000,
        x: 1000,
        y: 100,
        parentId: '2',
        chartType: undefined,
        title: undefined,
        useSync: false,
      },
      '2': {
        height: 200000,
        id: '2',
        metaModelId: '2',
        type: 'Grid',
        width: 2000,
        x: 2000,
        y: 2100,
        parentId: '2',
        chartType: undefined,
        title: undefined,
        useSync: false,
      },
    });
    expect(postBiSpy).toHaveBeenCalledWith({
      GetSSBIVisualizers: {
        mon: 'openId!Visualizers',
        tArg: {
          autoGenerate: true,
          its: {
            it: [
              {
                height: -1,
                k: -1,
                metaModelKey: -1,
                type: 'Chart',
                chartType: 'Bars',
                width: -1,
                x: -1,
                y: -1,
                parentKey: -1,
                title: 'title',
                useSync: false,
              },
            ],
          },
        },
      },
    });
  });

  it('get GetSSBIVisualizersResultOne', async () => {
    const openId = 'openId';

    postBiMocked.mockReturnValue(GetSSBIVisualizersResultOne());
    expect(await api.get(openId)).toEqual({
      '1': {
        height: 100000,
        id: '1',
        metaModelId: '1',
        type: 'Grid',
        width: 2000,
        x: 1000,
        y: 100,
        parentId: '2',
        chartType: undefined,
        title: undefined,
        useSync: false,
      },
    });
    expect(postBiSpy).toHaveBeenCalledWith({
      GetSSBIVisualizers: {
        mon: 'openId!Visualizers',
        tArg: {
          autoGenerate: true,
          its: {
            it: [
              {
                height: -1,
                k: -1,
                metaModelKey: -1,
                type: 'Chart',
                chartType: 'Bars',
                width: -1,
                x: -1,
                y: -1,
                parentKey: -1,
                title: 'title',
                useSync: false,
              },
            ],
          },
        },
      },
    });
  });

  it('get GetSSBIVisualizersResultZero', async () => {
    const openId = 'openId';

    postBiMocked.mockReturnValue(GetSSBIVisualizersResultZero());
    expect(await api.get(openId)).toEqual({});
    expect(postBiSpy).toHaveBeenCalledWith({
      GetSSBIVisualizers: {
        mon: 'openId!Visualizers',
        tArg: {
          autoGenerate: true,
          its: {
            it: [
              {
                height: -1,
                k: -1,
                metaModelKey: -1,
                type: 'Chart',
                chartType: 'Bars',
                width: -1,
                x: -1,
                y: -1,
                parentKey: -1,
                title: 'title',
                useSync: false,
              },
            ],
          },
        },
      },
    });
  });

  it('remove SSBIVisualizersDeleteResultTrue', async () => {
    const workspaceOpenId = 'workspaceOpenId';
    const visualizerId = 'visualizerId';
    postBiMocked.mockReturnValue(SSBIVisualizersDeleteResultTrue());
    expect(await api.remove(workspaceOpenId, visualizerId)).toEqual(true);
    expect(postBiSpy).toHaveBeenCalledWith({
      SSBIVisualizersDelete: {
        mon: `${workspaceOpenId}!Visualizers`,
        tArg: {
          k: visualizerId,
        },
      },
    });
  });

  it('remove SSBIVisualizersDeleteResultFalse', async () => {
    const workspaceOpenId = 'workspaceOpenId';
    const visualizerId = 'visualizerId';
    postBiMocked.mockReturnValue(SSBIVisualizersDeleteResultFalse());
    expect(await api.remove(workspaceOpenId, visualizerId)).toEqual(false);
    expect(postBiSpy).toHaveBeenCalledWith({
      SSBIVisualizersDelete: {
        mon: `${workspaceOpenId}!Visualizers`,
        tArg: {
          k: visualizerId,
        },
      },
    });
  });

  it('set', async () => {
    const workspaceOpenId = 'workspaceOpenId';
    const id = 'id';
    const x = 100;
    const y = 1000;
    const height = 10000;
    const width = 100000;
    const parentId = '1';

    await api.set(workspaceOpenId, {
      id,
      x,
      y,
      height,
      width,
      parentId,
    }),
      expect(postBiSpy).toHaveBeenCalledWith({
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
                parentKey: parentId,
              },
            },
          },
        },
      });
  });

  it('setType Chart', async () => {
    const workspaceOpenId = 'workspaceOpenId';
    const id = 'id';
    const parentId = 'parentId';

    await api.setType(workspaceOpenId, id, VisualizerType.Chart, ChartType.Bars, parentId),
      expect(postBiSpy).toHaveBeenCalledWith({
        SetSSBIVisualizers: {
          mon: `${workspaceOpenId}!Visualizers`,
          tArg: {
            its: {
              it: {
                k: id,
                type: VisualizerType.Chart,
                chartType: ChartType.Bars,
                parentKey: parentId,
              },
            },
          },
        },
      });
  });

  it('setTitle', async () => {
    const workspaceOpenId = 'workspaceOpenId';
    const id = 'id';

    await api.setTitle(workspaceOpenId, id, 'newTitle'),
      expect(postBiSpy).toHaveBeenCalledWith({
        SetSSBIVisualizers: {
          mon: `${workspaceOpenId}!Visualizers`,
          tArg: {
            its: {
              it: {
                k: id,
                title: 'newTitle',
              },
            },
          },
        },
      });
  });

  it('setType Grid', async () => {
    const workspaceOpenId = 'workspaceOpenId';
    const id = 'id';
    const parentId = 'parentId';

    await api.setType(workspaceOpenId, id, VisualizerType.Grid, undefined, parentId),
      expect(postBiSpy).toHaveBeenCalledWith({
        SetSSBIVisualizers: {
          mon: `${workspaceOpenId}!Visualizers`,
          tArg: {
            its: {
              it: {
                k: id,
                type: VisualizerType.Grid,
                chartType: undefined,
                parentKey: parentId,
              },
            },
          },
        },
      });
  });

  it('setUseSync', async () => {
    const workspaceOpenId = 'workspaceOpenId';
    const id = 'id';
    const useSync = true;
    const type = VisualizerType.Frame;
    const chartType = ChartType.Circles;
    const parentId = '1';

    await api.setUseSync(workspaceOpenId, id, useSync, type, chartType, parentId),
      expect(postBiSpy).toHaveBeenCalledWith({
        SetSSBIVisualizers: {
          mon: `${workspaceOpenId}!Visualizers`,
          tArg: {
            its: {
              it: {
                k: id,
                useSync,
                type,
                chartType,
                parentKey: parentId,
              },
            },
          },
        },
      });
  });

  it('add SSBIVisualizersAddResult', async () => {
    const workspaceOpenId = 'workspaceOpenId';
    const x = 100;
    const y = 1000;
    const height = 10000;
    const width = 100000;
    const type = VisualizerType.Chart;
    const chartType = ChartType.Bars;
    const parentId = '2';
    const useSync = false;
    postBiMocked.mockReturnValue(SSBIVisualizersAddResult());

    expect(
      await api.add(workspaceOpenId, type, chartType, x, y, height, width, parentId, useSync),
    ).toEqual({
      height: 10000,
      id: '1',
      metaModelId: '1',
      parentId,
      type,
      chartType,
      width: 100000,
      x: 100,
      y: 1000,
      title: '',
      useSync: false,
    });
    expect(postBiSpy).toHaveBeenCalledWith({
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
          parentKey: '2',
          title: '',
          useSync: false,
        },
      },
    });
  });

  it('add SSBIVisualizersAddResultEmpty', async () => {
    const workspaceOpenId = 'workspaceOpenId';
    const x = 100;
    const y = 1000;
    const height = 10000;
    const width = 100000;
    const type = VisualizerType.Chart;
    const chartType = ChartType.Bars;
    const parentId = '';
    const useSync = false;
    postBiMocked.mockReturnValue(SSBIVisualizersAddResultEmpty());

    expect(
      await api.add(workspaceOpenId, type, chartType, x, y, height, width, parentId, useSync),
    ).toEqual({
      height: 10000,
      id: '',
      metaModelId: '',
      type,
      width: 100000,
      x: 100,
      y: 1000,
      parentId,
      chartType,
      title: '',
      useSync: false,
    });
    expect(postBiSpy).toHaveBeenCalledWith({
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
          parentKey: 0,
          title: '',
          useSync: false,
        },
      },
    });
  });

  it('exportPdf', async () => {
    const workspaceOpenId = 'workspaceOpenId';
    const visualizerId = 'testId';
    const orientation  = ExportLayout.Landscape
    const fileName = 'filename';
    postBiMocked.mockReturnValue(Promise.resolve({
      data: {
        SSBIVisualizerExportResult:{
          storeId: {
            id:'test'
          }
        }
      }}));

    expect(
      await api.exportPdf(workspaceOpenId, visualizerId, fileName,orientation),
    ).toEqual("/GetBin?mon=test&fileName=filename.pdf");
    expect(postBiSpy).toHaveBeenCalledWith({
    SSBIVisualizerExport: {
      mon: `${workspaceOpenId}!Visualizers`,
      tArg: {
        k: visualizerId,
        pageSettings: {
          paperOrientation: orientation,
        },
      },
    }});
  });
});
