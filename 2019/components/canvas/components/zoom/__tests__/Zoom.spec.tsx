import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';
import { Zoom, ZoomProps, DisplayType } from '@common/components/lib/canvas/components/zoom/Zoom';

describe('Zoom component', () => {
  it('renders correctly - type Controls', () => {
    const x = 10;
    const y = 20;
    const onChange = jest.fn();

    const props: ZoomProps = {
      zoom: 1,
      position: {
        x,
        y,
      },
      onChange,
      t: jest.fn(),
      i18n: null,
      tReady: true,
    };

    const onChangeSpy = jest.spyOn(props, 'onChange');

    const wrapper = shallow(<Zoom {...props} />);

    expect(toJson(wrapper)).toMatchSnapshot();

    const buttons = wrapper.find('Button');
    buttons.get(0).props.onClick();
    expect(onChangeSpy).toBeCalledWith(1.1);

    onChangeSpy.mockClear();

    buttons.get(1).props.onClick();
    expect(onChangeSpy).toBeCalledWith(0.9);
  });

  it('renders correctly - type ValueButton', () => {
    const x = 10;
    const y = 20;
    const onChange = jest.fn();

    const props: ZoomProps = {
      zoom: 1,
      position: {
        x,
        y,
      },
      onChange,
      t: jest.fn(),
      i18n: null,
      tReady: true,
      displayType: DisplayType.ValueButton,
      min: 0.25,
      max: 2,
      step: 0.03,
      container: document.querySelector('div'),
    };

    const wrapper = shallow(<Zoom {...props} />);

    expect(toJson(wrapper)).toMatchSnapshot();

    const valueButtonWrapper = wrapper.find('.visual-editor__zoom__value-button');
    valueButtonWrapper.simulate('wheel', { deltaY: 1 });
    expect(props.onChange).toHaveBeenCalledWith(0.97);

    valueButtonWrapper.simulate('wheel', { deltaY: -1 });
    expect(props.onChange).toHaveBeenCalledWith(1.03);

    const button = wrapper.find('Button');
    button.simulate('click');
    expect(props.onChange).toHaveBeenCalledWith(1);
  });
});
