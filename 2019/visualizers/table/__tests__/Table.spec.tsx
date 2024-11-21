import * as React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import '@testing-library/jest-dom';
import { act, render } from '@common/test-utils';
import { Table, mapStateToProps, mapDispatchToProps } from '../Table';
import { TabSheetRawData } from '../store/types';
import tableVisualizerSlice from '../store/slice';
import tableVisualizerThunk from '../store/thunks';

const initialState = {
  tableVisualizers: {
    testInstanceId: {
      openId: 'testOpenedId!M!S!OLFHKGABKBBAIFOAEENDAACPDHMKAIKJENLLACLKILCDEPEOG',
      tabSheetData: {},
      isFetching: false,
    },
  },
};

const props = {
  openedId: 'openedId',
  instanceKey: 'instanceKey',
  instanceId: '1',
  instanceOpenedId: 'instanceOpenedId',
  isFetching: false,
  tabSheetData: (): TabSheetRawData => ({}),
  setOpenId: jest.fn,
  createInstance: jest.fn,
  load: jest.fn,
  pressTabsheetPicture: jest.fn,
  loadTabSheetRanges: jest.fn,
};

describe('Table component', () => {
  it('render', async () => {
    await act(() => {
      render(<Table {...props} />);
    });
  });
  it('renders correctly', () => {
    expect(toJson(shallow(<Table {...props} />))).toMatchSnapshot();
  });

  const ownProps = {
    id: 'testId',
    instanceKey: 'testInstanceKey',
    openedId: 'testOpenedId',
    instanceId: 'testInstanceId',
    triggerReload: false,
    browserRoutingMode: false,
    x: 10,
    y: 20,
  };

  it('mapStateToProps', () => {
    expect(mapStateToProps(initialState, { ...ownProps }).instanceOpenedId).toEqual(
      tableVisualizerSlice.selectors.openId(initialState, ownProps.instanceId),
    );
    expect(mapStateToProps(initialState, { ...ownProps }).tabSheetData('testInstanceId')).toEqual(
      {},
    );
  });

  it('mapDispatchToProps', () => {
    expect(JSON.stringify(mapDispatchToProps.setOpenId)).toEqual(
      JSON.stringify(tableVisualizerSlice.actions.setOpenId),
    );
    expect(JSON.stringify(mapDispatchToProps.createInstance)).toEqual(
      JSON.stringify(tableVisualizerSlice.actions.createInstance),
    );

    expect(JSON.stringify(mapDispatchToProps.load)).toEqual(
      JSON.stringify(tableVisualizerThunk.load),
    );

    expect(JSON.stringify(mapDispatchToProps.pressTabsheetPicture)).toEqual(
      JSON.stringify(tableVisualizerThunk.pressTabsheetPicture),
    );

    expect(JSON.stringify(mapDispatchToProps.loadTabSheetRanges)).toEqual(
      JSON.stringify(tableVisualizerThunk.loadTabSheetRanges),
    );
  });
});
