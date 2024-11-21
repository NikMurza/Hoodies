import WithContextMenu from '@common/components/lib/canvas/components/context-menu/with-context-menu/WithContextMenu';
import * as React from 'react';
import * as ReactKonva from 'react-konva';
import Konva from 'konva';
import produce from 'immer';
import {
  VisualEditorActionClick,
  VisualEditorActions,
  VisualEditorCurveType,
  VisualEditorEndpoint,
  VisualEditorEndpointType,
  VisualEditorIdentityEvent,
  VisualEditorLine,
  VisualEditorPosition,
  VisualEditorRotateLocation,
  VisualEditorShapeType,
  VisualEditorTheme,
} from '@common/components/lib/types/visual-editor';
import Rectangle from '@common/geometry/rectangle';
import Bezier from '@common/geometry/bezier';
import Point from '@common/geometry/point';
import WithHover from '@common/components/lib/canvas/components/with-hover/WithHover';
import onMouseOverCursorPointer from '@common/hocs/lib/onMouseOverCursorPointer/onMouseOverCursorPointer';
import * as defaults from '@common/components/lib/canvas/visual-editor/defaults';
import { useExtension } from '@common/components/lib/canvas/hooks/useExtension';
import LineIcon from '@common/components/lib/canvas/shapes/line/LineIcon';
import { LegacyRef, useCallback, useState } from 'react';
import EndpointCircle from '@common/components/lib/canvas/shapes/line/EndpointCircle';
import WithDrag from '@common/components/lib/canvas/components/with-drag/WithDrag';
import { IMap } from '@common/api/types/map';

export interface LineProps extends VisualEditorLine {
  icon?: string;
  iconRadius?: number;
  iconBackplateTheme?: VisualEditorTheme;
  iconBackplateRadius?: number;
  draggable?: boolean;
  ref?: LegacyRef<Konva.Group>;
  middlePoints?: VisualEditorPosition[];
}

interface LinePoints {
  fromEndpoint: VisualEditorEndpoint;
  toEndpoint: VisualEditorEndpoint;
  center: VisualEditorPosition;
  linePoints: number[];
}

const updateEndpoint = (
  endpoint: VisualEditorEndpoint,
  position: VisualEditorPosition,
): VisualEditorEndpoint =>
  produce(endpoint, (draft: VisualEditorEndpoint) => {
    draft.location.x = position.x;
    draft.location.y = position.y;
  });

type PointsCalculator = (
  from: VisualEditorEndpoint,
  to: VisualEditorEndpoint,
  middlePoints?: VisualEditorPosition[],
) => LinePoints;

const calculatePointsNone: PointsCalculator = (
  from: VisualEditorEndpoint,
  to: VisualEditorEndpoint,
): LinePoints => {
  const { x: x1, y: y1 } = from.location;
  const { x: x2, y: y2 } = to.location;

  return {
    fromEndpoint: from,
    toEndpoint: to,
    linePoints: [x1, y1, x2, y2],
    center: {
      x: (x1 + x2) / 2,
      y: (y1 + y2) / 2,
    },
  };
};

const createControlPoint = (points: VisualEditorPosition[], index: number): Point =>
  points?.length >= 2 ? new Point(points[index].x, points[index].y) : null;

const calculatePointsBezier: PointsCalculator = (
  from: VisualEditorEndpoint,
  to: VisualEditorEndpoint,
  middlePoints: VisualEditorPosition[] = null,
): LinePoints => {
  const { x: x1, y: y1, width: width1, height: height1, rotation: rotation1 } = from.location;
  const { x: x2, y: y2, width: width2, height: height2, rotation: rotation2 } = to.location;

  // если координата начала и координате конца почти в той же точке (< 5px) - то не вычисляем, а указываем туда же
  const MIN_BEZIER_LEN = 5;
  const isOneCloseToOther: boolean =
    Math.abs(x1 - x2) < MIN_BEZIER_LEN && Math.abs(y1 - y2) < MIN_BEZIER_LEN;

  const deltaFrom = from?.style?.theme?.borderWidth ?? 0;
  const fromRectangle = new Rectangle(
    x1 - deltaFrom,
    y1 - deltaFrom,
    width1 + 2 * deltaFrom,
    height1 + 2 * deltaFrom,
    rotation1,
  );

  const deltaTo = to?.style?.theme?.borderWidth ?? 0;
  const toRectangle = isOneCloseToOther
    ? fromRectangle
    : new Rectangle(
        x2 - deltaTo,
        y2 - deltaTo,
        width2 + 2 * deltaTo,
        height2 + 2 * deltaTo,
        rotation2,
      );

  const control1 = createControlPoint(middlePoints, 0);
  const control2 = createControlPoint(middlePoints, 1);

  const bezierPoints = new Bezier(fromRectangle, toRectangle, control1, control2);

  if (from.style.type === VisualEditorEndpointType.Circle) {
    bezierPoints.start.x = fromRectangle.center.x;
    bezierPoints.start.y = fromRectangle.center.y;
  }
  if (to.style.type === VisualEditorEndpointType.Circle) {
    bezierPoints.end.x = toRectangle.center.x;
    bezierPoints.end.y = toRectangle.center.y;
  }

  return {
    fromEndpoint: updateEndpoint(from, bezierPoints.start),
    toEndpoint: updateEndpoint(to, bezierPoints.end),
    linePoints: bezierPoints.flatten(),
    center: {
      x: (bezierPoints.start.x + bezierPoints.end.x) / 2,
      y: (bezierPoints.start.y + bezierPoints.end.y) / 2,
    },
  };
};

