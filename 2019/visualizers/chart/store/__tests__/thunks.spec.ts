import base from '@common/api/bi/base';
import api from '@common/api/bi/visualizers/root';
import { Thunk } from 'redux-testkit';
import { withLoading } from '@common/containers/spinner/store/thunks';
import { StatePart, ChartVisualizerInstance } from '../types';
import thunks from '../thunks';
import slice from '../slice';

jest.mock('@common/containers/spinner/store/thunks');
jest.mock('@common/api/bi/base');
jest.mock('@common/api/bi/chart');

const postBiMocked = base.postBi as jest.MockedFunction<typeof base.postBi>;
const postBiSpy = jest.spyOn(base, 'postBi');

const emptyInstance: Readonly<ChartVisualizerInstance> = {
  openId: 'openId',
  data: {
    json: null,
    image: '',
    toolTipMap: '',
  },
  isFetching: false,
};

const initialState: StatePart = {
  chartVisualizers: {
    instance1: emptyInstance,
  },
};

const apiData = {
  json: 'testJson',
  image: 'testImage',
  toolTipMap: 'testToolTipMap',
};

const withLoadingMocked = withLoading as jest.MockedFunction<typeof withLoading>;
withLoadingMocked.mockImplementation((x) => x);

const getChartMocked = api.getChart as jest.MockedFunction<typeof api.getChart>;
const getChartMockedSpy = jest.spyOn(api, 'getChart');

describe('store/chartVisualizers/actions', () => {
  it('load', async () => {
    const dispatches = await Thunk(thunks.load)
      .withState(initialState)
      .execute('instance1', 'instance1');
    expect(dispatches.length).toBe(3);
    expect(dispatches[1].getAction()).toEqual(
      slice.actions.setChartData({ instanceId: 'instance1', data: undefined }),
    );
  });
});
