import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';
import { VisualEditorShapeType } from '@common/components/lib/types/visual-editor';
import Grid, {
  createGrid,
  DEFAULT_POSITION_X,
  DEFAULT_POSITION_Y,
  DEFAULT_CANVAS_SIZE,
  DEFAULT_GRID_COLOR,
  DEFAULT_GRID_CELL_SIZE,
} from '../Grid';

describe('Grid component', () => {
  it('renders correctly', () => {
    const coveredArea = {
      width: 500,
      height: 500,
    };
    const color = '#ccc';
    const cellSize = 50;
    const lineWidth = 1;
    expect(
      toJson(
        shallow(
          <Grid
            type={VisualEditorShapeType.Grid}
            id="grid"
            coveredArea={coveredArea}
            color={color}
            cellSize={cellSize}
            lineWidth={lineWidth}
          />,
        ),
      ),
    ).toMatchSnapshot();
  });

  it('createCircle works correctly with default props', () => {
    expect(createGrid()).toEqual({
      id: '',
      type: VisualEditorShapeType.Grid,
      position: {
        x: DEFAULT_POSITION_X,
        y: DEFAULT_POSITION_Y,
      },
      coveredArea: DEFAULT_CANVAS_SIZE,
      color: DEFAULT_GRID_COLOR,
      cellSize: DEFAULT_GRID_CELL_SIZE,
      lineWidth: 1,
    });
  });

  it('createCircle works correctly with custom props', () => {
    const id = 'table1';
    expect(
      createGrid({
        id: 'testId',
        position: {
          x: 100,
          y: 2000,
        },
        coveredArea: {
          width: 100000,
          height: 200000,
        },
        cellSize: 10,
      }),
    ).toEqual({
      id: 'testId',
      type: VisualEditorShapeType.Grid,
      position: {
        x: 100,
        y: 2000,
      },
      coveredArea: {
        width: 100000,
        height: 200000,
      },
      color: DEFAULT_GRID_COLOR,
      cellSize: 10,
      lineWidth: 1,
    });
  });
});
