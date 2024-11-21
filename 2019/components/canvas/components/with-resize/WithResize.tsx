import * as React from 'react';
import {
  VisualEditorRectPoints,
  VisualEditorActions,
  VisualEditorIdentity,
  VisualEditorPosition,
  VisualEditorSize,
} from '@common/components/lib/types/visual-editor';
import classNames from 'classnames';
import SVGIcon from '@common/components/lib/controls/svg-icon/SVGIcon';
import { getIconPath } from '@common/api/utils/object';
import './WithResize.less';
import { VisualizerPositionOptions } from '@common/api/types/visualizers/root';

enum ResizeMarkerType {
  Corner = 'corner',
  Center = 'center',
}

export enum ResizeMarkerPosition {
  TopLeft = 'top-left',
  TopRight = 'top-right',
  BottomLeft = 'bottom-left',
  BottomRight = 'bottom-right',
  CenterTop = 'center-top',
  CenterBottom = 'center-bottom',
  CenterLeft = 'center-left',
  CenterRight = 'center-right',
}

const resizeMarkers = [
  {
    type: ResizeMarkerType.Corner,
    position: ResizeMarkerPosition.TopLeft,
  },
  {
    type: ResizeMarkerType.Corner,
    position: ResizeMarkerPosition.TopRight,
  },
  {
    type: ResizeMarkerType.Corner,
    position: ResizeMarkerPosition.BottomLeft,
  },
  {
    type: ResizeMarkerType.Corner,
    position: ResizeMarkerPosition.BottomRight,
  },
  {
    type: ResizeMarkerType.Center,
    position: ResizeMarkerPosition.CenterTop,
  },
  {
    type: ResizeMarkerType.Center,
    position: ResizeMarkerPosition.CenterBottom,
  },
  {
    type: ResizeMarkerType.Center,
    position: ResizeMarkerPosition.CenterLeft,
  },
  {
    type: ResizeMarkerType.Center,
    position: ResizeMarkerPosition.CenterRight,
  },
];

export const defaultMinSize = { width: 200, height: 200 };
export const defaultMaxSize = { width: 800, height: 800 };

