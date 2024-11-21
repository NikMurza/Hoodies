import * as ReactKonva from 'react-konva';
import * as defaults from '@common/components/lib/canvas/visual-editor/defaults';
import * as React from 'react';
import { VisualEditorEndpoint } from '@common/components/lib/types/visual-editor';
import { useCallback, useState } from 'react';

const EndpointCircle: React.FC<VisualEditorEndpoint> = (props) => {
  const {
    location,
    style: { theme, hoverTheme },
    onMouseDown,
    hitStrokeWidth,
  } = props;

  const [isHovered, setIsHovered] = useState(false);

  const onMouseIn = useCallback(() => {
    setIsHovered(true);
  }, []);

  const onMouseOut = useCallback(() => {
    setIsHovered(false);
  }, []);

  const currentTheme = hoverTheme && isHovered ? { ...theme, ...hoverTheme } : theme;

  return (
    <ReactKonva.Circle
      radius={currentTheme.radius || defaults.element.referencePointRadius}
      x={location.x}
      y={location.y}
      fill={currentTheme.backgroundColor}
      stroke={currentTheme.borderColor}
      strokeWidth={currentTheme.borderWidth}
      onMouseEnter={onMouseIn}
      onMouseOut={onMouseOut}
      onMouseDown={onMouseDown}
      hitStrokeWidth={hitStrokeWidth}
    />
  );
};

export default EndpointCircle;
