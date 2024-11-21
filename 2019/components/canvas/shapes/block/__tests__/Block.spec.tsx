import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';
import Block, { createBlock } from '../Block';

describe('Block component', () => {
  const onAction = jest.fn();
  const props = {
    id: 'id1',
    x: 1,
    y: 2,
    width: 3,
    height: 4,
    contextMenuItems: [],
    draggable: true,
    theme: {
      borderWidth: 0,
      borderColor: "red",
      backgroundColor: "green",
    },
    onAction,
  }

  it('renders correctly', () => {

    const wrapper = shallow(
      <Block {...props} />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('createBlock correctly', () => {
    expect(createBlock(props)).toEqual({
      borderRadius: 0,
      contextMenuItems: [],
      draggable: true,
      extension: null,
      height: 4,
      id: "id1",
      onAction,
      theme: {
        backgroundColor: "green",
        borderColor: "red",
        borderWidth: 0
      },
      type: "block",
      width: 3,
      x: 1,
      y: 2
    });
  });
});