const calculatePointsBended: PointsCalculator = (
  from: VisualEditorEndpoint,
  to: VisualEditorEndpoint,
  middlePoints: VisualEditorPosition[] = null,
): LinePoints => {
  const { x: x1, y: y1 } = from.location;
  const { x: x2, y: y2 } = to.location;

  const width = x2 - x1;
  const height = y2 - y1;

  const breakX = width / 2;
  const breakY = height / 2;
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;

  const isHorizontal = Math.abs(width) > Math.abs(height);

  const breakPoints = [];
  if (middlePoints) {
    middlePoints.forEach((item) => {
      breakPoints.push(item.x, item.y);
    });
  } else if (isHorizontal) {
    breakPoints.push(x1 + breakX, y1);
    breakPoints.push(x1 + breakX, y2);
  } else {
    breakPoints.push(x1, y1 + breakY);
    breakPoints.push(x2, y1 + breakY);
  }

  return {
    fromEndpoint: from,
    toEndpoint: to,
    linePoints: [x1, y1, ...breakPoints, x2, y2],
    center: {
      x: centerX,
      y: centerY,
    },
  };
};

const calculationMap: IMap<PointsCalculator> = {
  [VisualEditorCurveType.None]: calculatePointsNone,
  [VisualEditorCurveType.Bezier]: calculatePointsBezier,
  [VisualEditorCurveType.Bended]: calculatePointsBended,
};

const calculatePoints = (
  from: VisualEditorEndpoint,
  to: VisualEditorEndpoint,
  style: VisualEditorCurveType,
  middlePoints: VisualEditorPosition[] = null,
): LinePoints => {
  const calculator = calculationMap[style];
  if (!calculator) {
    throw new Error(`Отсутсвует calculationMap для типа ${style}`);
  }

  return calculator(from, to, middlePoints);
};

const GroupWithHOCs = WithHover(
  WithContextMenu(
    onMouseOverCursorPointer(
      WithDrag((props: Konva.NodeConfig) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <ReactKonva.Group ref={(props as any).forwardedRef} {...props} />
      )),
    ),
  ),
);

