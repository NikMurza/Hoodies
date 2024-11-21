import Konva from 'konva';
import * as React from 'react';
import * as ReactKonva from 'react-konva';
import * as defaults from '@common/components/lib/canvas/visual-editor/defaults';
import {
  VisualEditorGrid,
  VisualEditorPosition,
  VisualEditorShapeType,
  VisualEditorSize,
} from '@common/components/lib/types/visual-editor';

export const DEFAULT_POSITION_X = 0;
export const DEFAULT_POSITION_Y = 0;
export const DEFAULT_CANVAS_SIZE = defaults.canvas.size;
export const DEFAULT_GRID_COLOR = defaults.colors.gridLinesColor;
export const DEFAULT_GRID_CELL_SIZE = defaults.canvas.gridCell;

const Grid: React.FC<VisualEditorGrid> = (props: VisualEditorGrid): JSX.Element => {
  const { position, coveredArea, color, cellSize, lineWidth, stageSize } = props;
  const { x, y } = position;
  const width = coveredArea.width ?? stageSize.width;
  const height = coveredArea.height ?? stageSize.height;
  const horizontalLinesCount = Math.ceil(height / cellSize);
  const verticalLinesCount = Math.ceil(width / cellSize);
  const lines = [];

  const onContextMenu = (e: Konva.KonvaEventObject<PointerEvent>): void => {
    e.evt.preventDefault();
  };

  // начинаем с 1, чтобы не рисовать линии у самого края холста
  for (let i = 1; i < horizontalLinesCount; i++) {
    lines.push(
      <ReactKonva.Line
        key={`hz_${i}`}
        points={[x, cellSize * i + y, width + x, cellSize * i + y]}
        stroke={color}
        strokeWidth={lineWidth}
        onContextMenu={onContextMenu}
      />,
    );
  }
  for (let i = 1; i < verticalLinesCount; i++) {
    lines.push(
      <ReactKonva.Line
        key={`vt_${i}`}
        points={[cellSize * i + x, y, cellSize * i + x, height + y]}
        stroke={color}
        strokeWidth={lineWidth}
        onContextMenu={onContextMenu}
      />,
    );
  }

  return <>{lines.map((line) => line)}</>;
};

interface CreateGridOpts {
  id?: string;
  position?: VisualEditorPosition;
  coveredArea?: VisualEditorSize;
  color?: string;
  cellSize?: number;
  lineWidth?: number;
}

/**
 * Создание элемента "Сетка" со всеми параметрами
 * @param {CreateGridOpts}  opts Опции
 */
export const createGrid = (opts?: CreateGridOpts): VisualEditorGrid => {
  opts = opts || {};
  const { id, position, coveredArea, color, cellSize, lineWidth } = opts;
  return {
    id: id || '',
    type: VisualEditorShapeType.Grid,
    position: {
      x: position ? position.x : DEFAULT_POSITION_X,
      y: position ? position.y : DEFAULT_POSITION_Y,
    },
    coveredArea: coveredArea || DEFAULT_CANVAS_SIZE,
    color: color || DEFAULT_GRID_COLOR,
    cellSize: cellSize || DEFAULT_GRID_CELL_SIZE,
    lineWidth: lineWidth || 1,
  };
};

Grid.defaultProps = {
  ...createGrid(),
};

export default React.memo(Grid);
