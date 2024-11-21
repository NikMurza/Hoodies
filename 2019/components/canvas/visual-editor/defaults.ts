import colorsConst from '@common/styles/constants/colors';
import fontConst from '@common/styles/constants/fonts';
import { VisualEditorSize } from '@common/components/lib/types/visual-editor';

interface ScaleDefaults {
  initial: number;
  min: number;
  max: number;
  step: number;
}
export interface CanvasDefaults {
  size: VisualEditorSize;
  gridCell: number;
  gridLineWidth: number;
  canvasOffset: number;
  zoom: ScaleDefaults;
}

// измерения холста
export const canvas: CanvasDefaults = {
  size: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  gridCell: 96, // сторона ячейки сетки
  gridLineWidth: 1,
  canvasOffset: 24, // минимально допустимое расстояние от края холста до элемента,
  zoom: {
    initial: 1,
    min: 0.1,
    max: 4,
    step: 0.1,
  },
};

// размер элемента по-умолчанию
export const element = {
  width: 200,
  height: 100,
  indent: 100, // размер отступа (по-умолчанию) между элементами
  radius: 60, // Радиус элемента (по-умолчанию)
  borderRadius: 0,
  borderWidth: 1,
  referencePointRadius: 6,
  editInputWidth: 100,
  editInputHeight: 24,
};

export const line = {
  borderWidth: 2,
  hoverWidth: 20,
  endpointLength: 11.5,
  endpointWidth: 10,
  iconRadius: 16,
};

export const font = {
  family: fontConst.family,
  textSize: 14,
  accentTextSize: 16,
  secondaryTextSize: 13,
};

export const colors = {
  backgroundColor: colorsConst.white,
  transparent: 'transparent',
  gridLinesColor: '#ECEDEF',
  shadowColor: '#cccccc',
  canvas: '#F2F3F4',
  circleColor: '#9DAFED',
  circleBackgroundColor: '#A469AD',
  circleBorderColor: '#8B5A94',
  circleActiveBackgroundColor: '#3B5EDC',
  circleActiveBorderColor: '#FFFFFF',
  subTextColor: '#93989E',
  sourceTypeColor: colorsConst.green,
  destTypeColor: '#59BDF8',
  convertorTypeColor: '#FFC700',
  blockShadowColor: 'rgba(115,115,115,0.12)',
  blockActiveColor: colorsConst.blue,
  borderColor: colorsConst.darkAdditional,
  referencePointsColor: colorsConst.white,
  referencePointsHoverColor: colorsConst.blue,
  referencePointsBorderColor: colorsConst.blue,
  iconSettingBackgroundColor: colorsConst.white,
  iconSettingColor: colorsConst.white,
};
