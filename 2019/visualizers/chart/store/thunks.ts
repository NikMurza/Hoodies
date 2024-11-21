import { IAsyncHandler } from '@common/containers/spinner/store/thunks';
import api from '@common/api/bi/visualizers/root';
import { GetState } from './types';
import slice from './slice';

export const load = (instanceId: string): IAsyncHandler => async (
  dispatch: Function,
  getState: GetState,
): Promise<void> => {
  try {
    const state = getState();
    dispatch(slice.actions.setIsFetching({ instanceId, isFetching: true }));
    const openId = slice.selectors.openId(state, instanceId);

    const data = await api.getChart(openId, instanceId);

    dispatch(slice.actions.setChartData({ instanceId, data }));
  } finally {
    dispatch(slice.actions.setIsFetching({ instanceId, isFetching: false }));
  }
};

export default {
  load,
};
