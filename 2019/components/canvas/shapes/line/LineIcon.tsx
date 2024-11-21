import WithHover from '@common/components/lib/canvas/components/with-hover/WithHover';
import UrlImage from '@common/components/lib/canvas/shapes/url-image/UrlImage';
import {
  VisualEditorComponentContract,
  VisualEditorPosition,
  VisualEditorPositionalShape,
  VisualEditorShape,
  VisualEditorTheme,
} from '@common/components/lib/types/visual-editor';
import onMouseOverCursorPointer from '@common/hocs/lib/onMouseOverCursorPointer/onMouseOverCursorPointer';
import Konva from 'konva';
import * as React from 'react';
import * as ReactKonva from 'react-konva';

export interface LineIconProps
  extends VisualEditorShape,
    VisualEditorPositionalShape,
    VisualEditorComponentContract {
  position: VisualEditorPosition;
  icon?: string;
  radius?: number;
  backplateTheme?: VisualEditorTheme;
  backplateRadius?: number;
}

const GroupWithHOCs = WithHover(
  // eslint-disable-next-line react/jsx-props-no-spreading
  onMouseOverCursorPointer((props: Konva.NodeConfig) => <ReactKonva.Group {...props} />),
);

const LineIcon: React.FC<LineIconProps> = (props: LineIconProps): JSX.Element => {
  const {
    id,
    type,
    position,
    icon,
    radius,
    backplateTheme,
    backplateRadius,
    isContextMenuShow,
    contextMenuItems,
    onAction,
    onAddComponent,
    onRemoveComponent,
  } = props;

  const { opacity, backgroundColor, borderColor, borderWidth } = backplateTheme;

  const offset: VisualEditorPosition = {
    x: -radius / 2,
    y: -radius / 2,
  };

  return (
    <GroupWithHOCs
      id={id}
      type={type}
      isContextMenuShow={isContextMenuShow}
      items={contextMenuItems}
      onAction={onAction}
      onAddComponent={onAddComponent}
      onRemoveComponent={onRemoveComponent}
      opacity={opacity}
    >
      <ReactKonva.Circle
        x={position.x}
        y={position.y}
        offsetX={0}
        offsetY={0}
        radius={backplateRadius}
        fill={backgroundColor}
        stroke={borderColor}
        strokeWidth={borderWidth}
      />
      {icon && (
        <UrlImage
          src={icon}
          x={position.x + offset.x}
          y={position.y + offset.y}
          width={radius}
          height={radius}
        />
      )}
    </GroupWithHOCs>
  );
};

export default LineIcon;
