import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';
import {
  VisualEditorActions,
  VisualEditorShapeType,
} from '@common/components/lib/types/visual-editor';
import { WithHover, WithHoverProps } from '../WithHover';

const onMouseEnter = jest.fn();
const onMouseLeave = jest.fn();

const props: WithHoverProps = {
  id: 'id1',
  type: VisualEditorShapeType.Circle,
  onAction: jest.fn,
  onMouseEnter,
  onMouseLeave,
};

describe('WithHover HOC', () => {
  it('renders correctly', () => {
    const HOC = WithHover(() => <div />);
    const wrapper = shallow(<HOC {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('works correctly', () => {
    const onActionSpy = spyOn(props, 'onAction');
    const HOC = WithHover(() => <div />);
    const wrapper = shallow(<HOC {...props} />);

    wrapper.simulate('mouseleave');
    expect(onMouseLeave).toHaveBeenCalled();
    expect(onActionSpy).toBeCalledWith(VisualEditorActions.Hover, {
      id: '',
      type: VisualEditorShapeType.Circle,
    });

    wrapper.simulate('mouseenter');
    expect(onMouseEnter).toHaveBeenCalled();
    expect(onActionSpy).toBeCalledWith(VisualEditorActions.Hover, {
      id: 'id1',
      type: VisualEditorShapeType.Circle,
    });
  });
});
