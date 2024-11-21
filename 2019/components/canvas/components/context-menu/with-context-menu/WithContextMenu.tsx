import * as React from 'react';
import {
  ContextMenuItem,
  VisualEditorActions,
  VisualEditorComponentData,
  VisualEditorShapeType,
  VisualEditorContextMenuIdentity,
  VisualEditorPosition,
} from '@common/components/lib/types/visual-editor';
import Konva from 'konva';
import ContextMenu from '@common/components/lib/canvas/components/context-menu/ContextMenu';

export interface WithContextMenuProps {
  id: string;
  type: VisualEditorShapeType;
  isContextMenuShow: boolean;
  items: ContextMenuItem[];
  onAction<T extends object>(action: VisualEditorActions, data: T): void;
  onAddComponent: (data: VisualEditorComponentData) => void;
  onRemoveComponent: (id: string) => void;
}

export const typeContextMenuId = (id: string, type: VisualEditorShapeType): string =>
  `context_menu_${type}_${id}`;

export const WithContextMenu = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
): React.FC<P & WithContextMenuProps> => (props: WithContextMenuProps): JSX.Element => {
  const { id, type, isContextMenuShow, items, onAction, onAddComponent, onRemoveComponent } = props;

  const contextMenuId = React.useMemo(() => typeContextMenuId(id, type), [id, type]);

  const [contextMenuPosition, setContextMenuPosition] = React.useState<VisualEditorPosition>({
    x: 0,
    y: 0,
  });

  const triggerAction = React.useCallback(
    (contextMenuId: string): void => {
      onAction<VisualEditorContextMenuIdentity>(VisualEditorActions.ContextMenu, {
        contextMenuId,
      });
    },
    [onAction],
  );

  const onContextMenu = React.useCallback(
    (e: Konva.KonvaEventObject<PointerEvent>): void => {
      e.evt.preventDefault();

      const { clientX: x, clientY: y } = e.evt;

      // запоминаем координаты где показывать меню
      setContextMenuPosition({ x, y });

      // Закрываем предыдущее меню, если есть. Генерим action показать контекстное меню
      triggerAction('');
      triggerAction(contextMenuId);
    },
    [triggerAction],
  );

  React.useEffect(() => {
    if (isContextMenuShow) {
      const { x, y } = contextMenuPosition;

      // показываем контектное меню
      const data: VisualEditorComponentData = {
        id: contextMenuId,
        component: (
          <ContextMenu id={id} key={contextMenuId} x={x} y={y} items={items} onAction={onAction} />
        ),
      };
      onAddComponent(data);
    } else {
      // прячем контекстное меню
      triggerAction('');
      onRemoveComponent(contextMenuId);
    }
  }, [isContextMenuShow]);

  return <WrappedComponent {...(props as P)} onContextMenu={onContextMenu} />;
};

export default WithContextMenu;
