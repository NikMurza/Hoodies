import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';
import { VisualEditorActions } from '@common/components/lib/types/visual-editor';
import WithDrag from '../WithDrag';

const props = {
  id: 'id1',
  radius: 100,
  draggable: true,
  onAction: jest.fn,
};

describe('WithDrag HOC', () => {
  it('renders correctly', () => {
    const HOC = WithDrag(() => <div />);
    const wrapper = shallow(<HOC {...props} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('onDragEnd works correctly', () => {
    const x = 100;
    const y = 100;
    const width = 100;
    const height = 100;

    const e = {
      target: {
        attrs: {
          id: props.id,
        },
        x: () => x,
        y: () => y,
        width: () => width,
        height: () => height,
      },
    };

    const onActionSpy = jest.spyOn(props, 'onAction');
    const getXSpy = jest.spyOn(e.target, 'x');
    const getYSpy = jest.spyOn(e.target, 'y');

    const HOC = WithDrag(() => <div />);
    const wrapper = shallow(<HOC {...props} />);
    wrapper.simulate('dragstart');
    wrapper.simulate('dragend', e);
    expect(getXSpy).toBeCalled();
    expect(getYSpy).toBeCalled();
    expect(onActionSpy).toBeCalledWith(VisualEditorActions.DragEnd, {
      id: props.id,
      x,
      y,
      width,
      height,
    });
  });
});
