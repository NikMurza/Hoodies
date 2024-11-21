import { Circle, Group, Layer, Rect, Text } from 'react-konva';
import Block from '@common/components/lib/canvas/shapes/block/Block';
import CustomCircle from '@common/components/lib/canvas/shapes/circle/Circle';
import Line from '@common/components/lib/canvas/shapes/line/Line';
import { VisualEditorShapeType } from '@common/components/lib/types/visual-editor';
import Menu from './menu/Menu';
import Stage from './stage/Stage';
import UrlImage from './url-image/UrlImage';
import Grid from './grid/Grid';

const shapes = {
  Stage,
  Menu,
  UrlImage,
  Block,
  Layer,
  Circle,
  Group,
  Rect,
  Text,
  Grid,
};

export default shapes;

export const mapTypeToComponent = {
  [VisualEditorShapeType.Circle]: CustomCircle,
  [VisualEditorShapeType.Group]: Group,
  [VisualEditorShapeType.Rect]: Rect,
  [VisualEditorShapeType.Text]: Text,
  [VisualEditorShapeType.Block]: Block,
  [VisualEditorShapeType.Line]: Line,
  [VisualEditorShapeType.Grid]: Grid,
};
