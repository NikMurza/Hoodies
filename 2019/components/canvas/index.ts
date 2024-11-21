import Konva from 'react-konva';
import {
  SemanticLayerLinkType,
  SemanticLayerLinkJoinComparisonOperator,
} from '@common/api/types/workspace/semantic-layer/link';
import { SemanticLayerFieldDataType } from '@common/api/types/workspace/semantic-layer/field';
import { getJoinIconPath, getFieldIconPath } from '@common/api/utils/object';
import shapes from './shapes';

export type KonvaClickEvent = Parameters<
  Exclude<Konva.KonvaNodeEvents['onClick'], undefined>
>[0] & { evt: { layerX: number; layerY: number } };

// Сопоставим вид джойна с иконкой
export const linkJoinTypeToIcon = {
  [SemanticLayerLinkType.LeftOuter]: getJoinIconPath('left'),
  [SemanticLayerLinkType.RightOuter]: getJoinIconPath('right'),
  [SemanticLayerLinkType.Inner]: getJoinIconPath('inner'),
  [SemanticLayerLinkType.FullOuter]: getJoinIconPath('full'),
};

export const operatorMap = {
  [SemanticLayerLinkJoinComparisonOperator.Equal]: '=',
  [SemanticLayerLinkJoinComparisonOperator.NotEqual]: '!=',
  [SemanticLayerLinkJoinComparisonOperator.Greater]: '>',
  [SemanticLayerLinkJoinComparisonOperator.Less]: '<',
  [SemanticLayerLinkJoinComparisonOperator.GreaterEqual]: '>=',
  [SemanticLayerLinkJoinComparisonOperator.LessEqual]: '<=',
};

export const fieldDataTypeIcon = {
  [SemanticLayerFieldDataType.Date]: getFieldIconPath('date'),
  [SemanticLayerFieldDataType.DateTime]: getFieldIconPath('datetime'),
  [SemanticLayerFieldDataType.Decimal]: getFieldIconPath('real'),
  [SemanticLayerFieldDataType.Float]: getFieldIconPath('real'),
  [SemanticLayerFieldDataType.Integer]: getFieldIconPath('number'),
  [SemanticLayerFieldDataType.FloatBinHex]: getFieldIconPath('number'),
  [SemanticLayerFieldDataType.String]: getFieldIconPath('string'),
  [SemanticLayerFieldDataType.Boolean]: getFieldIconPath('string'),
  [SemanticLayerFieldDataType.Variant]: getFieldIconPath('string'),
  [SemanticLayerFieldDataType.Empty]: getFieldIconPath('string'),
};

const Canvas = {
  shapes,
};
export default Canvas;
