import * as React from 'react';
import { mapTypeToComponent } from '@common/components/lib/canvas/shapes';
import {
  VisualEditorActions,
  VisualEditorContextMenuIdentity,
  VisualEditorShape,
  VisualEditorSize,
  VisualEditorComponentData,
} from '@common/components/lib/types/visual-editor';
import { typeContextMenuId } from '@common/components/lib/canvas/components/context-menu/with-context-menu/WithContextMenu';

interface Props {
  item: VisualEditorShape;
  contextMenuId: string;
  stageSize: VisualEditorSize;
  hoveredShape: { id: string; type: string };
  onShapeAction: <T extends VisualEditorContextMenuIdentity>(
    action: VisualEditorActions,
    data: T,
  ) => void;
  onShapeAddComponent: (data: VisualEditorComponentData) => void;
  onShapeRemoveComponent: (id: string) => void;
}

const Shape: React.FC<Props> = ({
  item,
  contextMenuId,
  stageSize,
  hoveredShape,
  onShapeAction,
  onShapeAddComponent,
  onShapeRemoveComponent,
}) => {
  const { id, type } = item;
  const ShapeComponent = mapTypeToComponent[type];
  const isContextMenuShow = contextMenuId === typeContextMenuId(id, type);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props = item as any;

  // перехватываем onAction у shape
  const onAction = React.useCallback(
    <T extends VisualEditorContextMenuIdentity>(action: VisualEditorActions, data: T): void => {
      onShapeAction(action, data);
      if (props.onAction) props.onAction(action, data);
    },
    [props, onShapeAction],
  );
  return (
    <ShapeComponent
      key={`${type}_${id}`}
      {...props}
      onAction={onAction}
      isHovered={id === hoveredShape.id && type === hoveredShape.type}
      isContextMenuShow={isContextMenuShow}
      stageSize={stageSize}
      onAddComponent={onShapeAddComponent}
      onRemoveComponent={onShapeRemoveComponent}
    />
  );
};

export default Shape;
