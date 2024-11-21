import * as React from 'react';
import { Group, Line, Rect, Text } from 'react-konva';
import colors from '@common/styles/constants/colors';
import fonts from '@common/styles/constants/fonts';
import UrlImage from '@common/components/lib/canvas/shapes/url-image/UrlImage';

const menuFont = {
  text: 15,
};

export interface ICanvasMenuItem {
  text?: string;
  icon?: string;
  items?: ICanvasMenuItem[];
  object?: any;
}

interface IProps {
  onClick?: (level: number, index: number, item: ICanvasMenuItem) => void;
  index?: number;
  offsetX?: number;
  offsetY?: number;
  level?: number;
  item?: ICanvasMenuItem;
  activeItems?: number[];
}

class MenuItem extends React.PureComponent<IProps> {
  public static defaultProps: IProps = {
    offsetX: 0,
    offsetY: 0,
    item: {
      items: [],
    },
  };

  private onClick = () => {
    const { item, index, level, onClick } = this.props;
    onClick(level, index, item);
  };

  private onHover = (event) => {
    const shape = event.target;
    if (shape.getClassName() === 'Rect') {
      const children = shape.getParent().getChildren();
      children[1].setFill(colors.hover);
      document.body.style.cursor = 'pointer';
      event.target.getLayer().draw();
    }
  };

  private onMouseOut = (event) => {
    const shape = event.target;
    if (shape.getClassName() === 'Rect') {
      const children = shape.getParent().getChildren();
      children[1].setFill(colors.white);
      document.body.style.cursor = 'default';
      event.target.getLayer().draw();
    }
  };

  public render() {
    const { item, index, level, activeItems, onClick, offsetY, offsetX } = this.props;
    const holderWidth = 235;
    const holderHeight = 40;
    const itemWidth = 235;
    const itemHeight = 40;
    return (
      <Group key={`lvl${level}_${index}`}>
        <Group
          x={level * holderWidth + offsetX}
          y={holderHeight * index + offsetY}
          onClick={this.onClick}
          onmousemove={this.onHover}
          onmouseleave={this.onMouseOut}
        >
          <Rect
            x={0}
            y={0}
            width={holderWidth}
            height={holderHeight}
            fill={colors.white}
            cornerRadius={2}
          />

          <Rect
            x={0}
            y={0}
            width={itemWidth}
            height={itemHeight}
            fill={colors.white}
            stroke={colors.transparent}
            cornerRadius={2}
            shadowColor={colors.shadowColor}
            shadowOffsetY={3}
            shadowBlur={4}
          />

          <UrlImage src={item.icon} x={14} y={10} />

          <Text
            text={item.text}
            x={50}
            y={15}
            fill={colors.text}
            fontSize={menuFont.text}
            fontFamily={fonts.family}
          />
          {item.items && (
            <Line points={[215, 16, 221, 22, 215, 28]} stroke={colors.lightBlue} strokeWidth={2} />
          )}
        </Group>
        {activeItems[level] === index &&
          item.items.map((subItem, subIndex) => (
            <MenuItem
              index={subIndex}
              offsetX={1}
              offsetY={index * holderHeight}
              level={level + 1}
              key={subIndex}
              item={subItem}
              activeItems={activeItems}
              onClick={onClick}
            />
          ))}
      </Group>
    );
  }
}

export default MenuItem;
