import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';
import * as defaults from '@common/components/lib/canvas/visual-editor/defaults';
import Konva from 'konva';
import * as ReactKonva from 'react-konva';
import ReferencePoints from '../ReferencePoints';
import { VisualEditorActions } from '../../../../types/visual-editor';

describe('Reference points component', () => {
  const onAction = jest.fn();
  const props = {
    radius: defaults.element.referencePointRadius,
    onAction,
    id: '1',
  };
  it('renders correctly', () => {
    const e = {
      target: {
        setAttrs: (config: any) => {},
        draw: () => {},
      },
    };

    const setAttrsSpy = jest.spyOn(e.target, 'setAttrs');
    const drawSpy = jest.spyOn(e.target, 'draw');

    const wrapper = shallow(<ReferencePoints {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();

    const circle = wrapper.find(ReactKonva.Circle).first();
    circle.props().onMouseOver(e as Konva.KonvaEventObject<MouseEvent>);

    expect(setAttrsSpy).toBeCalledWith({
      fill: defaults.colors.referencePointsHoverColor,
    });
    expect(drawSpy).toBeCalled();

    expect(toJson(circle)).toMatchSnapshot();
  });

  it('ReferencePoints defaultProps', () => {
    expect(JSON.stringify(ReferencePoints.defaultProps)).toEqual(
      JSON.stringify({
        onAction: (): void => undefined,
        id: '',
      }),
    );

    expect(ReferencePoints.defaultProps.onAction(VisualEditorActions.Add, {})).toEqual(undefined);
  });
});
