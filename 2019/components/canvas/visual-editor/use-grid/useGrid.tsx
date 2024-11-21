import React, { useMemo } from 'react';
import * as _ from 'lodash';
import * as ReactKonva from 'react-konva';
import { useGetStage } from '@common/components/lib/canvas/hooks/useGetStage';
import * as defaults from '@common/components/lib/canvas/visual-editor/defaults';
import { IMap } from '@common/types/map';

const factorMap: IMap<number> = {
  400: 0.25,
  150: 0.5,
  100: 1,
  50: 2,
  25: 4,
  10: 8,
};

const factor = (zoom: number): number => {
  const scale = zoom * 100;
  let found = 1;

  _.reduce(
    factorMap,
    (prevLevel: number, factor: number, level: number): number => {
      if (scale > prevLevel && scale <= level) {
        found = factor;
      }

      return level;
    },
    0,
  );

  return found;
};

interface UseGridSettings {
  cellSize: number;
  lineColor: string;
  lineWidth: number;
}

function useGrid(
  stageRef: React.RefObject<ReactKonva.Stage>,
  settings?: UseGridSettings,
): JSX.Element {
  const stage = useGetStage(stageRef);

  const defaultCellSize = settings?.cellSize ?? defaults.canvas.gridCell;
  const lineColor = settings?.lineColor ?? defaults.colors.gridLinesColor;
  const lineWidth = settings?.lineWidth ?? defaults.canvas.gridLineWidth;

  const zoom = stage?.scaleX() ?? 1;
  const scale = 1 / zoom;

  const x = (stage?.x() ?? 0) * scale;
  const y = (stage?.y() ?? 0) * scale;

  const width = (stage?.width() ?? 0) * scale;
  const height = (stage?.height() ?? 0) * scale;

  const gridLines = useMemo(() => {
    const cellSize = factor(zoom) * defaultCellSize;

    const startX = Math.floor((-x - width) / cellSize) * cellSize;
    const startY = Math.floor((-y - height) / cellSize) * cellSize;

    const endX = Math.floor((-x + width * 2) / cellSize) * cellSize;
    const endY = Math.floor((-y + height * 2) / cellSize) * cellSize;

    const lines = [];

    for (let xi = startX; xi <= endX; xi += cellSize) {
      lines.push(
        <ReactKonva.Line
          key={`line-x-${xi}`}
          points={[xi, startY, xi, endY]}
          width={cellSize}
          height={cellSize}
          stroke={lineColor}
          strokeWidth={lineWidth / zoom}
        />,
      );
    }

    for (let yi = startY; yi <= endY; yi += cellSize) {
      lines.push(
        <ReactKonva.Line
          key={`line-y-${yi}`}
          points={[startX, yi, endX, yi]}
          width={cellSize}
          height={cellSize}
          stroke={lineColor}
          strokeWidth={lineWidth / zoom}
        />,
      );
    }

    return lines;
  }, [x, y, width, height, stageRef, stageRef?.current, defaultCellSize, lineColor, lineWidth]);

  return (
    <ReactKonva.Layer listening={false} draggable={false}>
      {gridLines}
    </ReactKonva.Layer>
  );
}

export default useGrid;
