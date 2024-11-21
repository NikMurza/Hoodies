import * as React from 'react';
import TabSheet from '@common/components/lib/rich/tab-sheet/TabSheet';
import { connect } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { ETabSheetEditMode } from '@common/components/lib/enums/tab-sheet';
import { PPSom } from '@common/api/types/PPSom';
import { ITabSheetPictureMouseDownArgs } from '@common/components/lib/types/tab-sheet';
import WithFetching from '@common/components/lib/canvas/components/with-fetching/WithFetching';
import { VisualizerType } from '@common/api/types/visualizers/root';
import tableVisualizerSlice from './store/slice';
import tableVisualizerThunk from './store/thunks';
import { TabSheetRawData, StatePart } from './store/types';
import './Table.less';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Component = WithFetching<any>(TabSheet);

interface OwnProps {
  openedId: string;
  instanceId: string;
  // при изменении этого флага - будет вызываться load
  triggerReload?: boolean;
  browserRoutingMode?: boolean;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  zoom?: number;
}

interface StateProps {
  instanceOpenedId: string;
  tabSheetData: (instanceId: string) => TabSheetRawData;
  isFetching: boolean;
}

interface DispatchProps {
  setOpenId: (payload: { instanceId: string; openedId: string }) => void;
  load: (instanceId: string) => void;
  createInstance: (instanceId: string) => void;
  pressTabsheetPicture: (instanceId: string, args: ITabSheetPictureMouseDownArgs) => void;
  loadTabSheetRanges: (instanceId: string, ranges?: PPSom.Rect[]) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

export const Table: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    x,
    y,
    width,
    height,
    zoom,
    browserRoutingMode,
    instanceId,
    openedId,
    instanceOpenedId,
    triggerReload,
    isFetching,
    tabSheetData,
    createInstance,
    setOpenId,
    load,
    pressTabsheetPicture,
    loadTabSheetRanges,
  } = props;

  React.useEffect((): void => {
    if (instanceId && openedId) {
      createInstance(instanceId);
      setOpenId({ instanceId, openedId });
    }
  }, [instanceId, openedId]);

  React.useEffect((): void => {
    if (instanceOpenedId && instanceId) {
      load(instanceId);
    }
  }, [instanceOpenedId, instanceId, triggerReload]);

  const data = tabSheetData(instanceId);

  const onLoadTabSheetRanges = (ranges?: PPSom.Rect[]): void => {
    loadTabSheetRanges(instanceId, ranges);
  };

  const onTabSheetPictureMouseDown = (args: ITabSheetPictureMouseDownArgs): void => {
    pressTabsheetPicture(instanceId, args);
  };

  return (
    <div className="table-visualizer" style={{ left: x, top: y, width, height }}>
      <Component
        className="table-visualizer-tabsheet"
        isFetching={isFetching}
        type={VisualizerType.Grid}
        browserRoutingMode={browserRoutingMode}
        editMode={ETabSheetEditMode.Disable}
        data={data}
        useNumberFormats
        isPtFontUnit
        zoom={zoom}
        width={width}
        height={height}
        rowHeaderWidth={0}
        columnHeaderHeight={1}
        onLoadRanges={onLoadTabSheetRanges}
        onPictureMouseDown={onTabSheetPictureMouseDown}
      />
    </div>
  );
};

Table.defaultProps = {
  triggerReload: undefined,
  width: undefined,
  height: undefined,
  zoom: undefined,
  browserRoutingMode: true,
  x: 0,
  y: 0,
};

export const mapStateToProps = (state: StatePart, ownProps: OwnProps): StateProps => ({
  instanceOpenedId: tableVisualizerSlice.selectors.openId(state, ownProps.instanceId),
  isFetching: tableVisualizerSlice.selectors.isFetching(state, ownProps.instanceId),
  tabSheetData: (instanceId: string): TabSheetRawData =>
    tableVisualizerSlice.selectors.tabSheetData(state, instanceId),
});

export const mapDispatchToProps: DispatchProps = {
  setOpenId: tableVisualizerSlice.actions.setOpenId,
  createInstance: tableVisualizerSlice.actions.createInstance,
  load: tableVisualizerThunk.load,
  pressTabsheetPicture: tableVisualizerThunk.pressTabsheetPicture,
  loadTabSheetRanges: tableVisualizerThunk.loadTabSheetRanges,
};

const enhance = compose(connect(mapStateToProps, mapDispatchToProps));
export default enhance(Table);
