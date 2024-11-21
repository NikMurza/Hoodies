import * as React from 'react';

import { ReactReduxContext } from 'react-redux';
import Konva from 'konva';
import * as ReactKonva from 'react-konva';

import './VisualEditor.less';
import {
  VisualEditorActionCallback,
  VisualEditorActions,
  VisualEditorContextMenuIdentity,
  VisualEditorIdentityPosition,
  VisualEditorKeyboardAction,
  VisualEditorPosition,
  VisualEditorPositionalClick,
  VisualEditorShape,
  VisualEditorShapeWithRef,
  VisualEditorSize,
} from '@common/components/lib/types/visual-editor';
import { MouseButtons } from '@common/components/lib/types/mouseEvent';
import * as defaults from '@common/components/lib/canvas/visual-editor/defaults';
import { usePosition } from '@common/components/lib/canvas/hooks/usePosition';
import { useIsStage } from '@common/components/lib/canvas/hooks/useIsStage';
import WithDrop from '@common/components/lib/canvas/visual-editor/with-drop/WithDrop';
import WithResizeDetect, {
  WithResizeable,
} from '@common/components/lib/canvas/visual-editor/with-resize-detect/WithResizeDetect';
import StageContent from './StageContent';
import useAddRemoveComponents from './use-add-remove-component/useAddRemoveComponent';

export interface VELayer extends Konva.LayerConfig {
  children: JSX.Element;
}

export interface Props {
  /**
   * Идентификатор конкретного экземпляра VE
   */
  id?: string;

  /**
   * Элементы для отрисовки
   */
  items?: VisualEditorShape[];

  /*
   * Дополнительные слои ниже основного с контентом
   * Рекомендуется в них отображать дополнительные данные — grid, FPS и пр
   * См. useFPS, useGrid, useZoom
   */
  extraLayers?: JSX.Element;

  /*
   * Положение Stage
   * Значение по умолчанию - { x: 0, y: 0 }
   */
  position?: VisualEditorPosition;

  /*
   * Масштабирование содержимого Visual Editor, указывается в долях от 0,1 и выше.
   * Значение по умолчанию - 1, что соответствует 100%
   */
  zoom?: number;

  /*
   * Контролируем возможность перемещаться по канвасу
   * По умолчанию true
   */
  panEnabled?: boolean;

  /**
   * Вызывается на каких-либо событиях (изменение, удаление, контекстное меню)
   * @param action Событие
   * @param data Данные
   */
  onAction?: VisualEditorActionCallback;
}

const VisualEditorContainer = WithDrop(
  WithResizeDetect(
    (
      props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> &
        WithResizeable,
    ): JSX.Element => {
      const { resizeableRef, ...rest } = props;
      return <div ref={resizeableRef} {...rest} />;
    },
  ),
);

/**
 * Визуальный редактор - отображает таблицы со связями (и не только)
 * @param props Свойства
 */
