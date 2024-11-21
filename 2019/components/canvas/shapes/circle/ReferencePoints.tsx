import * as React from 'react';
import * as ReactKonva from 'react-konva';
import Konva from 'konva';
import * as defaults from '@common/components/lib/canvas/visual-editor/defaults';
import {
  VisualEditorIdentity,
  VisualEditorActions,
  VisualEditorPosition,
} from '@common/components/lib/types/visual-editor';
import { MouseButtons } from '@common/components/lib/types/mouseEvent';
import { EKeysCodes } from '@common/components/lib/types/keyboardEvent';

export const prefixId = 'circle_reference_point';

export interface ReferencePointsProps {
  // Радиус круга, по краям которого рисуются опорные точки
  radius: number;
  onAction?<T extends object>(action: VisualEditorActions, data: T): void;
  id?: string;
}

/**
 * Отрисовывает опорные точки
 * @param props Свойства
 */
const ReferencePoints: React.FC<ReferencePointsProps> = (
  props: ReferencePointsProps,
): JSX.Element => {
  const { radius, onAction, id } = props;

  const [activePointId, setActivePointId] = React.useState(null);

  const quitLinkCreatingMode = ({ keyCode }): void => {
    if (keyCode === EKeysCodes.Esc && activePointId) {
      setActivePointId('');
      onAction && onAction<VisualEditorIdentity>(VisualEditorActions.Select, { id: '' });
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', quitLinkCreatingMode);
    return (): void => document.removeEventListener('keydown', quitLinkCreatingMode);
  }, [activePointId]);

  const changeFillColor = (e: Konva.KonvaEventObject<MouseEvent>, color: string): void => {
    e.target.setAttrs({
      fill: color,
    });
    e.target.draw();
  };

  const onMouseOver = (e: Konva.KonvaEventObject<MouseEvent>): void =>
    changeFillColor(e, defaults.colors.referencePointsHoverColor);

  const onMouseLeave = (e: Konva.KonvaEventObject<MouseEvent>): void =>
    e.target.attrs.id !== activePointId && changeFillColor(e, defaults.colors.referencePointsColor);

  const onClick = (e: Konva.KonvaEventObject<MouseEvent>): void => {
    if (e.evt.button === MouseButtons.Left) {
      setActivePointId(e.target.attrs.id);
      onAction && onAction<VisualEditorIdentity>(VisualEditorActions.Select, { id });
    }
  };

  const onMouseDown = React.useCallback((e: Konva.KonvaEventObject<MouseEvent>): void => {
    e.cancelBubble = true;
    if (e.evt.button === MouseButtons.Left) {
      const { x, y } = e.target.attrs;
      onAction &&
        onAction<VisualEditorIdentity & VisualEditorPosition>(VisualEditorActions.MouseDown, {
          id,
          x,
          y,
        });
    }
  }, []);

  const renderPointAt = (x: number, y: number, id: string): JSX.Element => (
    <ReactKonva.Circle
      id={id}
      radius={defaults.element.referencePointRadius}
      x={x}
      y={y}
      fill={
        id === activePointId
          ? defaults.colors.referencePointsHoverColor
          : defaults.colors.referencePointsColor
      }
      stroke={defaults.colors.referencePointsBorderColor}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      onMouseDown={onMouseDown}
    />
  );

  return (
    <ReactKonva.Group>
      {/* верх */}
      {renderPointAt(0, -radius, `${prefixId}_${id}_1`)}
      {/* право */}
      {renderPointAt(radius, 0, `${prefixId}_${id}_2`)}
      {/* низ */}
      {renderPointAt(0, radius, `${prefixId}_${id}_3`)}
      {/* лево */}
      {renderPointAt(-radius, 0, `${prefixId}_${id}_4`)}
    </ReactKonva.Group>
  );
};

ReferencePoints.defaultProps = {
  onAction: (): void => undefined,
  id: '',
};

export default ReferencePoints;
