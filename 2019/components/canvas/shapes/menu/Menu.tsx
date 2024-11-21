import * as React from 'react';
import { Group, Layer } from 'react-konva';
import MenuItem, { ICanvasMenuItem } from './MenuItem';

export interface ICanvasMenuProps {
  isVisible?: boolean;
  menu?: ICanvasMenuItem[];
  onClickItem?: (item: ICanvasMenuItem) => void;
  onLeave?: () => void;
  position?: number[];
}

interface IState {
  activeItems: number[];
}

export class Menu extends React.Component<ICanvasMenuProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      activeItems: [],
    };
  }

  /**
   * Рисуем уровни меню
   * @private
   */
  private getItems = () => {
    const { menu } = this.props;
    const { activeItems } = this.state;
    return menu.map((item, subIndex) => (
      <MenuItem
        index={subIndex}
        level={0}
        key={subIndex}
        item={item}
        activeItems={activeItems}
        onClick={this.handleActivateItem}
      />
    ));
  };

  private handleLeaveMenu = () => {
    this.setState({ activeItems: [] });
    this.props.onLeave();
  };

  private handleActivateItem = (level: number, index: number, item: ICanvasMenuItem) => {
    const { onClickItem } = this.props;
    const { activeItems } = this.state;
    const active = activeItems.slice(0, level);
    if (item.items) {
      active[level] = index;
    } else if (item.object) {
      onClickItem(item);
    }
    this.setState({ activeItems: active });
  };

  public render() {
    const { isVisible, position } = this.props;
    // если есть позиция то рисуем меню
    return (
      isVisible &&
      position && (
        <Layer>
          <Group x={position[0]} y={position[1]} onmouseleave={this.handleLeaveMenu}>
            {this.getItems()}
          </Group>
        </Layer>
      )
    );
  }
}

export default Menu;
