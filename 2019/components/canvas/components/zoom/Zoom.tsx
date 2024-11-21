import * as React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import classNames from 'classnames';
import * as defaults from '@common/components/lib/canvas/visual-editor/defaults';
import Button from '@common/components/lib/controls/button/Button';
import SVGIcon from '@common/components/lib/controls/svg-icon/SVGIcon';
import Hint from '@common/components/lib/controls/hint/Hint';
import { VisualEditorPosition } from '@common/components/lib/types/visual-editor';
import { getActionIconPath } from '@common/api/utils/object';
import './Zoom.less';

export enum DisplayType {
  Controls,
  ValueButton,
}

export interface ZoomProps extends WithTranslation {
  position: VisualEditorPosition;
  zoom: number;
  onChange(zoom: number): void;
  /** Целевой контейнер для зума */
  container?: HTMLElement;
  min?: number;
  max?: number;
  step?: number;
  displayType?: DisplayType;
  className?: string;
  /**
   * Зумирование происходит только если курсор на свободной области канвы
   */
  zoomOnFreeAreaOnly?: boolean;
}

const cls = 'visual-editor__zoom';

export const Zoom: React.FC<ZoomProps> = (props: ZoomProps): JSX.Element => {
  const {
    position,
    zoom,
    onChange,
    displayType,
    className,
    t,
    container,
    min,
    max,
    step,
    zoomOnFreeAreaOnly,
  } = props;

  const [isCtrlPressed, setIsCtrlPressed] = React.useState(false);
  const [isShiftPressed, setIsShiftPressed] = React.useState(false);
  const [isAltPressed, setIsAltPressed] = React.useState(false);

  const [isModifierPressed, setIsModifierPressed] = React.useState(false);

  const onKeydown = React.useCallback((e: KeyboardEvent): void => {
    setIsCtrlPressed(e.ctrlKey);
    setIsShiftPressed(e.shiftKey);
    setIsAltPressed(e.altKey);

    setIsModifierPressed(e.ctrlKey || e.shiftKey || e.altKey);

    if (e.key === 'Control' || e.key === 'Shift' || e.key === 'Alt') {
      e.preventDefault();
    }
  }, []);

  const onKeyup = React.useCallback((): void => {
    setIsCtrlPressed(false);
    setIsShiftPressed(false);
    setIsAltPressed(false);

    setIsModifierPressed(false);
  }, []);

  React.useEffect(() => {
    document.addEventListener('keydown', onKeydown);
    return (): void => {
      document.removeEventListener('keydown', onKeydown);
    };
  }, []);

  React.useEffect(() => {
    document.addEventListener('keyup', onKeyup);
    return (): void => {
      document.removeEventListener('keyup', onKeyup);
    };
  }, []);

  const onZoomPlus = (): void => {
    const newValue = Math.round((zoom + step) * 100) / 100;
    onChange(Math.min(newValue, max));
  };

  const onZoomMinus = (): void => {
    const newValue = Math.round((zoom - step) * 100) / 100;
    onChange(Math.max(newValue, min));
  };

  const onWheel = React.useCallback(
    (e: React.WheelEvent<HTMLElement> | WheelEvent): void => {
      const { deltaY, deltaX } = e;
      if (deltaX || isModifierPressed) return;
      if (deltaY >= 0) {
        onZoomMinus();
      } else {
        onZoomPlus();
      }
    },
    [zoom, isModifierPressed],
  );

  const onWheelListener = React.useCallback(
    (e: WheelEvent): void => {
      // разрешаем масштабировать только когда курсор на свободной области канваса
      if (zoomOnFreeAreaOnly && (e.target as HTMLElement).closest('.visual-canvas__components')) {
        e.preventDefault();
        return;
      }

      // preventDefault, запрещающий скролл, не должен вызываться на onWheel кнопки со значением,
      // поэтому вынесен отдельно
      if (!isModifierPressed) {
        e.preventDefault();
      }
      onWheel(e);
    },
    [zoomOnFreeAreaOnly, zoom, isModifierPressed],
  );

  const toDefaultValue = (): void => {
    onChange(1);
  };

  React.useEffect(() => {
    container?.addEventListener('wheel', onWheelListener);
    return (): void => {
      container?.removeEventListener('wheel', onWheelListener);
    };
  }, [container, zoom, isModifierPressed]);

  const x = position?.x ?? 0;
  const y = position?.y ?? 0;
  const style: React.CSSProperties = {
    top: y > 0 ? y : undefined,
    bottom: y < 0 ? -y : undefined,
    left: x > 0 ? x : undefined,
    right: x < 0 ? -x : undefined,
  };

  const valueButtonClass = classNames({
    [`${cls}-value-button`]: true,
    [`${cls}-value-button_alt`]: isAltPressed,
    [`${cls}-value-button_shift`]: isShiftPressed,
    [`${cls}-value-button_ctrl`]: isCtrlPressed,
  });

  const renderZoomComponent = (): JSX.Element => {
    const components = {
      [DisplayType.Controls]: (
        <div className={`${cls}__controls`}>
          <Button onClick={onZoomPlus} icon className={`${cls}-button`} size="S">
            <SVGIcon src={getActionIconPath('plus')} />
          </Button>
          <Button
            onClick={onZoomMinus}
            icon
            className={`${cls}-button ${cls}-button-padding`}
            size="S"
          >
            <SVGIcon src={getActionIconPath('minus')} />
          </Button>
        </div>
      ),
      [DisplayType.ValueButton]: (
        <div className={`${cls}__value-button`} onWheel={onWheel}>
          <Hint
            position="top"
            trigger="hover"
            tooltip={t('BackToDefault')}
            withArrow
            tooltipClassName={classNames('ui-hint_small-arrow', {
              'ui-hint_hidden': zoom === 1,
            })}
            triggerClassName="ui-hint_trigger-full-height"
          >
            <Button outline color="default" className={valueButtonClass} onClick={toDefaultValue}>
              {`${Math.round(zoom * 100)}%`}
            </Button>
          </Hint>
        </div>
      ),
    };
    return components[displayType];
  };

  return (
    <div className={classNames(cls, className)} style={style}>
      {renderZoomComponent()}
    </div>
  );
};

Zoom.defaultProps = {
  min: defaults.canvas.zoom.min,
  max: defaults.canvas.zoom.max,
  step: defaults.canvas.zoom.step,
  displayType: DisplayType.Controls,
};

export default withTranslation('zoom')(Zoom);
