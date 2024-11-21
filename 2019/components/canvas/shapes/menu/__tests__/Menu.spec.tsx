import * as React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Menu from '../Menu';

describe('CanvasMenu component', () => {
  it('render default', async () => {
    expect(
      toJson(
        shallow(
          <Menu
            isVisible
            position={[100, 200]}
            menu={[
              {
                text: 'menu1',
                items: [
                  {
                    text: 'Menu2',
                  },
                ],
              },
            ]}
          />,
        ),
      ),
    ).toMatchSnapshot();
  });

  it('_handleLeaveMenu', async () => {
    const onLeaveHandler = jest.fn();
    const wrapper = shallow(
      <Menu
        isVisible
        position={[100, 200]}
        menu={[
          {
            text: 'menu1',
            items: [
              {
                text: 'Menu2',
              },
            ],
          },
        ]}
        onLeave={onLeaveHandler}
      />,
    );
    wrapper.setState({ activeItems: [0, 1] });
    wrapper.find('Group').get(0).props.onmouseleave();
    expect(wrapper.state('activeItems')).toEqual([]);
    expect(onLeaveHandler).toHaveBeenCalled();
  });

  it('_handleActivateItem case empty item', async () => {
    const wrapper = shallow(
      <Menu
        isVisible
        position={[100, 200]}
        menu={[
          {
            text: 'menu1',
            items: [
              {
                text: 'Menu2',
              },
            ],
          },
        ]}
      />,
    );
    wrapper.setState({ activeItems: [0, 1] });
    wrapper.find('MenuItem').get(0).props.onClick(1, 0, {});
    expect(wrapper.state('activeItems')).toEqual([0]);
  });

  it('_handleActivateItem case item has nested items', async () => {
    const wrapper = shallow(
      <Menu
        isVisible
        position={[100, 200]}
        menu={[
          {
            text: 'menu1',
            items: [
              {
                text: 'Menu2',
              },
            ],
          },
        ]}
      />,
    );
    wrapper.setState({ activeItems: [0] });
    wrapper
      .find('MenuItem')
      .get(0)
      .props.onClick(0, 5, { items: [{}, {}] });
    expect(wrapper.state('activeItems')).toEqual([5]);
  });

  it('_handleActivateItem case item has object', async () => {
    const onClickItem = jest.fn();
    const wrapper = shallow(
      <Menu
        isVisible
        position={[100, 200]}
        menu={[
          {
            text: 'menu1',
            items: [
              {
                text: 'Menu2',
              },
            ],
          },
        ]}
        onClickItem={onClickItem}
      />,
    );
    wrapper.setState({ activeItems: [0] });
    wrapper.find('MenuItem').get(0).props.onClick(0, 0, { object: {} });
    expect(onClickItem).toHaveBeenCalled();
    expect(wrapper.state('activeItems')).toEqual([]);
  });
});
