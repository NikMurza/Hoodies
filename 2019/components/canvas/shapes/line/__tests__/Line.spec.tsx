import {
  VisualEditorCurveType,
  VisualEditorEndpointType,
  VisualEditorTheme,
} from '@common/components/lib/types/visual-editor';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';
import Line, { createLine, LineProps } from '../Line';

describe('Line component', () => {
  const onAction = jest.fn();

  const theme: VisualEditorTheme = {
    opacity: 1,
    backgroundColor: 'blue',
    borderColor: 'red',
    borderWidth: 2,
  };

  const props: LineProps = {
    id: 'Line 1',
    extension: null,
    contextMenuItems: [],
    onAction,
    style: {
      theme,
      curve: VisualEditorCurveType.Bezier,
    },
    from: {
      location: {
        x: 0,
        y: 1,
        width: 2,
        height: 3,
      },
      style: {
        type: VisualEditorEndpointType.Circle,
        theme,
      },
    },
    to: {
      location: {
        x: 4,
        y: 5,
        width: 6,
        height: 7,
      },
      style: {
        type: VisualEditorEndpointType.Arrow,
        theme,
      },
    },
    icon: require('@common/components/lib/assets/images/actions/settings.svg'),
    iconRadius: 32,
    iconBackplateRadius: 32,
    iconBackplateTheme: {
      backgroundColor: 'white',
      borderColor: 'black',
      borderWidth: 2,
      opacity: 1,
    },
  };

  it('renders correctly', () => {
    const wrapper = shallow(<Line {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('renders correctly without icon', () => {
    const props2 = { ...props, icon: null };

    const wrapper = shallow(<Line {...props2} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('createLine correctly', () => {
    expect(createLine(props)).toEqual({
      contextMenuItems: [],
      extension: null,
      from: {
        location: {
          height: 3,
          width: 2,
          x: 0,
          y: 1,
        },
        style: {
          theme,
          type: 'Circle',
        },
      },
      icon: 'test-file-stub',
      iconBackplateRadius: 32,
      iconBackplateTheme: {
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 2,
        opacity: 1,
      },
      iconRadius: 32,
      id: 'Line 1',
      onAction,
      style: {
        curve: 'Bezier',
        theme,
      },
      to: {
        location: {
          height: 7,
          width: 6,
          x: 4,
          y: 5,
        },
        style: {
          theme,
          type: 'Arrow',
        },
      },
      type: 'line',
    });
  });
});
