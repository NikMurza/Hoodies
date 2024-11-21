import { MouseButtons } from '@common/components/lib/types/mouseEvent';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';
import * as ReactKonva from 'react-konva';
import { VisualEditorPanType } from '@common/components/lib/types/visual-editor';
import WithPan, { WithPanProps } from '../WithPan';

jest.mock('@common/components/lib/canvas/hooks/useIsStage', () => ({
  useIsStage: () => () => true,
}));

jest.mock('react', () => {
  const originReact = jest.requireActual('react');
  const useRefMock = jest.fn();
  useRefMock.mockImplementation(() => ({
    current: {
      scrollTop: 30,
      scrollLeft: 20,
    },
  }));
  return {
    ...originReact,
    useRef: useRefMock,
  };
});

const stageRef = React.useRef<ReactKonva.Stage>(null);
const scrollableRef = React.useRef<HTMLDivElement>(null);

const props: WithPanProps = {
  x: 1,
  y: 1,
  onAction: jest.fn,
};

const onActionSpy = jest.spyOn(props, 'onAction');

describe('WithHover HOC', () => {
  describe('canvas', () => {
    const HOC = WithPan(() => (
      <div ref={scrollableRef}>
        <ReactKonva.Stage ref={stageRef} />
      </div>
    ));

    it('renders correctly', () => {
      const wrapper = shallow(
        <HOC {...props} />);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('works correctly', () => {
      const wrapper = shallow(<HOC {...props} />);

      wrapper.simulate('mousedown', {
        evt: {
          button: MouseButtons.Left,
          screenX: 5,
          screenY: 15,
        },
      });
      wrapper.simulate('mousemove', {
        evt: {
          screenX: 25,
          screenY: 20,
        },
      });
      wrapper.simulate('mouseup');
    });
  });

  describe('other HTML-elements', () => {
    const onMouseDown = jest.fn();
    const onMouseMove = jest.fn();
    const onMouseUp = jest.fn();
    const eventHandlerProps = {
      onMouseDown,
      onMouseMove,
      onMouseUp,
    };
    const HOC = WithPan((props) => <div {...props}>{props.children}</div>);
    const wrapper = shallow(
      <HOC {...props}
           type={VisualEditorPanType.Common}
          className="with-pan"
          {...eventHandlerProps}
      >
        <div>Some content</div>
      </HOC>,
    );
    it('renders correctly with div-child', () => {
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('works correctly with div-child', () => {
      wrapper.simulate('mousedown', {
        button: MouseButtons.Left,
        screenX: 5,
        screenY: 15,
      });
      wrapper.simulate('mousemove', {
        screenX: 25,
        screenY: 20,
      });
      wrapper.simulate('mouseup');

      expect(onMouseDown).toHaveBeenCalled();
      expect(onMouseMove).toHaveBeenCalled();
      expect(onMouseUp).toHaveBeenCalled();
    });
  });
});
