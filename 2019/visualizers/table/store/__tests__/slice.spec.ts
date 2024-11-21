import { TableVisualizersState, TableVisualizerInstance } from '../types';
import { actions, reducer, selectors } from '../slice';

const initialState: TableVisualizersState = {};

const emptyInstance: Readonly<TableVisualizerInstance> = {
  openId: '',
  tabSheetData: {},
  isFetching: false,
};

describe('tableVisualizers/slice', () => {
  it('action - createInstance', () => {
    expect(reducer(initialState, actions.createInstance('instance1'))).toEqual({
      instance1: emptyInstance,
    });
  });

  it('action - createInstance', () => {
    expect(
      reducer(
        { instance1: emptyInstance },
        actions.setOpenId({ instanceId: 'instance1', openedId: 'openedId' }),
      ),
    ).toEqual({
      instance1: { openId: 'openedId', tabSheetData: {}, isFetching: false },
    });
  });

  it('action - setTabSheetData', () => {
    expect(
      reducer(
        { instance1: emptyInstance },
        actions.setTabSheetData({ instanceId: 'instance1', data: {} }),
      ),
    ).toEqual({
      instance1: { openId: '', tabSheetData: {}, isFetching: false },
    });
  });

  it('action - setIsFetching', () => {
    expect(
      reducer(
        { instance1: emptyInstance },
        actions.setIsFetching({ instanceId: 'instance1', isFetching: true }),
      ),
    ).toEqual({
      instance1: { openId: '', tabSheetData: {}, isFetching: true },
    });
  });

  it('selectors', () => {
    const initialState = {
      tableVisualizers: {
        instance1: {
          openId: 'testOpenedId!M!S!OLFHKGABKBBAIFOAEENDAACPDHMKAIKJENLLACLKILCDEPEOG',
          tabSheetData: {},
          isFetching: false,
        },
      },
    };

    expect(selectors.instance(initialState, 'instance1')).toEqual({
      openId: 'testOpenedId!M!S!OLFHKGABKBBAIFOAEENDAACPDHMKAIKJENLLACLKILCDEPEOG',
      tabSheetData: {},
      isFetching: false,
    });
    expect(selectors.openId(initialState, 'instance1')).toEqual(
      'testOpenedId!M!S!OLFHKGABKBBAIFOAEENDAACPDHMKAIKJENLLACLKILCDEPEOG',
    );
    expect(selectors.tabSheetData(initialState, 'instance1')).toEqual({});
    expect(selectors.isFetching(initialState, 'instance1')).toEqual(false);
  });
});
