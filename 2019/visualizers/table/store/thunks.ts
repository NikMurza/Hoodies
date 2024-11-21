import { IAsyncHandler } from '@common/containers/spinner/store/thunks';
import bi from '@common/api/bi/index';
import { ITabSheetPictureMouseDownArgs } from '@common/components/lib/types/tab-sheet';
import { PPSom } from '@common/api/types/PPSom';
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

    const tabSheetData = await bi.tabSheet.getData(
      `${openId}!SemanticLayer!MetaModels!${instanceId}!Grid!TabSheet`,
    );

    dispatch(slice.actions.setTabSheetData({ instanceId, data: tabSheetData.rawData }));
  } finally {
    dispatch(slice.actions.setIsFetching({ instanceId, isFetching: false }));
  }
};

export const loadTabSheetRanges = (
  instanceId: string,
  ranges?: PPSom.TabRange[],
): IAsyncHandler => async (dispatch: Function, getState: GetState): Promise<void> => {
  const state = getState();
  const openId = slice.selectors.openId(state, instanceId);
  const tabSheetData = await bi.tabSheet.getRangesData(
    `${openId}!DataArea!Views!${instanceId}!TabSheet`,
    ranges,
  );
  dispatch(
    slice.actions.setTabSheetData({
      instanceId,
      data: tabSheetData,
    }),
  );
};

export const pressTabsheetPicture = (
  instanceId: string,
  args: ITabSheetPictureMouseDownArgs,
): IAsyncHandler => async (dispatch: Function, getState: GetState): Promise<void> => {
  const state = getState();
  const openId = slice.selectors.openId(state, instanceId);
  await bi.tabSheet.action.pressPictures(`${openId}!DataArea!Views!${instanceId}!TabSheet`, {
    coordinates: [args.coordinates],
  });
  dispatch(load(instanceId));
};

export default {
  load,
  pressTabsheetPicture,
  loadTabSheetRanges,
};
