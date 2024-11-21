import * as React from 'react';
import './input.less';
import * as defaults from '@common/components/lib/canvas/visual-editor/defaults';
import {
  VisualEditorIdentityPosition,
  VisualEditorRotation,
} from '@common/components/lib/types/visual-editor';
import classNames from 'classnames';

export interface EditInputProps extends VisualEditorIdentityPosition, VisualEditorRotation {
  width?: number;
  height?: number;
  text?: string;
  style?: unknown;
  onComplete?: (text: string) => void;
  onCancel?: () => void;
  className?: string;
}

/**
 * Отрисовывает поле для редактирования текста
 * @param props Свойства
 */
const Input: React.FC<EditInputProps> = (props: EditInputProps): JSX.Element => {
  const { x, y, width, height, rotation, text, style, className, onComplete, onCancel } = props;

  const inputElement = React.useRef<HTMLInputElement>();
  const [inputText, setInputText] = React.useState(text);

  const complete = (): void => {
    onComplete(inputText);
  };

  const cancel = (): void => {
    onCancel();
  };

  // фокус на инпут и двигаем курсор в конец строки
  React.useEffect(() => {
    const input = inputElement.current;
    if (input) {
      input.focus();
      const cursor = input.value ? input.value.length : 0;
      input.selectionStart = cursor;
      input.selectionEnd = cursor;
    }
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    const keyToAction = {
      Enter: complete,
      Escape: cancel,
    };
    if (keyToAction[e.key]) keyToAction[e.key]();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputText(e.target.value);
  };

  const inputWrapperClassName = classNames({
    'edit-input': true,
    [className]: className,
  });

  return (
    <div
      className={inputWrapperClassName}
      style={{
        width,
        height,
        top: y - height / 2,
        left: x - width / 2,
        transform: `rotate(${rotation ?? 0}deg)`,
      }}
    >
      <input
        ref={inputElement}
        type="text"
        value={inputText}
        onKeyDown={onKeyDown}
        onBlur={complete}
        onChange={onChange}
        style={style}
      />
    </div>
  );
};

Input.defaultProps = {
  width: defaults.element.editInputWidth,
  height: defaults.element.editInputHeight,
  onComplete: (): void => undefined,
  onCancel: (): void => undefined,
};

export default Input;
