import * as React from 'react';
import Konva from 'konva';
import { KonvaEvent } from '@common/components/lib/types/konvaEvent';
import { VisualEditorPosition } from '@common/components/lib/types/visual-editor';

export type ReactEvent<T> = React.DragEvent<T>;

function isKonvaEvent<T>(e: KonvaEvent<T> | ReactEvent<T>): e is KonvaEvent<T> {
  return (e as KonvaEvent<T>).evt !== undefined;
}

export function usePosition<T>(
  e: KonvaEvent<T> | ReactEvent<T>,
  stage?: Konva.Stage,
): VisualEditorPosition {
  const isKonva = isKonvaEvent(e);
  if (isKonva) {
    stage = (e as KonvaEvent<T>)?.currentTarget?.getStage();
  }

  if (!stage) {
    return {
      x: 0,
      y: 0,
    };
  }

  if (!isKonva) {
    stage.setPointersPositions(e);
  }

  return stage.getPointerPosition();
}
