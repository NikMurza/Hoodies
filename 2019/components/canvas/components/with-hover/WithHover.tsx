import * as React from 'react';
import Konva from 'konva';
import {
  VisualEditorActions,
  VisualEditorShapeType,
  VisualEditorShape,
} from '@common/components/lib/types/visual-editor';

export interface WithHoverProps {
  id: string;
  type: VisualEditorShapeType;
  onAction<T extends object>(action: VisualEditorActions, data: T): void;
  onMouseEnter?(e: Konva.KonvaEventObject<MouseEvent>): void;
  onMouseLeave?(e: Konva.KonvaEventObject<MouseEvent>): void;
}

export const WithHover = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
): React.FC<P & WithHoverProps> => (props: WithHoverProps): JSX.Element => {
  const { id, type, onAction, onMouseEnter, onMouseLeave } = props;

  const triggerAction = React.useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>, isOut: boolean): void => {
      const data = { id: isOut ? '' : id, type };
      onAction<VisualEditorShape>(VisualEditorActions.Hover, data);
    },
    [onAction],
  );

  const onLeave = React.useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>): void => {
      triggerAction(e, true);
      if (onMouseLeave) {
        onMouseLeave(e);
      }
    },
    [triggerAction, onMouseLeave],
  );

  const onEnter = React.useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>): void => {
      triggerAction(e, false);
      if (onMouseEnter) {
        onMouseEnter(e);
      }
    },
    [triggerAction, onMouseEnter],
  );

  return <WrappedComponent {...(props as P)} onMouseEnter={onEnter} onMouseLeave={onLeave} />;
};

export default WithHover;
