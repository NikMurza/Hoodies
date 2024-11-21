import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';
import {
  VisualEditorActions,
  VisualEditorCircle,
  VisualEditorShapeType,
} from '../../../types/visual-editor';
import VisualEditor from '../VisualEditor';

const spyOnUseEffect = jest.spyOn(React, 'useEffect');

describe('VisualEditor component', () => {
  it('renders empty correctly', () => {
    expect(
      toJson(shallow(<VisualEditor onAction={jest.fn} />)),
    ).toMatchSnapshot();
  });

  it('renders with items correctly', () => {
    const items = [
      { type: VisualEditorShapeType.Block, id: 'table1', x: 100, y: 100 },
      { type: VisualEditorShapeType.Block, id: 'table2', x: 200, y: 200 },
    ];

    expect(
      toJson(shallow(<VisualEditor items={items} onAction={jest.fn} width={1000} height={1000} />)),
    ).toMatchSnapshot();
  });

  it('renders with circles correctly', () => {
    const items: VisualEditorCircle[] = [
      {
        type: VisualEditorShapeType.Circle,
        id: 'table1',
        x: 100,
        y: 100,
        radius: 100,
        text: 'table1',
      },
      {
        type: VisualEditorShapeType.Circle,
        id: 'table2',
        x: 200,
        y: 200,
        radius: 100,
        text: 'table2',
      },
    ];

    const props = {
      onAction: jest.fn,
    };

    const onActionSpy = jest.spyOn(props, 'onAction');

    const wrapper = shallow(
      <VisualEditor items={items} onAction={props.onAction} />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('renders with items correctly and without Pan', () => {
    const items = [
      { type: VisualEditorShapeType.Block, id: 'table1', x: 100, y: 100 },
      { type: VisualEditorShapeType.Block, id: 'table2', x: 200, y: 200 },
    ];

    expect(
      toJson(
        shallow(
          <VisualEditor
            items={items}
            onAction={jest.fn}
            panEnabled={false}
          />,
        ),
      ),
    ).toMatchSnapshot();
  });

  it('VisualEditor defaultProps', () => {
    expect(JSON.stringify(VisualEditor.defaultProps)).toEqual(
      JSON.stringify({
        id: 'VisualEditor',
        items: [],
        panEnabled: true,
        onAction: (): void => undefined,
      }),
    );

    expect(VisualEditor.defaultProps.onAction(VisualEditorActions.Hover, null)).toEqual(
      JSON.stringify(undefined),
    );
  });
});
