import * as React from 'react';
import classNames from 'classnames';
import * as defaults from '@common/components/lib/canvas/visual-editor/defaults';
import Toolbar from '@common/components/lib/rich/toolbar/Toolbar';
import {
  VisualEditorActionCallback,
  VisualEditorActions,
} from '@common/components/lib/types/visual-editor';
import { WithTranslation } from 'react-i18next';
import { getActionIconPath } from '@common/api/utils/object';
import { withTranslationEx } from '@common/hocs';
import { IToolbarItem } from '@common/components/lib/rich/toolbar/ToolbarItem';
import { toRange } from '@common/utils/math';
import './ZoomPanel.less';

export enum EZoomPanelItems {
  Preview = 'preview',
  FitAll = 'fit-all',
  FitObject = 'fit-object',
  Plus = 'plus',
  Minus = 'minus',
  Zoom = 'zoom',
}

export enum ZoomTo {
  All = 0,
  Selected = -1,
}

export type ZoomDataParameter = number | ZoomTo;

interface OwnProps {
  haveItems: boolean;
  haveSelectedItem: boolean;
  zoom: number;
  className?: string;
  style?: React.CSSProperties;
  zoomMin?: number;
  zoomMax?: number;
  zoomStepByWheel?: number;
  zoomStepByButtons?: number;
  wheelZoomRef?: React.RefObject<HTMLElement>;
  onAction: VisualEditorActionCallback<ZoomDataParameter>;
}

export type Props = OwnProps & WithTranslation;

type ZoomData = Required<
  Pick<OwnProps, 'zoom' | 'zoomMax' | 'zoomMin' | 'zoomStepByWheel' | 'zoomStepByButtons'>
>;

export const ZoomPanel: React.FC<Props> = ({
  t,
  className,
  style,
  haveItems,
  haveSelectedItem,
  zoom,
  zoomMin = defaults.canvas.zoom.min,
  zoomMax = defaults.canvas.zoom.max,
  zoomStepByWheel = defaults.canvas.zoom.step,
  zoomStepByButtons = defaults.canvas.zoom.step,
  wheelZoomRef,
  onAction,
}) => {
  const cssPrefix = 'visual-editor-zoom-panel';

  const zoomData = React.useRef<ZoomData>();

  React.useEffect(() => {
    zoomData.current = { zoom, zoomMax, zoomMin, zoomStepByWheel, zoomStepByButtons };
  }, [zoom, zoomMax, zoomMin, zoomStepByWheel, zoomStepByButtons]);

  const handleZoomChange = React.useCallback(
    (delta: number) => {
      const newZoom = toRange(
        zoomData.current.zoom + delta,
        zoomData.current.zoomMin,
        zoomData.current.zoomMax,
      );
      onAction(VisualEditorActions.Zoom, newZoom);
    },
    [zoomData, onAction],
  );

  const handleZoomReset = React.useCallback((): void => {
    onAction(VisualEditorActions.Zoom, 1);
  }, [onAction]);

  const handleToolbarClick = React.useCallback(
    (event, id: string): void => {
      const buttonActions = {
        [EZoomPanelItems.FitAll]: (): void => onAction(VisualEditorActions.Zoom, ZoomTo.All),
        [EZoomPanelItems.FitObject]: (): void =>
          onAction(VisualEditorActions.Zoom, ZoomTo.Selected),
        [EZoomPanelItems.Plus]: (): void => handleZoomChange(zoomStepByButtons),
        [EZoomPanelItems.Minus]: (): void => handleZoomChange(-zoomStepByButtons),
        [EZoomPanelItems.Zoom]: handleZoomReset,
      };

      const buttonAction = buttonActions[id];
      if (buttonAction) {
        buttonAction();
      }
    },
    [handleZoomChange, handleZoomReset],
  );

  const handleWheel = React.useCallback(
    ({ deltaY }: WheelEvent | React.WheelEvent<HTMLElement>) =>
      handleZoomChange(-Math.sign(deltaY) * zoomStepByWheel),
    [handleZoomChange],
  );

  // eslint-disable-next-line consistent-return
  React.useEffect(() => {
    if (wheelZoomRef?.current) {
      wheelZoomRef.current.addEventListener('wheel', handleWheel);

      return (): void => {
        wheelZoomRef.current.removeEventListener('wheel', handleWheel);
      };
    }
  }, [wheelZoomRef]);

  const leftItems = React.useMemo<IToolbarItem[]>(
    () => [
      {
        id: EZoomPanelItems.FitAll,
        title: t(`FitAll`),
        icon: getActionIconPath(EZoomPanelItems.FitAll),
        disabled: !haveItems,
      },
      {
        id: EZoomPanelItems.FitObject,
        title: t(`FitObject`),
        icon: getActionIconPath(EZoomPanelItems.FitObject),
        disabled: !haveSelectedItem,
      },
      {
        divider: true,
      },
      {
        id: EZoomPanelItems.Plus,
        icon: getActionIconPath(EZoomPanelItems.Plus),
        disabled: zoom >= zoomMax,
      },
      {
        id: EZoomPanelItems.Minus,
        icon: getActionIconPath(EZoomPanelItems.Minus),
        disabled: zoom <= zoomMin,
      },
    ],
    [haveItems, haveSelectedItem, zoom, zoomMax, zoomMin, t],
  );

  const rightItems = React.useMemo<IToolbarItem[]>(() => {
    const zoomValue = (zoom * 100).toFixed(0);
    return [
      {
        title: zoom !== 1 ? t('BackToDefault') : undefined,
        id: EZoomPanelItems.Zoom,
        label: `${zoomValue}%`,
      },
    ];
  }, [t, zoom]);

  const cssClasses = React.useMemo(
    () =>
      classNames({
        [`${cssPrefix}`]: true,
        [className]: !!className,
      }),
    [className],
  );

  return (
    <div className={cssClasses} onWheel={handleWheel} style={style}>
      <Toolbar items={leftItems} rightItems={rightItems} onClick={handleToolbarClick} />
    </div>
  );
};

export default withTranslationEx('zoom', { fallback: false })(ZoomPanel);
