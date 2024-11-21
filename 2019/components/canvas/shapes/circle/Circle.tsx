import * as React from 'react';
import * as ReactKonva from 'react-konva';
import Konva from 'konva';
// eslint-disable-next-line import/no-unresolved
import { KonvaEventObject } from 'konva/types/Node';
import {
  VisualEditorCircle,
  VisualEditorShapeType,
  VisualEditorComponentData,
  VisualEditorActions,
  VisualEditorComponentContract,
  ContextMenuItem,
  VisualEditorPosition,
  VisualEditorActionClick,
} from '@common/components/lib/types/visual-editor';
import * as defaults from '@common/components/lib/canvas/visual-editor/defaults';
import * as color from '@common/styles/constants/colors';
import onMouseOverCursorPointer from '@common/hocs/lib/onMouseOverCursorPointer/onMouseOverCursorPointer';
import Input from '@common/components/lib/canvas/components/input/input';
import WithContextMenu from '@common/components/lib/canvas/components/context-menu/with-context-menu/WithContextMenu';
import WithHover from '@common/components/lib/canvas/components/with-hover/WithHover';
import WithDrag from '@common/components/lib/canvas/components/with-drag/WithDrag';
import { useExtension } from '../../hooks/useExtension';

const { canvasOffset } = defaults.canvas;

export interface CircleProps extends VisualEditorCircle, VisualEditorComponentContract {
  contextMenuItems?: ContextMenuItem[];
  isContextMenuShow?: boolean;
  onAction?<T extends object>(action: VisualEditorActions, data: T): void;
  onAddComponent?: (data: VisualEditorComponentData) => void;
  onRemoveComponent?: (id: string) => void;
  isHovered?: boolean;
}

// Группа с событиями на mouse over - изменение курсора
const GroupWithHOCs = WithHover(
  WithDrag(
    WithContextMenu(
      onMouseOverCursorPointer((props: Konva.NodeConfig) => <ReactKonva.Group {...props} />),
    ),
  ),
);

// расширить область hover
const extendHoverArea = 2;

/**
 * Отрисовывает Круг с текстом
 * @param props Свойства
 */
