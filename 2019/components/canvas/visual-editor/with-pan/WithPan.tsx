import { MouseButtons } from '@common/components/lib/types/mouseEvent';
import { MouseEventType } from '@common/components/lib/types/konvaEvent';
import * as React from 'react';
import Konva from 'konva';
import produce from 'immer';
import {
  VisualEditorActionCallback,
  VisualEditorActions,
  VisualEditorIdentityPosition,
  VisualEditorPan,
  VisualEditorPanType,
} from '@common/components/lib/types/visual-editor';
import { useIsStage } from '@common/components/lib/canvas/hooks/useIsStage';
import Point from '@common/geometry/point';

export interface WithPanProps {
  x: number;
  y: number;
  type?: VisualEditorPanType;
  /** Курсор после отпускания ЛКМ */
  defaultCursor?: string;
  disabled?: boolean;
  className?: string;
  onAction?: VisualEditorActionCallback;
  onMouseMove?(evt: MouseEventType): void;
  onMouseDown?(evt: MouseEventType): void;
  onMouseUp?(evt: MouseEventType): void;
}

const isStage = useIsStage<MouseEvent>();

const getEventType = (
  e: MouseEventType,
  type: VisualEditorPanType,
): { sourceEvent: MouseEvent; isTargetCorrect: boolean } => {
  let sourceEvent;
  let isTargetCorrect;
  if (type === VisualEditorPanType.Canvas) {
    const event = e as Konva.KonvaEventObject<MouseEvent>;
    sourceEvent = event.evt;
    isTargetCorrect = isStage(event);
  } else {
    sourceEvent = e as MouseEvent;
    isTargetCorrect = true;
  }
  return {
    sourceEvent,
    isTargetCorrect,
  };
};

const WithPan = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
): React.FC<P & WithPanProps> => (props: WithPanProps): JSX.Element => {
  const {
    x,
    y,
    type = VisualEditorPanType.Canvas,
    defaultCursor = 'default',
    disabled = false,
    onAction,
    ...restProps
  } = props;

  const { onMouseDown, onMouseMove, onMouseUp } = restProps;

  const [pan, setPan] = React.useState<VisualEditorPan>({ panning: false });

  const onPanStart = (e: MouseEventType): void => {
    const { sourceEvent, isTargetCorrect } = getEventType(e, type);

    if (onMouseDown) {
      onMouseDown(e);
    }

    const { screenX, screenY, button } = sourceEvent;
    if (button !== MouseButtons.Left || !isTargetCorrect || disabled) {
      return;
    }

    setPan({
      initialCursor: new Point(screenX, screenY),
      initialPosition: new Point(x, y),
      panning: true,
    });
    document.body.style.cursor = 'grabbing';
  };

  const onPanMove = React.useCallback(
    (e: MouseEventType): void => {
      const { panning, initialCursor, initialPosition } = pan;

      if (!panning) {
        return;
      }

      if (onMouseMove) {
        onMouseMove(e);
      }

      const { sourceEvent } = getEventType(e, type);
      const { screenX, screenY } = sourceEvent;

      const delta = new Point(screenX, screenY).subtract(initialCursor);

      // const cursorCorrection = new Point(Math.min(-delta.x, 0), Math.min(-delta.y, 0));
      const cursorCorrection = new Point(0, 0);

      onAction<VisualEditorIdentityPosition>(VisualEditorActions.Move, {
        id: '',
        x: initialPosition.x - delta.x,
        y: initialPosition.y - delta.y,
      });

      setPan((state: VisualEditorPan) =>
        produce(state, (updated: VisualEditorPan) => {
          updated.initialCursor.subtract(cursorCorrection);
        }),
      );
    },
    [pan, x, y],
  );

  const onPanEnd = React.useCallback(
    (e: MouseEventType): void => {
      if (onMouseUp) {
        onMouseUp(e);
      }
      setPan({ panning: false });
      document.body.style.cursor = defaultCursor;
    },
    [defaultCursor],
  );

  React.useEffect(() => {
    window.addEventListener('mouseup', onPanEnd);
    return (): void => {
      window.removeEventListener('mouseup', onPanEnd);
    };
  }, [defaultCursor]);

  // Не передаем нестандартные атрибуты, если имеем дело с HTML-элементами, отличными от канваса
  const updatedProps = type === VisualEditorPanType.Common ? restProps : props;

  return (
    <WrappedComponent
      {...(updatedProps as P)}
      onMouseDown={onPanStart}
      onMouseMove={onPanMove}
      onMouseUp={onPanEnd}
    />
  );
};

export default WithPan;
