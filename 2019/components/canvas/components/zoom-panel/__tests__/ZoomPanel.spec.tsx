import * as React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ToolbarMock from '@common/components/lib/rich/toolbar/Toolbar';
import { VisualEditorActions } from '@common/components/lib/types/visual-editor';
import { ZoomPanel, EZoomPanelItems, ZoomTo } from '../ZoomPanel';

jest.mock('@common/components/lib/rich/toolbar/Toolbar', () => ({
  default: function ToolbarMock() { return <div /> },
}));

describe('ZoomPanel component', () => {
  const props = {
    i18n: null,
    t: jest.fn((t) => t),
    tReady: true,

    haveItems: false,
    haveSelectedItem: false,
    zoom: 1,
    onAction: jest.fn(),
  };

  it('renders', () => {
    const component = shallow(<ZoomPanel {...props} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  describe('title of scale button', () => {
    it('no title on zoom 100%', () => {
      const component = shallow(<ZoomPanel {...props} zoom={1} />);
      const rightItems = component.find(ToolbarMock).prop('rightItems');
      expect(rightItems[0].title).toBeUndefined();
    });
    it('title on zoom not 100%', () => {
      const component = shallow(<ZoomPanel {...props} zoom={100500} />);
      const rightItems = component.find(ToolbarMock).prop('rightItems');
      expect(rightItems[0].title).toEqual('BackToDefault');
    });
  });

  describe('triggering onAction callback', () => {
    describe('via buttons on panel', () => {
      const onAction = jest.fn();
      const zoomStepByButtons = 0.5;
      const component = mount(<ZoomPanel {...props} onAction={onAction} zoomStepByButtons={zoomStepByButtons} />);
      const handleToolbarClick = component.find(ToolbarMock).prop('onClick');

      beforeEach(() => {
        onAction.mockRestore();
      })

      it('fitAll', () => {
        handleToolbarClick(null, EZoomPanelItems.FitAll);
        expect(onAction).toBeCalledWith(VisualEditorActions.Zoom, ZoomTo.All);
      });

      it('fitSelected', () => {
        handleToolbarClick(null, EZoomPanelItems.FitObject);
        expect(onAction).toBeCalledWith(VisualEditorActions.Zoom, ZoomTo.Selected);
      });

      it('plus', () => {
        handleToolbarClick(null, EZoomPanelItems.Plus);
        expect(onAction).toBeCalledWith(VisualEditorActions.Zoom, props.zoom + zoomStepByButtons);
      });

      it('minus', () => {
        handleToolbarClick(null, EZoomPanelItems.Minus);
        expect(onAction).toBeCalledWith(VisualEditorActions.Zoom, props.zoom - zoomStepByButtons);
      });

      it('zoom reset', () => {
        handleToolbarClick(null, EZoomPanelItems.Zoom);
        expect(onAction).toBeCalledWith(VisualEditorActions.Zoom, 1);
      });

      it('do not trigger on unknown button', () => {
        handleToolbarClick(null, 'some unknown');
        expect(onAction).not.toBeCalled();
      });
    });

    describe('keeping in range', () => {
      const onAction = jest.fn();
      const zoomStepByButtons = 50;
      const zoomMax = 20;
      const zoomMin = 0.1;
      const component = mount(
        <ZoomPanel
          {...props}
          zoomMax={zoomMax}
          zoomMin={zoomMin}
          onAction={onAction}
          zoomStepByButtons={zoomStepByButtons}
        />
      );
      const handleToolbarClick = component.find(ToolbarMock).prop('onClick');

      beforeEach(() => {
        onAction.mockRestore();
      });

      it('should not zoom above max', () => {
        handleToolbarClick(null, EZoomPanelItems.Plus);
        expect(onAction).toBeCalledWith(VisualEditorActions.Zoom, zoomMax);
      });

      it('should not zoom below min', () => {
        handleToolbarClick(null, EZoomPanelItems.Minus);
        expect(onAction).toBeCalledWith(VisualEditorActions.Zoom, zoomMin);
      });
    });

    describe('via mouse wheel', () => {
      let handleWheel: (event: { deltaY: number }) => void;
      const onAction = jest.fn();
      const wheelZoomRef = {
        current: {
          addEventListener: jest.fn((event, handler) => handleWheel = handler),
          removeEventListener: jest.fn(),
        },
      };
      const zoomStepByWheel = 0.1;
      const component = mount(
        <ZoomPanel {...props}
          onAction={onAction}
          zoomStepByWheel={zoomStepByWheel}
          wheelZoomRef={wheelZoomRef as unknown as React.RefObject<HTMLDivElement>}
        />
      );

      it('adds event handler for wheel', () => {
        expect(wheelZoomRef.current.addEventListener.mock.calls[0][0]).toBe('wheel');
      });

      it('decrease zoom by wheel down', () => {
        handleWheel({ deltaY: 1 });
        expect(onAction).toBeCalledWith(VisualEditorActions.Zoom, props.zoom - zoomStepByWheel);
      });

      it('increase zoom by wheel up', () => {
        handleWheel({ deltaY: -1 });
        expect(onAction).toBeCalledWith(VisualEditorActions.Zoom, props.zoom + zoomStepByWheel);
      });

      it('removes event handler for wheel', () => {
        component.unmount();
        expect(wheelZoomRef.current.removeEventListener).toBeCalledWith('wheel', handleWheel);
      });
    });
  });
});
