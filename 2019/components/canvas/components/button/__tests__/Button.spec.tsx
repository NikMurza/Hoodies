import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';
import Button, { ButtonType } from '../Button';

describe('Button', () => {
  const onClick = jest.fn();
  const props = {
    onClick,
    type: ButtonType.Chart,
    isActive: true,
  };
  const wrapper = shallow(<Button {...props} />);

  it('renders correctly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('click', () => {
    const button = wrapper.find('Button');
    button.simulate('click');
    expect(onClick).toHaveBeenCalledWith(props.type);
  });
});