const VisualEditor: React.FC<React.PropsWithChildren<Props>> = ({
  id,
  position,
  zoom: customZoom = 1,
  items,
  extraLayers,
  children,
  panEnabled,
  onAction,
}) => {
  const [contextMenuId, setContextMenuId] = React.useState<string>('');
  const [hoveredShape, setHoveredShape] = React.useState({ id: '', type: '' });

  const [stageSize, setStageSize] = React.useState<VisualEditorSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const stagePosition: VisualEditorPosition = {
    x: position?.x ?? 0,
    y: position?.y ?? 0,
  };

  const zoom = customZoom ?? defaults.canvas.zoom.initial;

  const stageRef = React.useRef<ReactKonva.Stage>(null);
  const isStage = useIsStage<Event>();

  const { components, onShapeAddComponent, onShapeRemoveComponent } = useAddRemoveComponents();

  const hideContextMenu = React.useCallback((): void => {
    setContextMenuId('');
  }, []);

  React.useEffect(() => {
    onAction<VisualEditorShapeWithRef<ReactKonva.Stage>>(VisualEditorActions.Mount, {
      forwardRef: stageRef,
    });
  }, [stageRef]);

  // Закрываем контекстное меню при правом клике на пустую область,
  // восстанавливаем действие по умолчанию.
  const onStageContextMenu = React.useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>): void => {
      if (isStage(e)) {
        e.evt.preventDefault();
        const { x, y } = usePosition<PointerEvent>(e);

        onAction<VisualEditorPositionalClick>(VisualEditorActions.ContextMenu, {
          id,
          x,
          y,
          target: e.target,
          event: { ...e?.evt, button: MouseButtons.Right },
        });
      }
    },
    [hideContextMenu, onAction],
  );

  const onStageClick = React.useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>): void => {
      const { x, y } = usePosition<PointerEvent>(e);
      onAction<VisualEditorPositionalClick>(VisualEditorActions.Click, {
        id,
        x,
        y,
        event: e?.evt,
        target: e?.target,
      });
      hideContextMenu();
    },
    [id, onAction],
  );

  const onStageMouseAction = React.useCallback(
    (action: VisualEditorActions) => (e: Konva.KonvaEventObject<MouseEvent>): void => {
      const { x, y } = usePosition<MouseEvent>(e);
      onAction<VisualEditorIdentityPosition>(action, {
        id,
        x,
        y,
      });
    },
    [id, onAction],
  );

  const onStageMouseMove = React.useCallback(onStageMouseAction(VisualEditorActions.MouseMove), [
    stageRef,
    onStageMouseAction,
  ]);

  const onStageMouseUp = React.useCallback(onStageMouseAction(VisualEditorActions.MouseUp), [
    stageRef,
    onStageMouseAction,
  ]);

  const onKeyboardAction = React.useCallback(
    (key: VisualEditorActions, event: React.KeyboardEvent<HTMLDivElement>): void => {
      onAction<VisualEditorKeyboardAction>(key, {
        id,
        isCtrl: event.ctrlKey,
        isShift: event.shiftKey,
        isAltKey: event.altKey,
        keyCode: event.keyCode,
        key: event.key,
        isRepeat: event.repeat,
      });
    },
    [id, onAction],
  );

  const onStageKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>): void =>
      onKeyboardAction(VisualEditorActions.KeyDown, event),
    [onKeyboardAction],
  );

  const onStageKeyUp = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>): void =>
      onKeyboardAction(VisualEditorActions.KeyUp, event),
    [onKeyboardAction],
  );

  const onStageDrag = React.useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      if (!isStage(e)) {
        return;
      }

      onAction<VisualEditorIdentityPosition>(VisualEditorActions.Move, {
        id,
        x: -e.target.x(),
        y: -e.target.y(),
      });
    },
    [id, onAction],
  );

  const onStageResize = React.useCallback(
    (size: VisualEditorSize): void => {
      setStageSize(size);
      onAction<VisualEditorSize>(VisualEditorActions.Resize, size);
    },
    [onAction],
  );

  const onShapeAction = React.useCallback(
    <T extends VisualEditorContextMenuIdentity>(action: VisualEditorActions, data: T): void => {
      const actions = {
        [VisualEditorActions.ContextMenu]: (data: VisualEditorContextMenuIdentity): void =>
          setContextMenuId(data.contextMenuId),
        [VisualEditorActions.Move]: hideContextMenu,
        [VisualEditorActions.Hover]: (data: VisualEditorShape): void => {
          setHoveredShape({ id: data.id, type: data.type });
        },
      };

      if (actions[action]) actions[action](data);
    },
    [hideContextMenu],
  );

  React.useEffect(() => {
    const selector = document.getElementById('root');
    if (!selector) {
      return null;
    }
    selector.addEventListener('click', hideContextMenu);
    selector.addEventListener('contextmenu', hideContextMenu, true);
    return (): void => {
      selector.removeEventListener('click', hideContextMenu);
      selector.removeEventListener('contextmenu', hideContextMenu);
    };
  }, []);

  const renderStage: boolean = stageSize.width > 0 && stageSize.height > 0;

  return (
    <VisualEditorContainer
      onResize={onStageResize}
      className="visual-editor"
      stageRef={stageRef}
      onAction={onAction}
    >
      <div
        tabIndex={-1}
        className="visual-canvas"
        onKeyDown={onStageKeyDown}
        onKeyUp={onStageKeyUp}
      >
        <ReactReduxContext.Consumer>
          {({ store }): JSX.Element =>
            !renderStage ? null : (
              <ReactKonva.Stage
                draggable={panEnabled}
                ref={stageRef}
                id={id}
                x={-stagePosition.x}
                y={-stagePosition.y}
                width={stageSize.width}
                height={stageSize.height}
                scaleX={zoom}
                scaleY={zoom}
                stageRef={stageRef}
                onClick={onStageClick}
                onContextMenu={onStageContextMenu}
                onMouseMove={onStageMouseMove}
                onMouseUp={onStageMouseUp}
                onDragEnd={onStageDrag}
              >
                {extraLayers}
                {/* подключаем к стору конву, если задан store */}
                {React.createElement(StageContent, {
                  store,
                  items,
                  hoveredShape,
                  contextMenuId,
                  stageSize,
                  onShapeAction,
                  onShapeAddComponent,
                  onShapeRemoveComponent,
                })}
              </ReactKonva.Stage>
            )
          }
        </ReactReduxContext.Consumer>
        {/* отрисовываем дополнительные компоненты */}
        <div className="visual-canvas__components">
          {Object.values(components)}
          {/* отрисовываем детей */}
          {children}
        </div>
      </div>
    </VisualEditorContainer>
  );
};

// по-умолчанию редактор занимает размер экрана
VisualEditor.defaultProps = {
  id: 'VisualEditor',
  items: [],
  panEnabled: true,
  onAction: (): void => undefined,
};

export default VisualEditor;