const Circle: React.FC<CircleProps> = (props: CircleProps): JSX.Element => {
  const {
    id,
    type,
    text,
    textColor,
    // х и у отвечают за центр круга.
    x,
    y,
    stageSize,
    radius,
    backgroundColor,
    borderColor,
    contextMenuItems,
    isContextMenuShow,
    onAction,
    onAddComponent,
    onRemoveComponent,
    extension,
  } = props;
  const inputId = `input_${id}`;

  const [isEditing, setIsEditing] = React.useState(false);

  const enableEditing = React.useCallback((): void => setIsEditing(true), []);

  const onComplete = React.useCallback(
    (newText: string): void => {
      if (newText !== text) {
        onAction<VisualEditorCircle>(VisualEditorActions.Update, {
          id,
          type,
          x,
          y,
          radius,
          backgroundColor,
          text: newText,
        });
      }
      setIsEditing(false);
    },
    [type, text, id, x, y, radius, backgroundColor, onAction],
  );

  const onCancel = React.useCallback((): void => {
    setIsEditing(false);
  }, []);

  React.useEffect(() => {
    if (isEditing) {
      const style = {
        color: textColor,
      };

      const data = {
        id: inputId,
        component: (
          <Input
            key={inputId}
            id={inputId}
            text={text}
            x={x}
            y={y}
            onComplete={onComplete}
            onCancel={onCancel}
            style={style}
          />
        ),
      };
      onAddComponent(data);
    } else {
      onRemoveComponent(inputId);
    }
  }, [isEditing, textColor, text, x, y, onComplete, onCancel]);

  const onGroupAction = React.useCallback(
    <T extends object>(action: VisualEditorActions, data: T): void => {
      const update = (): void => {
        // дополняем передаваемые данные до полного интерфейса VisualEditorCircle
        data = { ...data, type, radius, backgroundColor, text };
      };

      const actions = {
        [VisualEditorActions.Edit]: enableEditing,
        [VisualEditorActions.Update]: update,
        [VisualEditorActions.Move]: update,
      };

      // вызываем обработчики
      if (actions[action]) actions[action]();

      // прокидываем наверх
      onAction(action, data);
    },
    [type, radius, backgroundColor, text, onAction],
  );

  const onActionHandler = React.useCallback(
    (action: VisualEditorActions) => (event: KonvaEventObject<MouseEvent>): void => {
      onAction<VisualEditorActionClick>(action, {
        id,
        event: event?.evt,
      });
    },
    [id, onAction],
  );

  // не даем унести элемент за пределы холста (граница - canvasOffset от края)
  const getRestrictedCoordinate = React.useCallback(
    (coord: number, canvasEdgeCoord: number): number => {
      let newCoord: number;

      // минимально и максимально допустимые координаты центра circle
      const minCoord = radius + canvasOffset;
      const maxCoord = canvasEdgeCoord - radius - canvasOffset;

      if (coord < minCoord) {
        newCoord = minCoord;
      } else if (coord > maxCoord) {
        newCoord = maxCoord;
      } else {
        newCoord = coord;
      }
      return newCoord;
    },
    [radius],
  );

  const dragBoundFunc = React.useCallback(
    (pos: VisualEditorPosition): VisualEditorPosition => ({
      x: getRestrictedCoordinate(pos.x, stageSize.width),
      y: getRestrictedCoordinate(pos.y, stageSize.height),
    }),
    [stageSize],
  );

  const extensionElement = useExtension(extension, props);

  return (
    <GroupWithHOCs
      id={id}
      type={type}
      x={x}
      y={y}
      isContextMenuShow={isContextMenuShow}
      items={contextMenuItems}
      onAction={onGroupAction}
      onAddComponent={onAddComponent}
      onRemoveComponent={onRemoveComponent}
      draggable={!isEditing}
      stageSize={stageSize}
      dragBoundFunc={dragBoundFunc}
      onDblClick={enableEditing}
      onClick={onActionHandler(VisualEditorActions.Click)}
      onMouseUp={onActionHandler(VisualEditorActions.MouseUp)}
    >
      {/* рисуем невидимый круг - чтобы расширить область hover у группы */}
      <ReactKonva.Circle
        radius={radius + defaults.element.referencePointRadius + extendHoverArea}
      />
      {/* сам компонент */}
      <ReactKonva.Group>
        <ReactKonva.Circle
          id={id}
          radius={radius}
          fill={backgroundColor}
          stroke={borderColor}
          shadowColor={defaults.colors.shadowColor}
          shadowOffsetY={2}
          shadowBlur={4}
        />
        {/* Не показываем текст в режиме редактирования */}
        {!isEditing ? (
          <ReactKonva.Text
            // Сместить текст к центру координат на 0.75 радиуса
            x={-0.758 * radius}
            // Поднять текст на 50% радиуса
            y={-0.451 * defaults.font.textSize}
            fill={textColor}
            text={`${text}`}
            width={1.5 * radius}
            fontSize={defaults.font.textSize}
            wrap="none"
            align="center"
            verticalAlign="middle"
            ellipsis
            fontFamily={defaults.font.family}
          />
        ) : null}
      </ReactKonva.Group>

      {/* отрисовываем extension */}
      {extensionElement}
    </GroupWithHOCs>
  );
};

interface CreateCircleOpts {
  id?: string;
  text?: string;
  x?: number;
  y?: number;
  radius?: number;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  contextMenuItems?: ContextMenuItem[];
  onAction?: <T extends object>(action: VisualEditorActions, data: T) => void;
  isReferencePointsShow?: boolean;
  extension?: React.ComponentType;
}

/**
 * Создание элемента "Круг с текстом" со всеми параметрами
 * @param {CreateCircleOpts} opts Опции
 */
export const createCircle = (opts?: CreateCircleOpts): VisualEditorCircle => {
  opts = opts || {};
  const emptyFn = (): void => undefined;

  return {
    type: VisualEditorShapeType.Circle,
    id: opts.id || '',
    extension: opts.extension || null,
    text: opts.text || '',
    backgroundColor: opts.backgroundColor || defaults.colors.circleBackgroundColor,
    borderColor: opts.borderColor || defaults.colors.circleBorderColor,
    textColor: opts.textColor || color.default.white,
    radius: opts.radius || defaults.element.radius,
    x: opts.x,
    y: opts.y,
    contextMenuItems: opts.contextMenuItems || [],
    onAction: opts.onAction || emptyFn,
  };
};

Circle.defaultProps = {
  ...createCircle(),
  onAddComponent: () => (): void => undefined,
  onRemoveComponent: () => (): void => undefined,
};

export default Circle;
