import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';
import { ContextMenuItem, VisualEditorActions } from '@common/components/lib/types/visual-editor';
import ContextMenu from '../ContextMenu';

describe('ContextMenu component', () => {
  it('renders correctly', () => {
    const items: ContextMenuItem[] = [
      {
        icon: '',
        name: 'Edit',
        action: VisualEditorActions.Edit,
      },
      {
        icon: '',
        name: 'Delete',
        action: VisualEditorActions.Delete,
      },
    ];

    const wrapper = shallow(
      <ContextMenu id="ctx" x={100} y={100} items={items} />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
