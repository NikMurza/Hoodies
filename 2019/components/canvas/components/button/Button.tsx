import * as React from 'react';
import classNames from 'classnames';
import CommonButton from '@common/components/lib/controls/button/Button';
import SVGIcon from '@common/components/lib/controls/svg-icon/SVGIcon';

export enum ButtonType {
  Cursor = 'cursor',
  Chart = 'donut_chart',
  Text = 'text',
  Table = 'grid',
  Pie = 'pie',
  Donut = 'donut',
  Column = 'barchart',
  Bar = 'bar',
  Polar = 'polar',
  Line = 'line',
  Area = 'area',
  Delete = 'delete',
  Frame = 'frame_empty',
  SyncOn = 'sync_on',
  SyncOff = 'sync_off',
}

export enum ActiveColor {
  White = 'white',
  Blue = 'blue',
}

export interface ButtonProps {
  type: ButtonType;
  isActive: boolean;
  onClick?: (type: ButtonType) => void;
  className?: string;
  activeColor?: ActiveColor;
}

const Button: React.FC<ButtonProps> = (props: ButtonProps): JSX.Element => {
  const { isActive, type, onClick, className, activeColor } = props;
  const customActiveClass = className ? ` ${className}_active` : '';
  const activeClasses = `button-active_${activeColor}${customActiveClass}`;
  const handleClick = (): void => onClick(type);
  return (
    <CommonButton
      icon
      className={classNames(className, {
        [activeClasses]: isActive,
      })}
      onClick={handleClick}
    >
      <SVGIcon src={require(`@common/components/lib/assets/images/icons/${type}.svg`)} />
    </CommonButton>
  );
};

Button.defaultProps = {
  className: '',
  activeColor: ActiveColor.Blue,
  onClick: (): void => undefined,
};

export default Button;
