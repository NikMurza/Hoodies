import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';
import * as defaults from '@common/components/lib/canvas/visual-editor/defaults';
import Input from '../input';

describe('Input component', () => {
  it('renders correctly', () => {
    const id = 'table1';
    const x = 100;
    const y = 100;
    const text = 'table1';
    const textColor = '#000';

    const props = {
      onComplete: jest.fn(),
      onCancel: jest.fn,
    };

    const onCompleteSpy = jest.spyOn(props, 'onComplete');
    const onCancelSpy = jest.spyOn(props, 'onCancel');

    const wrapper = shallow(
      <Input
        key={id}
        id={id}
        text={text}
        x={x}
        y={y}
        onComplete={props.onComplete}
        onCancel={props.onCancel}
        textColor={textColor}
      />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();

    const input = wrapper.find('input');

    input.simulate('keydown', { key: 'Enter' });
    expect(onCompleteSpy).toBeCalledWith(text);

    input.simulate('keydown', { key: 'Escape' });
    expect(onCancelSpy).toBeCalled();
  });

  it('Input defaultProps', () => {
    expect(JSON.stringify(Input.defaultProps)).toEqual(
      JSON.stringify({
        width: defaults.element.editInputWidth,
        height: defaults.element.editInputHeight,
        onComplete: (): void => undefined,
        onCancel: (): void => undefined,
      }),
    );
  });
});
