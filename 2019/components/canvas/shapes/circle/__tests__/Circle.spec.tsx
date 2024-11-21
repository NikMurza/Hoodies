import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';
import * as defaults from '@common/components/lib/canvas/visual-editor/defaults';
import * as color from '@common/styles/constants/colors';
import Circle, { createCircle } from '../Circle';
import { VisualEditorShapeType, VisualEditorActions } from '../../../../types/visual-editor';

describe('Circle component', () => {
  it('renders correctly', () => {
    const type = VisualEditorShapeType.Circle;
    const id = 'table1';
    const x = 100;
    const y = 100;
    const radius = 100;

    const props = {
      onAction: jest.fn,
    };

    const onActionSpy = jest.spyOn(props, 'onAction');

    const wrapper = shallow(
      <Circle id={id} radius={radius} type={type} x={x} y={y} onAction={props.onAction} />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.simulate('action');
    expect(onActionSpy).toBeCalled();
  });

  it('createCircle works correctly', () => {
    const id = 'table1';
    expect(createCircle({ id, text: id, onAction: jest.fn })).toEqual({
      type: VisualEditorShapeType.Circle,
      id,
      text: id,
      backgroundColor: defaults.colors.circleBackgroundColor,
      borderColor: defaults.colors.circleBorderColor,
      textColor: color.default.white,
      radius: defaults.element.radius,
      x: undefined,
      y: undefined,
      contextMenuItems: [],
      onAction: jest.fn,
      extension: null,
    });
  });

  it('Circle defaultProps', () => {
    expect(JSON.stringify(Circle.defaultProps)).toEqual(
      JSON.stringify({
        ...createCircle(),
        onAddComponent: () => (): void => undefined,
        onRemoveComponent: () => (): void => undefined,
      }),
    );

    expect(Circle.defaultProps.onAction(VisualEditorActions.Add, {})).toEqual(undefined);
    expect(JSON.stringify(Circle.defaultProps.onAddComponent)).toEqual(undefined);
    expect(JSON.stringify(Circle.defaultProps.onRemoveComponent)).toEqual(undefined);
  });

  it('createCircle ext FC works correctly', () => {
    const id = 'table1';
    const Ext1: React.FC = (): JSX.Element => {
      return <div>test extension 1</div>;
    };

    expect(createCircle({ id, text: id, onAction: jest.fn, extension: Ext1 })).toEqual({
      type: VisualEditorShapeType.Circle,
      id,
      text: id,
      backgroundColor: defaults.colors.circleBackgroundColor,
      borderColor: defaults.colors.circleBorderColor,
      textColor: color.default.white,
      radius: defaults.element.radius,
      x: undefined,
      y: undefined,
      contextMenuItems: [],
      onAction: jest.fn,
      extension: Ext1,
    });
  });

  it('createCircle ext Component works correctly', () => {
    const id = 'table1';
    class Ext2 extends React.Component {
      render() {
        return <div>test extension 2</div>;
      }
    }

    expect(createCircle({ id, text: id, onAction: jest.fn, extension: Ext2 })).toEqual({
      type: VisualEditorShapeType.Circle,
      id,
      text: id,
      backgroundColor: defaults.colors.circleBackgroundColor,
      borderColor: defaults.colors.circleBorderColor,
      textColor: color.default.white,
      radius: defaults.element.radius,
      x: undefined,
      y: undefined,
      contextMenuItems: [],
      onAction: jest.fn,
      extension: Ext2,
    });
  });
});
