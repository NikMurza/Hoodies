import React from 'react';
import Konva from 'konva';
import * as ReactKonva from 'react-konva';
import { useGetStage } from '@common/components/lib/canvas/hooks/useGetStage';
import { VisualEditorPosition } from '@common/components/lib/types/visual-editor';
import { useIsStage } from '@common/components/lib/canvas/hooks/useIsStage';
import colors from '@common/styles/constants/colors';
import fontConst from '@common/styles/constants/fonts';
import AARectangle from '@common/geometry/rectangle';

export interface ZoomProps {
  x: number;
  y: number;
  width: number;
  height: number;
  zoom: number;
  stageRef: React.RefObject<ReactKonva.Stage>;
  onChange: (zoom: number, position: VisualEditorPosition) => void;
  min?: number;
  max?: number;
  step?: number;
}

const useZoom = (props: ZoomProps): JSX.Element => {
  const { stageRef, zoom, min, max, step, onChange } = props;

  const isStage = useIsStage<Event>();

  const textRef = React.useRef<Konva.Text>(null);
  const rectRef = React.useRef<Konva.Rect>(null);

  const updatePositions = (customX?: number, customY?: number, customZoom?: number): void => {
    const stage = useGetStage(stageRef);

    const updated = customZoom ?? zoom;

    const value = (updated * 100).toFixed(0);
    const fontSize = fontConst.size / updated;

    const textPaddings = 15;
    const scaledTextPaddings = textPaddings / updated;

    const positionX = (-stage?.x() + stage?.width() - 5 * textPaddings - 5) / updated;
    const positionY = (-stage?.y() + stage?.height() - 5 * textPaddings + 20) / updated;

    const text = textRef.current;
    const rect = rectRef.current;

    if (!text || !rect) {
      return;
    }

    text.fontSize(fontSize);
    text.text(`${value}%`);

    text.x(positionX);
    text.y(positionY);

    const textWidth = text.width();
    const textHeight = text.height();

    rect.x(positionX - scaledTextPaddings);
    rect.y(positionY - scaledTextPaddings);
    rect.width(textWidth + 2 * scaledTextPaddings);
    rect.height(textHeight + 2 * scaledTextPaddings);
  };

  const onChangeZoom = (
    x: number,
    y: number,
    zoom: number,
    newZoom: number,
    point: VisualEditorPosition,
  ): void => {
    if (newZoom === zoom) {
      return;
    }

    const newPos: VisualEditorPosition = {
      x: ((point.x + x) / zoom) * newZoom - point.x,
      y: ((point.y + y) / zoom) * newZoom - point.y,
    };

    onChange(newZoom, newPos);
  };

  const onStageWheel = React.useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>): void => {
      e.evt.preventDefault();

      const stage = useGetStage(stageRef);

      const scale = (1 + step) ** Math.sign(-e.evt.deltaY);
      const zoom = stage.scaleX();
      const newZoom = AARectangle.bound(zoom * scale, min, max);

      const pointer = stage.getPointerPosition();

      onChangeZoom(-stage.x(), -stage.y(), zoom, newZoom, pointer);
    },
    [step, stageRef, zoom, min, max],
  );

  const onClick = (e: Konva.KonvaEventObject<MouseEvent>): void => {
    e.evt.preventDefault();

    const stage = useGetStage(stageRef);

    const zoom = stage.scaleX();
    const newZoom = 1;

    onChangeZoom(-stage.x(), -stage.y(), zoom, newZoom, {
      x: stage.width() / 2,
      y: stage.height() / 2,
    });
  };

  const onStageDrag = React.useCallback(
    (e: Konva.KonvaEventObject<DragEvent>): void => {
      if (!isStage(e)) {
        return;
      }

      const stage = useGetStage(stageRef);
      updatePositions(-stage?.x(), -stage?.y(), stage?.scaleX());
    },
    [stageRef, stageRef?.current],
  );

  React.useEffect(() => {
    const stage = useGetStage(stageRef);
    stage?.on('wheel', onStageWheel);
    return (): void => {
      stage?.off('wheel', onStageWheel);
    };
  }, [stageRef, stageRef?.current]);

  React.useEffect(() => {
    const stage = useGetStage(stageRef);
    stage?.on('dragmove', onStageDrag);
    return (): void => {
      stage?.off('dragmove', onStageDrag);
    };
  }, [stageRef, stageRef?.current]);

  const onMouse = React.useCallback(
    (cursor: string, color: string): void => {
      const stage = useGetStage(stageRef);
      if (!stage) {
        return;
      }

      stage.content.style.cursor = cursor;
      textRef.current?.fill(color);

      stage.batchDraw();
    },
    [stageRef, stageRef?.current],
  );

  const onMouseEnter = (): void => onMouse('pointer', colors.blue);
  const onMouseLeave = (): void => onMouse('default', colors.text);

  updatePositions();

  return (
    <ReactKonva.Layer>
      <ReactKonva.Rect
        ref={rectRef}
        x={0}
        y={0}
        width={0}
        height={0}
        fill={colors.white}
        shadowColor={colors.shadowColor}
        shadowOffsetX={0}
        shadowOffsetY={2}
        shadowBlur={8}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
      <ReactKonva.Text
        ref={textRef}
        listening={false}
        x={0}
        y={0}
        align="left"
        fill={colors.text}
        fontFamily={fontConst.family}
        fontStyle="normal"
      />
    </ReactKonva.Layer>
  );
};

export default useZoom;