export const useEventListeners = (onMouseMove, onMouseUp, markerDragging, resizePoints): void => {
  React.useEffect(() => {
    if (markerDragging) {
      document.addEventListener('mousemove', onMouseMove);
    }

    return (): void => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [markerDragging]);

  React.useEffect(() => {
    if (markerDragging) {
      document.addEventListener('mouseup', onMouseUp);
    }

    return (): void => {
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [markerDragging, resizePoints]);
};

/**
 * Делаем все стороны одинакового размера
 */
export const setEqualSize = (
  points: VisualEditorRectPoints,
  width: number,
  height: number,
  markerDragging: ResizeMarkerPosition,
): void => {
  const { top, right, bottom, left } = points;

  const newWidth = width - left - right;
  const newHeight = height - top - bottom;

  switch (markerDragging) {
    case ResizeMarkerPosition.TopLeft:
      if (newWidth > newHeight) {
        points.top = -(newWidth - height);
      } else {
        points.left = -(newHeight - width);
      }
      break;
    case ResizeMarkerPosition.TopRight:
      if (newWidth > newHeight) {
        points.top = -(newWidth - height);
      } else {
        points.right = -(newHeight - width);
      }
      break;
    case ResizeMarkerPosition.BottomLeft:
      if (newWidth > newHeight) {
        points.bottom = -(newWidth - height);
      } else {
        points.left = -(newHeight - width);
      }
      break;
    case ResizeMarkerPosition.BottomRight:
      if (newWidth > newHeight) {
        points.bottom = -(newWidth - height);
      } else {
        points.right = -(newHeight - width);
      }
      break;
    default:
  }
};

/**
 * Проверяем что размер не больше и не меньше заданного в minSize / maxSize
 */
export const checkResizePointsAndSet = (
  points: VisualEditorRectPoints,
  shiftKey: boolean,
  props: {
    width: number;
    height: number;
    minSize: VisualEditorSize;
    maxSize: VisualEditorSize;
    markerDragging: ResizeMarkerPosition;
    setResizePoints: (points: VisualEditorRectPoints) => void; // TODO type
  },
): void => {
  const { top, right, bottom, left } = points;
  const { width, height, minSize, maxSize, markerDragging, setResizePoints } = props;

  const newWidth = width - left - right;
  const newHeight = height - top - bottom;

  if (newWidth < minSize.width) {
    if (Math.abs(left) > Math.abs(right)) {
      points.left = width - minSize.width - right;
    } else {
      points.right = width - minSize.width - left;
    }
  }
  if (newHeight < minSize.height) {
    if (Math.abs(top) > Math.abs(bottom)) {
      points.top = height - minSize.height - bottom;
    } else {
      points.bottom = height - minSize.height - top;
    }
  }

  if (newWidth > maxSize.width) {
    if (Math.abs(left) > Math.abs(right)) {
      points.left = width - maxSize.width - right;
    } else {
      points.right = width - maxSize.width - left;
    }
  }
  if (newHeight > maxSize.height) {
    if (Math.abs(top) > Math.abs(bottom)) {
      points.top = height - maxSize.height - bottom;
    } else {
      points.bottom = height - maxSize.height - top;
    }
  }

  if (shiftKey) {
    setEqualSize(points, width, height, markerDragging);
  }
  setResizePoints(points);
};
export interface Props extends VisualEditorIdentity, VisualEditorPosition, VisualEditorSize {
  minSize?: VisualEditorSize;
  maxSize?: VisualEditorSize;
  isSelected: boolean;
  isValid: boolean;
  isFetching?: boolean;
  isEditing?: boolean;
  onAction?(
    action: VisualEditorActions,
    data: VisualEditorIdentity & VisualEditorPosition & VisualEditorSize,
  ): void;
  zoom?: number;
}

const WithResize = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
): React.FC<P & Props> => (props: Props): JSX.Element => {
  const {
    id,
    parentId,
    width,
    height,
    x,
    y,
    isSelected,
    isFetching,
    isValid,
    isEditing,
    minSize = defaultMinSize,
    maxSize = defaultMaxSize,
    onAction,
    zoom,
  } = props;

  const [isHovered, setIsHovered] = React.useState<boolean>(false);
  const [markerHovered, setMarkerHovered] = React.useState<ResizeMarkerPosition>(null);
  const [markerDragging, setMarkerDragging] = React.useState<ResizeMarkerPosition>(null);
  // запоминаем начальную позицию курсора
  const [initialCursorPosition, setInitialCursorPosition] = React.useState<VisualEditorPosition>(
    null,
  );
  // точки для области ресайза
  const [resizePoints, setResizePoints] = React.useState<VisualEditorRectPoints>(null);
  // состояние нажатия на ЛКМ
  const [isMouseButtonPressed, setIsMouseButtonPressed] = React.useState<boolean>(false);

  const onMouseEnter = React.useCallback(
    (marker: { type: ResizeMarkerType; position: ResizeMarkerPosition }) => (): void => {
      setMarkerHovered(marker.position);
    },
    [],
  );

  const onMouseLeave = React.useCallback((): void => {
    setMarkerHovered(null);
  }, []);

  const onMouseDown = React.useCallback(
    (marker: { type: ResizeMarkerType; position: ResizeMarkerPosition }) => (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ): void => {
      event.preventDefault();
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();

      setMarkerDragging(marker.position);
      setInitialCursorPosition({ x: event.pageX, y: event.pageY });
    },
    [],
  );

  const getResizeOptions = React.useCallback((): VisualizerPositionOptions => {
    if (!resizePoints) return null;

    const { top, right, bottom, left } = resizePoints;

    return {
      id,
      x: x + left,
      y: y + top,
      width: width - left - right,
      height: height - top - bottom,
      parentId,
    };
  }, [resizePoints]);

  const onMouseUp = React.useCallback((): void => {
    if (markerDragging && resizePoints) {
      const resizeOpts = getResizeOptions();
      resizeOpts && onAction && onAction(VisualEditorActions.Resize, resizeOpts);
      setMarkerDragging(null);
      setInitialCursorPosition(null);
      setResizePoints({ top: 0, right: 0, bottom: 0, left: 0 });
      setIsMouseButtonPressed(false);
    }
  }, [markerDragging, resizePoints]);

  // Был замечен баг с несрабатыванием mouseUp в addEventListener,
  // из-за чего маркер ресайза продолжал двигаться за мышкой.
  // Чтобы удостовериться, что resizePoints сброисились, вызываем onMouseUp,
  // если ЛКМ оказалась незажатой
  React.useEffect(() => {
    if (!isMouseButtonPressed) {
      onMouseUp();
    }
  }, [isMouseButtonPressed]);

  const onMouseMove = React.useCallback(
    (event: MouseEvent): void => {
      setIsMouseButtonPressed(!!event.buttons);

      if (markerDragging) {
        const { x, y } = initialCursorPosition;
        const offsetX = (x - event.pageX) / zoom;
        const offsetY = (y - event.pageY) / zoom;

        const props = {
          width,
          height,
          minSize,
          maxSize,
          markerDragging,
          setResizePoints,
        };
        const checkResizePointsAndSetWrapper = (points: VisualEditorRectPoints): void => {
          checkResizePointsAndSet(points, event.shiftKey, props);
        };

        // в зависимости от маркера - меняем размеры области ресайза
        switch (markerDragging) {
          case ResizeMarkerPosition.TopLeft:
            checkResizePointsAndSetWrapper({ top: -offsetY, right: 0, bottom: 0, left: -offsetX });
            break;
          case ResizeMarkerPosition.TopRight:
            checkResizePointsAndSetWrapper({ top: -offsetY, right: offsetX, bottom: 0, left: 0 });
            break;
          case ResizeMarkerPosition.BottomLeft:
            checkResizePointsAndSetWrapper({ top: 0, right: 0, bottom: offsetY, left: -offsetX });
            break;
          case ResizeMarkerPosition.BottomRight:
            checkResizePointsAndSetWrapper({ top: 0, right: offsetX, bottom: offsetY, left: 0 });
            break;

          case ResizeMarkerPosition.CenterTop:
            checkResizePointsAndSetWrapper({ top: -offsetY, right: 0, bottom: 0, left: 0 });
            break;
          case ResizeMarkerPosition.CenterRight:
            checkResizePointsAndSetWrapper({ top: 0, right: offsetX, bottom: 0, left: 0 });
            break;
          case ResizeMarkerPosition.CenterBottom:
            checkResizePointsAndSetWrapper({ top: 0, right: 0, bottom: offsetY, left: 0 });
            break;
          case ResizeMarkerPosition.CenterLeft:
            checkResizePointsAndSetWrapper({ top: 0, right: 0, bottom: 0, left: -offsetX });
            break;
          default:
        }
      }
    },
    [markerDragging, initialCursorPosition, checkResizePointsAndSet],
  );

  useEventListeners(onMouseMove, onMouseUp, markerDragging, resizePoints);

  const onMouseOver = React.useCallback((e): void => {
    if (!e.target.closest('.popup-menu')) setIsHovered(true);
  }, []);

  const onMouseOut = React.useCallback((): void => {
    setIsHovered(false);
  }, []);

  const renderMarker = React.useCallback(
    (item: { type: ResizeMarkerType; position: ResizeMarkerPosition }): JSX.Element => {
      // увеличиваем в размере маркер, на котором курсор
      const isHovered = markerHovered === item.position;
      // прячем все остальные
      const hideMarker = markerHovered && !isHovered;

      return (
        <div
          onMouseEnter={onMouseEnter(item)}
          onMouseLeave={onMouseLeave}
          onMouseDown={onMouseDown(item)}
          key={`${item.type}_${item.position}`}
          className={classNames(
            `resize-marker resize-marker-${item.type} resize-marker-${item.position}`,
            {
              hide: hideMarker,
              hover: isHovered,
            },
          )}
        >
          <SVGIcon src={getIconPath(`resize-marker-${item.type}`)} />
        </div>
      );
    },
    [markerHovered, onMouseEnter, onMouseLeave, onMouseDown, zoom],
  );

  const { top = 0, bottom = 0, left = 0, right = 0 } = resizePoints || {};

  const resizeStyle = markerDragging
    ? {
        top: top * zoom,
        bottom: bottom * zoom,
        left: left * zoom,
        right: right * zoom,
      }
    : {};

  const resize = getResizeOptions();

  return (
    <div
      className={classNames('with-resize')}
      style={{ left: x, top: y }}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      {isSelected ? (
        <div
          className={classNames('with-resize__selection-area', {
            resizing: !!markerDragging,
            invalid: !isValid,
            hover: isHovered && !isEditing,
            fetching: isFetching,
          })}
          style={resizeStyle}
        >
          <div
            className={classNames('size-lbl', {
              visible: resize && !!markerDragging,
            })}
          >
            {Math.round(resize?.width)} x {Math.round(resize?.height)}
          </div>
          {resizeMarkers.map(renderMarker)}
        </div>
      ) : null}
      <div
        className={classNames('component', {
          resizing: !!markerDragging,
        })}
      >
        <WrappedComponent {...(props as P)} isReadyToResize={!!markerDragging} />
      </div>
    </div>
  );
};

export default WithResize;
