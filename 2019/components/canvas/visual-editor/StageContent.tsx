import * as React from 'react';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import * as ReactKonva from 'react-konva';

import {
  VisualEditorActions,
  VisualEditorContextMenuIdentity,
  VisualEditorShape,
  VisualEditorSize,
  VisualEditorComponentData,
} from '@common/components/lib/types/visual-editor';
import Shape from './Shape';

export interface Props {
  store?: Store;
  items?: VisualEditorShape[];
  hoveredShape: { id: string; type: string };
  contextMenuId: string;
  stageSize: VisualEditorSize;
  onShapeAction: <T extends VisualEditorContextMenuIdentity>(
    action: VisualEditorActions,
    data: T,
  ) => void;
  onShapeAddComponent: (data: VisualEditorComponentData) => void;
  onShapeRemoveComponent: (id: string) => void;
}

const StageContent: React.FC<Props> = ({
  store,
  items,
  hoveredShape,
  contextMenuId,
  stageSize,
  onShapeAction,
  onShapeAddComponent,
  onShapeRemoveComponent,
}) => {
  const stage = React.useMemo(() => {
    const isHoveredShape = (shape: VisualEditorShape): boolean =>
      shape.id === hoveredShape.id && shape.type === hoveredShape.type;
    const ordered = items.filter((item) => !isHoveredShape(item));
    ordered.push(...items.filter(isHoveredShape));

    const renderItem = (item: VisualEditorShape): JSX.Element =>
      React.createElement(Shape, {
        key: `${item.type}-${item.id}`,
        item,
        contextMenuId,
        stageSize,
        hoveredShape,
        onShapeAction,
        onShapeAddComponent,
        onShapeRemoveComponent,
      });

    return <ReactKonva.Layer>{ordered.map(renderItem)}</ReactKonva.Layer>;
  }, [
    items,
    hoveredShape,
    contextMenuId,
    stageSize,
    onShapeAction,
    onShapeAddComponent,
    onShapeRemoveComponent,
  ]);

  return store ? <Provider store={store}>{stage}</Provider> : stage;
};

export default StageContent;
