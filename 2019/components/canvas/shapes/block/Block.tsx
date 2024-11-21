import WithDrag from '@common/components/lib/canvas/components/with-drag/WithDrag';
import WithHover from '@common/components/lib/canvas/components/with-hover/WithHover';

import { useExtension } from '@common/components/lib/canvas/hooks/useExtension';
import * as defaults from '@common/components/lib/canvas/visual-editor/defaults';
import {
  VisualEditorBlock,
  VisualEditorShapeType,
} from '@common/components/lib/types/visual-editor';
import Konva from 'konva';

import * as React from 'react';
import * as ReactKonva from 'react-konva';
import WithContextMenu from '@common/components/lib/canvas/components/context-menu/with-context-menu/WithContextMenu';
import WithTransformer from '@common/components/lib/canvas/components/with-transformer/WithTransformer';

export type BlockProps<R extends object = Konva.Group> = VisualEditorBlock<R>;

const GroupWithHOCs = WithHover(
  WithTransformer(
    WithContextMenu(
      WithDrag((props: Konva.NodeConfig) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <ReactKonva.Group ref={(props as any).forwardedRef} {...props} />
      )),
    ),
  ),
);

const Block: React.FC<BlockProps> = React.forwardRef<Konva.Group, BlockProps>(
  (props: BlockProps, ref: React.RefObject<Konva.Group>): JSX.Element => {
    const {
      id,
      type,
      x,
      y,
      width,
      height,
      draggable,
      minWidth,
      minHeight,
      rotation,
      resizable,
      rotatable,
      extension,
      extensionProps,
      borderRadius,
      theme,
      isContextMenuShow,
      contextMenuItems,
      onAction,
      onAddComponent,
      onRemoveComponent,
      dragBoundFunc,
      zIndex,
    } = props;

    const { opacity, backgroundColor, borderColor, borderWidth } = theme;

    const extensionElement = useExtension<VisualEditorBlock<Konva.Group>>(
      extension,
      extensionProps,
      {
        ...props,
        forwardRef: ref,
      },
    );

    return (
      <GroupWithHOCs
        forwardedRef={ref}
        type={type}
        id={id}
        x={x}
        y={y}
        width={width}
        height={height}
        items={contextMenuItems}
        isContextMenuShow={isContextMenuShow}
        debounceHoverActions={false}
        rotation={rotation}
        draggable={draggable}
        minWidth={minWidth}
        minHeight={minHeight}
        accentColor={borderColor}
        resizable={resizable}
        rotatable={rotatable}
        onAction={onAction}
        onAddComponent={onAddComponent}
        onRemoveComponent={onRemoveComponent}
        opacity={opacity}
        zIndex={zIndex}
        dragBoundFunc={dragBoundFunc}
      >
        <ReactKonva.Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={backgroundColor}
          strokeWidth={borderWidth}
          stroke={borderColor}
          cornerRadius={borderRadius}
        />
        {extensionElement}
      </GroupWithHOCs>
    );
  },
);

export default React.memo(Block);

type CreateBlockOptions<R extends object = Konva.Group> = Omit<VisualEditorBlock<R>, 'type'>;

export const createBlock = <R extends object = Konva.Group>(
  opts: CreateBlockOptions<R>,
): BlockProps<R> => ({
  draggable: true,
  extension: null,
  theme: {
    opacity: 1,
    backgroundColor: defaults.colors.transparent,
    borderWidth: defaults.element.borderWidth,
    borderColor: defaults.colors.destTypeColor,
  },
  borderRadius: defaults.element.borderRadius,
  type: VisualEditorShapeType.Block,
  ...opts,
});
