import { ChartVisualizerInstance, ChartVisualizersState } from '../types';
import { actions, reducer, selectors } from '../slice';

const initialState: ChartVisualizersState = {};

const emptyInstance: Readonly<ChartVisualizerInstance> = {
  openId: '',
  data: {
    json: null,
    image: '',
    toolTipMap: '',
  },
  isFetching: false,
};

describe('chartVisualizer/slice', () => {
  it('action - createInstance', () => {
    expect(reducer(initialState, actions.createInstance('instance1'))).toEqual({
      instance1: emptyInstance,
    });
  });

  it('action - setOpenId', () => {
    expect(
      reducer(
        { instance1: emptyInstance },
        actions.setOpenId({ instanceId: 'instance1', openedId: 'openedId' }),
      ),
    ).toEqual({
      instance1: {
        openId: 'openedId',
        data: {
          image: '',
          json: null,
          toolTipMap: '',
        },
        isFetching: false,
      },
    });
  });

  it('action - setChartData', () => {
    expect(
      reducer(
        { instance1: emptyInstance },
        actions.setChartData({
          instanceId: 'instance1',
          data: { json: null, toolTipMap: '', image: '' },
        }),
      ),
    ).toEqual({
      instance1: { openId: '', data: { json: null, toolTipMap: '', image: '' }, isFetching: false },
    });
  });

  it('action - setIsFetching', () => {
    expect(
      reducer(
        { instance1: emptyInstance },
        actions.setIsFetching({ instanceId: 'instance1', isFetching: true }),
      ),
    ).toEqual({
      instance1: {
        openId: '',
        data: {
          image: '',
          json: null,
          toolTipMap: '',
        },
        isFetching: true,
      },
    });
  });

  it('selectors', () => {
    const initialState = {
      chartVisualizers: {
        instance1: {
          openId: 'testOpenedId!M!S!OLFHKGABKBBAIFOAEENDAACPDHMKAIKJENLLACLKILCDEPEOG',
          data: {
            json: null,
            image: '',
            toolTipMap: '',
          },
          isFetching: false,
        },
      },
    };

    expect(selectors.instance(initialState, 'instance1')).toEqual({
      openId: 'testOpenedId!M!S!OLFHKGABKBBAIFOAEENDAACPDHMKAIKJENLLACLKILCDEPEOG',
      data: { json: null, image: '', toolTipMap: '' },
      isFetching: false,
    });
    expect(selectors.openId(initialState, 'instance1')).toEqual(
      'testOpenedId!M!S!OLFHKGABKBBAIFOAEENDAACPDHMKAIKJENLLACLKILCDEPEOG',
    );
    expect(selectors.chartData(initialState, 'instance1')).toEqual({
      image: '',
      json: null,
      toolTipMap: '',
    });
    expect(selectors.isFetching(initialState, 'instance1')).toEqual(false);
  });
});
