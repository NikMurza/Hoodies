import * as React from 'react';
import { usePosition } from '@common/components/lib/canvas/hooks/usePosition';
import {
  VisualEditorActionCallback,
  VisualEditorActions,
  VisualEditorPosition,
} from '@common/components/lib/types/visual-editor';
import { useGetStage } from '@common/components/lib/canvas/hooks/useGetStage';
import * as ReactKonva from 'react-konva';

export interface WithDropProps {
  stageRef: React.RefObject<ReactKonva.Stage>;
  onAction: VisualEditorActionCallback;
}

const WithDrop = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
): React.FC<P & WithDropProps> => (props: WithDropProps): JSX.Element => {
  const { stageRef, onAction, ...restProps } = props;

  const onDragOver = React.useCallback((e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  }, []);

  const onDrop = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>): void => {
      e.preventDefault();

      const stage = useGetStage(stageRef);
      const { x, y } = usePosition<HTMLDivElement>(e, stage);
      onAction<VisualEditorPosition>(VisualEditorActions.Add, { x, y });
    },
    [stageRef, onAction],
  );

  return <WrappedComponent {...(restProps as P)} onDragOver={onDragOver} onDrop={onDrop} />;
};

export default WithDrop;
