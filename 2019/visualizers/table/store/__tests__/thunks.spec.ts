import { Thunk } from 'redux-testkit';
import { withLoading } from '@common/containers/spinner/store/thunks';
import bi from '@common/api/bi';
import { ITabSheetData } from '@common/components/lib/types/tab-sheet';
import { GetState, StatePart, TableVisualizerInstance, TabSheetRawData } from '../types';
import thunks from '../thunks';
import slice from '../slice';

jest.mock('@common/api/bi');
jest.mock('@common/containers/spinner/store/thunks');

const emptyInstance: Readonly<TableVisualizerInstance> = {
  openId: 'openId',
  tabSheetData: {},
};

const initialState: StatePart = {
  tableVisualizers: {
    instance1: emptyInstance,
  },
};

const apiData = {
  rawData: {
    Ranges: [
      {
        left: 1,
        top: 1,
        width: 10,
        height: 10,
      },
    ],
  },
  filter: {
    isEnabled: false,
    range: {
      left: 1,
      top: 1,
      width: 10,
      height: 10,
    },
    conditions: [],
  },
  selection: {},
  structure: {
    headersVisibility: false,
    gridVisibility: false,
    scrollbarsVisibility: false,
    freezeRow: 0,
    freezeColumn: 0,
  },
  metadata: {
    scale: 1,
  },
};

const withLoadingMocked = withLoading as jest.MockedFunction<typeof withLoading>;
withLoadingMocked.mockImplementation((x) => x);

const getDataModelMocked = bi.tabSheet.getData as jest.MockedFunction<typeof bi.tabSheet.getData>;
getDataModelMocked.mockReturnValueOnce(Promise.resolve(apiData));

const getRangesDataMocked = bi.tabSheet.getRangesData as jest.MockedFunction<
  typeof bi.tabSheet.getRangesData
>;
getRangesDataMocked.mockReturnValueOnce(Promise.resolve(apiData.rawData));

const pressPicturesMocked = bi.tabSheet.action.pressPictures as jest.MockedFunction<
  typeof bi.tabSheet.action.pressPictures
>;
pressPicturesMocked.mockReturnValueOnce(Promise.resolve());

describe('store/tableVisualizers/actions', () => {
  it('load', async () => {
    const dispatches = await Thunk(thunks.load)
      .withState(initialState)
      .execute('instance1', 'instance1');
    expect(dispatches.length).toBe(3);
    expect(dispatches[1].getAction()).toEqual(
      slice.actions.setTabSheetData({ instanceId: 'instance1', data: apiData.rawData }),
    );
  });

  it('loadTabSheetRanges', async () => {
    const dispatches = await Thunk(thunks.loadTabSheetRanges)
      .withState(initialState)
      .execute('instance1');
    expect(dispatches.length).toBe(1);
    expect(dispatches[0].getAction()).toEqual(
      slice.actions.setTabSheetData({ instanceId: 'instance1', data: apiData.rawData }),
    );
  });

  it('pressTabsheetPicture', async () => {
    const dispatches = await Thunk(thunks.pressTabsheetPicture)
      .withState(initialState)
      .execute('instance1', { coordinates: {} });
    expect(dispatches.length).toBe(1);
  });
});
