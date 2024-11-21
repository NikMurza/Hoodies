import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';
import {
  VisualEditorActions,
  ContextMenuItem,
  VisualEditorShapeType,
} from '@common/components/lib/types/visual-editor';
import { WithContextMenu, typeContextMenuId } from '../WithContextMenu';

const props = {
  id: 'id1',
  isContextMenuShow: true,
  items: [
    {
      icon: '',
      name: 'Rename',
      action: VisualEditorActions.Edit,
    },
    {
      icon: '',
      name: 'Delete',
      action: VisualEditorActions.Delete,
    },
  ],
  onAction: jest.fn,
  onAddComponent: jest.fn,
  onRemoveComponent: jest.fn,
  onContextMenu: jest.fn,
};

describe('WithContextMenu HOC', () => {
  it('renders correctly', () => {
    const onActionSpy = spyOn(props, 'onAction');

    const HOC = WithContextMenu(() => <div />);
    const wrapper = shallow(<HOC type={VisualEditorShapeType.Circle} {...props} />);

    expect(toJson(wrapper)).toMatchSnapshot();

    wrapper.simulate('contextmenu', {
      evt: {
        preventDefault: jest.fn,
        offsetX: 100,
        offsetY: 100,
      },
    });
    expect(onActionSpy).toBeCalledWith(VisualEditorActions.ContextMenu, {
      contextMenuId: 'context_menu_circle_id1',
    });
  });

  it('renders correctly show', () => {
    const onActionSpy = spyOn(props, 'onAction');

    const HOC = WithContextMenu(() => <div />);
    const wrapper = shallow(
      <HOC type={VisualEditorShapeType.Circle} {...props} isContextMenuShow />,
    );

    expect(toJson(wrapper)).toMatchSnapshot();

    wrapper.simulate('contextmenu', {
      evt: {
        preventDefault: jest.fn,
        offsetX: 100,
        offsetY: 100,
      },
    });
    expect(onActionSpy).toBeCalledWith(VisualEditorActions.ContextMenu, {
      contextMenuId: 'context_menu_circle_id1',
    });
  });

  it('renders correctly hidden', () => {
    const onActionSpy = spyOn(props, 'onAction');

    const HOC = WithContextMenu(() => <div />);
    const wrapper = shallow(
      <HOC type={VisualEditorShapeType.Circle} {...props} isContextMenuShow={false} />,
    );

    expect(toJson(wrapper)).toMatchSnapshot();

    wrapper.simulate('contextmenu', {
      evt: {
        preventDefault: jest.fn,
        offsetX: 100,
        offsetY: 100,
      },
    });
    expect(onActionSpy).toBeCalledWith(VisualEditorActions.ContextMenu, {
      contextMenuId: 'context_menu_circle_id1',
    });
  });

  it('typeContextMenuId', () => {
    expect(typeContextMenuId('test', VisualEditorShapeType.Circle)).toEqual(
      'context_menu_circle_test',
    );
  });
});
