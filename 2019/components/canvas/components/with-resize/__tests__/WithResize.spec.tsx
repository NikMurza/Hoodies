import * as React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { renderHook, act } from '@testing-library/react-hooks';
import WithResize, {
  ResizeMarkerPosition,
  defaultMinSize,
  defaultMaxSize,
  useEventListeners,
  setEqualSize,
  checkResizePointsAndSet,
} from '../WithResize';

const HOC = WithResize(() => <div>Component</div>);

describe('WithResize HOC', () => {
  const props = {
    id: '1',
    width: 640,
    height: 560,
    x: 100,
    y: 200,
    isSelected: false,
    isValid: true,
    minSize: defaultMinSize,
    maxSize: defaultMaxSize,
    onAction: jest.fn(),
    isEditing: false,
  };
  const wrapper = shallow(<HOC {...props} />);
  it('renders correctly', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('renders correctly if selected', () => {
    const localProps = {
      ...props,
      isSelected: true,
    };
    const wrapper = shallow(<HOC {...localProps} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('onMouseEnter/Leave', () => {
    const localProps = {
      ...props,
      isSelected: true,
    };
    const wrapper = shallow(<HOC {...localProps} />);
    const topLeft = wrapper.find('.resize-marker-top-left');
    topLeft.simulate('mouseenter');
    const topLeftUpdated = wrapper.find('.resize-marker-top-left');
    const hidden = wrapper.find('.hide');
    expect(topLeftUpdated.hasClass('hover')).toBeTruthy();
    expect(hidden).toHaveLength(7);

    topLeft.simulate('mouseleave');
    const topLeftUpdated2 = wrapper.find('.resize-marker-top-left');
    const hiddenUpdated = wrapper.find('.hide');
    expect(topLeftUpdated2.hasClass('hover')).toBeFalsy();
    expect(hiddenUpdated).toHaveLength(0);
  });

  it('onMouseDown', () => {
    const localProps = {
      ...props,
      isSelected: true,
    };
    const wrapper = shallow(<HOC {...localProps} />);
    const topLeft = wrapper.find('.resize-marker-top-left');
    topLeft.simulate('mousedown', {
      preventDefault: jest.fn,
      stopPropagation: jest.fn,
      nativeEvent: { stopImmediatePropagation: jest.fn },
    });
    const resizeArea = wrapper.find('.with-resize__selection-area');
    const component = wrapper.find('.component');
    expect(resizeArea.hasClass('resizing')).toBeTruthy();
    expect(component.hasClass('resizing')).toBeTruthy();
  });

  describe('setEqualSize', () => {
    it('setEqualSize - TopLeft, newWidth > newHeight', () => {
      const resizePoints = { top: 10, right: 10, bottom: 10, left: 10 };
      setEqualSize(resizePoints, 500, 400, ResizeMarkerPosition.TopLeft);
      expect(resizePoints).toEqual({ top: -80, right: 10, bottom: 10, left: 10 });
    });

    it('setEqualSize - TopLeft, newWidth <= newHeight', () => {
      const resizePoints = { top: 10, right: 10, bottom: 10, left: 10 };
      setEqualSize(resizePoints, 400, 500, ResizeMarkerPosition.TopLeft);
      expect(resizePoints).toEqual({ top: 10, right: 10, bottom: 10, left: -80 });
    });

    it('setEqualSize - BottomRight, newWidth > newHeight', () => {
      const resizePoints = { top: 10, right: 10, bottom: 10, left: 10 };
      setEqualSize(resizePoints, 500, 400, ResizeMarkerPosition.BottomRight);
      expect(resizePoints).toEqual({ top: 10, right: 10, bottom: -80, left: 10 });
    });

    it('setEqualSize - BottomRight, newWidth <= newHeight', () => {
      const resizePoints = { top: 10, right: 10, bottom: 10, left: 10 };
      setEqualSize(resizePoints, 400, 500, ResizeMarkerPosition.BottomRight);
      expect(resizePoints).toEqual({ top: 10, right: -80, bottom: 10, left: 10 });
    });
  });

  describe('checkResizePointsAndSet', () => {
    const defaultProps = {
      width: 400,
      height: 400,
      minSize: defaultMinSize,
      maxSize: defaultMaxSize,
      markerDragging: ResizeMarkerPosition.TopLeft,
      setResizePoints: jest.fn(),
    };
    it('checkResizePointsAndSet - common case', () => {
      const resizePoints = { top: 10, right: 10, bottom: 10, left: 10 };
      const shiftKey = false;
      checkResizePointsAndSet(resizePoints, shiftKey, defaultProps);
      expect(resizePoints).toEqual({ top: 10, right: 10, bottom: 10, left: 10 });
    });

    it('checkResizePointsAndSet - common case, shiftKey', () => {
      const resizePoints = { top: 10, right: 10, bottom: 10, left: 10 };
      const shiftKey = true;
      const props = {
        ...defaultProps,
        width: 500,
      };
      checkResizePointsAndSet(resizePoints, shiftKey, props);
      expect(resizePoints).toEqual({ top: -80, right: 10, bottom: 10, left: 10 });
    });

    it('checkResizePointsAndSet - newWidth < minWidth && |left| <= |right|', () => {
      const resizePoints = { top: 10, right: 10, bottom: 10, left: 10 };
      const shiftKey = false;
      const props = {
        ...defaultProps,
        width: 100,
      };
      checkResizePointsAndSet(resizePoints, shiftKey, props);
      expect(resizePoints).toEqual({ top: 10, right: -110, bottom: 10, left: 10 });
    });

    it('checkResizePointsAndSet - newWidth < minWidth && |left| > |right|', () => {
      const resizePoints = { top: 10, right: 10, bottom: 10, left: 15 };
      const shiftKey = false;
      const props = {
        ...defaultProps,
        width: 100,
      };
      checkResizePointsAndSet(resizePoints, shiftKey, props);
      expect(resizePoints).toEqual({ top: 10, right: 10, bottom: 10, left: -110 });
    });

    it('checkResizePointsAndSet - newHeight < minHeight && |top| <= |bottom|', () => {
      const resizePoints = { top: 10, right: 10, bottom: 10, left: 10 };
      const shiftKey = false;
      const props = {
        ...defaultProps,
        height: 100,
      };
      checkResizePointsAndSet(resizePoints, shiftKey, props);
      expect(resizePoints).toEqual({ top: 10, right: 10, bottom: -110, left: 10 });
    });

    it('checkResizePointsAndSet - newHeight < minHeight && |top| > |bottom|', () => {
      const resizePoints = { top: 15, right: 10, bottom: 10, left: 10 };
      const shiftKey = false;
      const props = {
        ...defaultProps,
        height: 100,
      };
      checkResizePointsAndSet(resizePoints, shiftKey, props);
      expect(resizePoints).toEqual({ top: -110, right: 10, bottom: 10, left: 10 });
    });

    it('checkResizePointsAndSet - newWidth > maxWidth && |left| <= |right|', () => {
      const resizePoints = { top: 10, right: 10, bottom: 10, left: 10 };
      const shiftKey = false;
      const props = {
        ...defaultProps,
        width: 900,
      };
      checkResizePointsAndSet(resizePoints, shiftKey, props);
      expect(resizePoints).toEqual({ top: 10, right: 90, bottom: 10, left: 10 });
    });

    it('checkResizePointsAndSet - newWidth > maxWidth && |left| > |right|', () => {
      const resizePoints = { top: 10, right: 10, bottom: 10, left: 15 };
      const shiftKey = false;
      const props = {
        ...defaultProps,
        width: 900,
      };
      checkResizePointsAndSet(resizePoints, shiftKey, props);
      expect(resizePoints).toEqual({ top: 10, right: 10, bottom: 10, left: 90 });
    });

    it('checkResizePointsAndSet - newHeight > maxHeight && |top| <= |bottom|', () => {
      const resizePoints = { top: 10, right: 10, bottom: 10, left: 10 };
      const shiftKey = false;
      const props = {
        ...defaultProps,
        height: 900,
      };
      checkResizePointsAndSet(resizePoints, shiftKey, props);
      expect(resizePoints).toEqual({ top: 10, right: 10, bottom: 90, left: 10 });
    });

    it('checkResizePointsAndSet - newHeight > maxHeight && |top| > |bottom|', () => {
      const resizePoints = { top: 15, right: 10, bottom: 10, left: 10 };
      const shiftKey = false;
      const props = {
        ...defaultProps,
        height: 900,
      };
      checkResizePointsAndSet(resizePoints, shiftKey, props);
      expect(resizePoints).toEqual({ top: 90, right: 10, bottom: 10, left: 10 });
    });
  });

  describe('event listeners', () => {
    document.addEventListener = jest.fn();
    document.removeEventListener = jest.fn();

    const onMouseMove = jest.fn();
    const onMouseUp = jest.fn();
    const markerDragging = ResizeMarkerPosition.TopLeft;
    const resizePoints = { top: 10, right: 10, bottom: 10, left: 10 };

    beforeEach(() => {
      (document.addEventListener as jest.Mock).mockClear();
      (document.removeEventListener as jest.Mock).mockClear();
      onMouseMove.mockClear();
      onMouseUp.mockClear();
    });

    it('call listeners', () => {
      renderHook(() => useEventListeners(onMouseMove, onMouseUp, markerDragging, resizePoints));
      expect(document.addEventListener).toBeCalledTimes(2);
    });
  });
});
