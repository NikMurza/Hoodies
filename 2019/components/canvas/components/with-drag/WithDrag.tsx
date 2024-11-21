import * as React from 'react';
import {
  VisualEditorActions,
  VisualEditorLocation,
  VisualEditorPosition,
  VisualEditorShape,
} from '@common/components/lib/types/visual-editor';
import Konva from 'konva';

export interface WithDragProps {
  id: string;
  draggable: boolean;
  dragBoundFunc?: (pos: VisualEditorPosition) => VisualEditorPosition;
  onAction<T extends object>(action: VisualEditorActions, data: T): void;
}

const WithDrag = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
): React.FC<P & WithDragProps> => (props: WithDragProps): JSX.Element => {
  const { id, draggable, onAction, dragBoundFunc } = props;

  const [isDragging, setIsDragging] = React.useState(false);

  const triggerAction = React.useCallback(
    (action: VisualEditorActions, e: Konva.KonvaEventObject<DragEvent>): void => {
      const targetProps: VisualEditorShape = e.target.attrs;
      const targetId = targetProps?.id ?? '';
      if (targetId !== id) {
        return;
      }

      // х и у отвечают за центр круга.
      onAction<VisualEditorLocation>(action, {
        id,
        x: e.target.x(),
        y: e.target.y(),
        width: e.target.width(),
        height: e.target.height(),
      });
    },
    [onAction, id],
  );

  const onDragStart = React.useCallback((): void => {
    setIsDragging(true);
  }, []);

  const onDragMove = React.useCallback(
    (e: Konva.KonvaEventObject<DragEvent>): void => {
      // х и у отвечают за центр круга.
      triggerAction(VisualEditorActions.Move, e);
    },
    [triggerAction],
  );

  const onDragEnd = React.useCallback(
    (e: Konva.KonvaEventObject<DragEvent>): void => {
      if (isDragging) {
        triggerAction(VisualEditorActions.DragEnd, e);
      }

      setIsDragging(false);
    },
    [triggerAction, isDragging],
  );

  return (
    <WrappedComponent
      {...(props as P)}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      dragBoundFunc={dragBoundFunc}
    />
  );
};

export default WithDrag;
