import { VisualEditorShapeType, VisualEditorTheme } from '@common/components/lib/types/visual-editor';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';
import LineIcon, { LineIconProps } from '../LineIcon';

describe('LineIcon component', () => {
  const onAction = jest.fn();
  const onAddComponent = jest.fn();
  const onRemoveComponent = jest.fn();

  const theme: VisualEditorTheme = {
    opacity: 1,
    backgroundColor: "blue",
    borderColor: "red",
    borderWidth: 2,
  };

  const props: LineIconProps = {
    id: 'LineIcon1',
    type: VisualEditorShapeType.Block,
    position: {x: 1, y: 2},
    icon: 'some-icon.svg',
    radius: 16,
    backplateRadius: 16,
    backplateTheme: theme,
    isContextMenuShow: false,
    contextMenuItems: [],
    onAction: {onAction},
    onAddComponent: {onAddComponent},
    onRemoveComponent: {onRemoveComponent},
    iconRadius: 32,
    iconBackplateRadius: 32,
    iconBackplateTheme: {
      backgroundColor: "white",
      borderColor: "black",
      borderWidth: 2,
      opacity: 1,
    },
  }

  it('renders correctly', () => {

    const wrapper = shallow(
      <LineIcon {...props} />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
