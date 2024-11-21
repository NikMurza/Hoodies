import * as React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import colors from '@common/styles/constants/colors';
import MenuItem from '../MenuItem';

describe('MenuItem component', () => {
  it('render default', async () => {
    expect(
      toJson(
        shallow(
          <MenuItem
            index={1}
            offsetY={1}
            level={1}
            item={{
              text: 'menu1',
              items: [
                {
                  text: 'Menu2',
                },
              ],
            }}
            activeItems={[]}
          />,
        ),
      ),
    ).toMatchSnapshot();
  });

  it('render select', async () => {
    expect(
      toJson(
        shallow(
          <MenuItem
            index={1}
            offsetY={1}
            level={0}
            item={{
              text: 'menu1',
              items: [
                {
                  text: 'Menu2',
                },
              ],
            }}
            activeItems={[1]}
          />,
        ),
      ),
    ).toMatchSnapshot();
  });

  it('_onClick', async () => {
    const onClick = jest.fn();
    const wrapper = shallow(
      <MenuItem
        index={1}
        offsetY={1}
        level={1}
        item={{
          text: 'menu1',
          items: [
            {
              text: 'Menu2',
            },
          ],
        }}
        activeItems={[]}
        onClick={onClick}
      />,
    );
    wrapper.find('Group').get(1).props.onClick();
    expect(onClick).toHaveBeenCalled();
  });

  it('_onHover not rect', async () => {
    const getParent = jest.fn();
    const wrapper = shallow(
      <MenuItem
        index={1}
        offsetY={1}
        level={1}
        item={{
          text: 'menu1',
          items: [
            {
              text: 'Menu2',
            },
          ],
        }}
        activeItems={[]}
      />,
    );
    wrapper
      .find('Group')
      .get(1)
      .props.onmousemove({
        target: {
          getClassName: () => 'not Rect',
          getParent,
        },
      });
    expect(getParent).not.toHaveBeenCalled();
  });

  it('_onHover rect without Line', async () => {
    const setStroke = jest.fn();
    const setFill = jest.fn();
    const draw = jest.fn();
    const wrapper = shallow(
      <MenuItem
        index={1}
        offsetY={1}
        level={1}
        item={{
          text: 'menu1',
          items: [
            {
              text: 'Menu2',
            },
          ],
        }}
        activeItems={[]}
      />,
    );
    wrapper
      .find('Group')
      .get(1)
      .props.onmousemove({
        target: {
          getClassName: () => 'Rect',
          getParent: () => ({
            getChildren: () => [
              {},
              {
                setFill,
              },
            ],
          }),
          getLayer: () => ({
            draw,
          }),
        },
      });

    expect(setFill).toHaveBeenCalledWith(colors.hover);
    expect(draw).toHaveBeenCalled();
    expect(document.body.style.cursor).toEqual('pointer');
  });

  it('_onHover rect with Line', async () => {
    const setStroke1 = jest.fn();
    const setFill = jest.fn();
    const draw = jest.fn();
    const setStroke3 = jest.fn();
    const wrapper = shallow(
      <MenuItem
        index={1}
        offsetY={1}
        level={1}
        item={{
          text: 'menu1',
          items: [
            {
              text: 'Menu2',
            },
          ],
        }}
        activeItems={[]}
      />,
    );
    wrapper
      .find('Group')
      .get(1)
      .props.onmousemove({
        target: {
          getClassName: () => 'Rect',
          getParent: () => ({
            getChildren: () => [
              {},
              {
                setFill,
              },
            ],
          }),
          getLayer: () => ({
            draw,
          }),
        },
      });

    expect(setFill).toHaveBeenCalledWith(colors.hover);
    expect(draw).toHaveBeenCalled();
    expect(document.body.style.cursor).toEqual('pointer');
  });

  it('_onMouseOut not rect', async () => {
    const getParent = jest.fn();
    const wrapper = shallow(
      <MenuItem
        index={1}
        offsetY={1}
        level={1}
        item={{
          text: 'menu1',
          items: [
            {
              text: 'Menu2',
            },
          ],
        }}
        activeItems={[]}
      />,
    );
    wrapper
      .find('Group')
      .get(1)
      .props.onmouseleave({
        target: {
          getClassName: () => 'not Rect',
          getParent,
        },
      });
    expect(getParent).not.toHaveBeenCalled();
  });

  it('_onMouseOut rect without Line', async () => {
    const setStroke = jest.fn();
    const setFill = jest.fn();
    const draw = jest.fn();
    const wrapper = shallow(
      <MenuItem
        index={1}
        offsetY={1}
        level={1}
        item={{
          text: 'menu1',
          items: [
            {
              text: 'Menu2',
            },
          ],
        }}
        activeItems={[]}
      />,
    );
    wrapper
      .find('Group')
      .get(1)
      .props.onmouseleave({
        target: {
          getClassName: () => 'Rect',
          getParent: () => ({
            getChildren: () => [
              {},
              {
                setFill,
              },
            ],
          }),
          getLayer: () => ({
            draw,
          }),
        },
      });

    expect(setFill).toHaveBeenCalledWith(colors.white);
    expect(draw).toHaveBeenCalled();
    expect(document.body.style.cursor).toEqual('default');
  });
});