const Line: React.FC<LineProps> = React.forwardRef(
  (props: LineProps, ref: React.MutableRefObject<Konva.Group>): JSX.Element => {
    const {
      id,
      type,
      from: initialFrom,
      to: initialTo,
      style,
      icon,
      iconRadius,
      iconBackplateTheme,
      iconBackplateRadius,
      extension,
      extensionProps,
      contextMenuItems,
      isContextMenuShow,
      draggable,
      zIndex,
      middlePoints,
      onAction,
      onAddComponent,
      onRemoveComponent,
    } = props;

    const [isToArrowHover, setIsToArrowHover] = useState<boolean>(false);

    const onToArrowEnter = useCallback(() => {
      setIsToArrowHover(true);
    }, []);

    const onToArrowOut = useCallback(() => {
      setIsToArrowHover(false);
    }, []);

    const onClick = (event: Konva.KonvaEventObject<MouseEvent>): void => {
      onAction<VisualEditorActionClick>(VisualEditorActions.Click, {
        id,
        event: event?.evt,
      });
    };

    const onDblClick = (event: Konva.KonvaEventObject<MouseEvent>): void => {
      onAction<VisualEditorActionClick>(VisualEditorActions.DoubleClick, {
        id,
        event: event?.evt,
      });
    };

    const onMouseDown = (event: Konva.KonvaEventObject<MouseEvent>): void => {
      onAction<VisualEditorIdentityEvent<MouseEvent>>(VisualEditorActions.MouseDown, {
        id,
        event,
      });
    };

    const onMouseUp = (event: Konva.KonvaEventObject<MouseEvent>): void => {
      onAction<VisualEditorIdentityEvent<MouseEvent>>(VisualEditorActions.MouseUp, {
        id,
        event,
      });
    };

    const [from, to] =
      initialFrom.style.type === VisualEditorEndpointType.Arrow
        ? [initialTo, initialFrom]
        : [initialFrom, initialTo];

    const bezier = style.curve === VisualEditorCurveType.Bezier;

    const points = calculatePoints(from, to, style.curve, middlePoints);

    const pointerAtBeginning = from.style.type === VisualEditorEndpointType.Arrow;
    const pointerAtEnd = to.style.type === VisualEditorEndpointType.Arrow;

    const pointerLength = pointerAtEnd ? defaults.line.endpointLength : 0;
    const pointerWidth = pointerAtEnd ? defaults.line.endpointWidth : 0;

    const circleAtBeginning = from.style.type === VisualEditorEndpointType.Circle;
    const circleAtEnd = to.style.type === VisualEditorEndpointType.Circle;

    const extensionElement = useExtension<VisualEditorLine>(extension, extensionProps, {
      ...props,
      forwardRef: ref,
      from: points.fromEndpoint,
      to: points.toEndpoint,
    });

    const toTheme = isToArrowHover && to.style.hoverTheme ? to.style.hoverTheme : style.theme;
    return (
      <GroupWithHOCs
        forwardedRef={ref}
        type={type}
        id={id}
        onClick={onClick}
        onDblClick={onDblClick}
        items={contextMenuItems}
        isContextMenuShow={isContextMenuShow}
        onAction={onAction}
        onAddComponent={onAddComponent}
        onRemoveComponent={onRemoveComponent}
        draggable={draggable}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        zIndex={zIndex}
      >
        <ReactKonva.Line
          id={id}
          bezier={bezier}
          points={points.linePoints}
          stroke={style.theme.borderColor}
          hitStrokeWidth={from.hitStrokeWidth}
          fill={style.theme.backgroundColor}
          strokeWidth={style.theme.borderWidth}
          pointerLength={pointerLength}
          pointerWidth={pointerWidth}
          opacity={style.theme.opacity}
        />

        <ReactKonva.Arrow
          id={id}
          bezier={bezier}
          points={points.linePoints}
          pointerAtBeginning={pointerAtBeginning}
          fill={toTheme.backgroundColor}
          strokeEnabled={false}
          pointerLength={pointerLength}
          pointerWidth={pointerWidth}
          opacity={toTheme.opacity}
          onMouseEnter={onToArrowEnter}
          onMouseOut={onToArrowOut}
          onMouseDown={to.onMouseDown}
          hitStrokeWidth={to.hitStrokeWidth}
        />

        {icon ? (
          <LineIcon
            id={id}
            type={type}
            position={points.center}
            icon={icon}
            radius={iconRadius}
            backplateRadius={iconBackplateRadius}
            backplateTheme={iconBackplateTheme}
            isContextMenuShow={isContextMenuShow}
            contextMenuItems={contextMenuItems}
            onAction={onAction}
            onAddComponent={onAddComponent}
            onRemoveComponent={onRemoveComponent}
          />
        ) : null}

        {circleAtBeginning && <EndpointCircle {...points.fromEndpoint} />}
        {circleAtEnd && <EndpointCircle {...points.toEndpoint} />}

        {extensionElement}
      </GroupWithHOCs>
    );
  },
);

export default Line;

type CreateLineOptions = Omit<LineProps, 'type'>;

const defaultLocation: VisualEditorRotateLocation = {
  id: '',
  x: 0,
  y: 0,
  rotation: 0,
  width: 0,
  height: 0,
};

const defaultTheme: VisualEditorTheme = {
  opacity: 1,
  backgroundColor: defaults.colors.borderColor,
  borderWidth: defaults.line.borderWidth,
  borderColor: defaults.colors.borderColor,
};

export const createLine = (opts: CreateLineOptions): LineProps => ({
  extension: null,
  from: {
    location: defaultLocation,
    style: {
      type: VisualEditorEndpointType.None,
      theme: defaultTheme,
    },
  },
  to: {
    location: defaultLocation,
    style: {
      type: VisualEditorEndpointType.None,
      theme: defaultTheme,
    },
  },
  style: {
    curve: VisualEditorCurveType.None,
    theme: defaultTheme,
  },
  icon: null,
  iconRadius: defaults.line.iconRadius,
  iconBackplateTheme: {
    borderWidth: 0,
    borderColor: defaults.colors.borderColor,
    backgroundColor: defaults.colors.canvas,
  },
  iconBackplateRadius: defaults.line.iconRadius,
  type: VisualEditorShapeType.Line,
  ...opts,
});
