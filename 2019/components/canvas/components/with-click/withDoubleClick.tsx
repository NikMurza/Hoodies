import { IMap } from '@common/types/map';
import { usePosition } from '@common/components/lib/canvas/hooks/usePosition';
import {
  VisualEditorActions,
  VisualEditorPositionalClick,
} from '@common/components/lib/types/visual-editor';
import Konva from 'konva';
import * as React from 'react';

const defaultLatency = 150;
const defaultPayload = 'ON_MOUSE_CLICK';

export interface WithClickProps {
  /* Идентификатор шейпа */
  id: string;
  /* Количество миллисекунд в течение которых происходит диференциация
  клика и двойного клика */
  latency?: number;
  /* Обработчик событий-экшенов */
  onAction<T extends object>(action: VisualEditorActions, data: T): void;
  onClick?(e: Konva.KonvaEventObject<MouseEvent>): void;
  onDoubleClick?(e: Konva.KonvaEventObject<MouseEvent>): void;
}

const WithDoubleClick = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
): React.FC<P & WithClickProps> => (props: WithClickProps): JSX.Element => {
  const { id, latency, onAction, onClick, onDoubleClick, ...restProps } = props;

  const actions: IMap<VisualEditorActions> = {
    1: VisualEditorActions.Click,
    2: VisualEditorActions.DoubleClick,
  };

  const handlers = {
    [VisualEditorActions.Click]: onClick,
    [VisualEditorActions.DoubleClick]: onDoubleClick,
  };

  const callAction = React.useCallback(
    (count: number, e: Konva.KonvaEventObject<MouseEvent>): void => {
      const action: VisualEditorActions = actions[count];
      if (!action) {
        return;
      }

      const { x, y } = usePosition<MouseEvent>(e);
      onAction<VisualEditorPositionalClick<object, string>>(action, {
        x,
        y,
        id,
        event: e?.evt,
        payload: defaultPayload,
      });

      const handler = handlers[action];
      if (handler) {
        handler(e);
      }
    },
    [],
  );

  const count = React.useRef<number>(0);
  const onClickHandler = (e: Konva.KonvaEventObject<MouseEvent>): void => {
    count.current += 1;

    window.setTimeout((): void => {
      callAction(count.current, e);
      count.current = 0;
    }, latency ?? defaultLatency);
  };

  return <WrappedComponent {...(restProps as P)} onClick={onClickHandler} />;
};

export default WithDoubleClick;
