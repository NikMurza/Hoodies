import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';
import { VisualEditorLocation } from '@common/components/lib/types/visual-editor';

export interface WithResizeable {
  resizeableRef: React.Ref<HTMLDivElement>;
}

export interface WithResizeDetectProps {
  id?: string;
  onResize: (size: VisualEditorLocation) => void;
}

const WithResizeDetect = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
): React.FC<Omit<P, keyof WithResizeable> & WithResizeDetectProps> => (
  props: WithResizeDetectProps,
): JSX.Element => {
  const { id, onResize, ...restProps } = props;

  const componentRef = React.useRef<HTMLDivElement>(null);

  const onComponentResize = React.useCallback(
    (width: number, height: number) => {
      const rect = componentRef.current?.getBoundingClientRect();
      const x = rect?.x ?? 0;
      const y = rect?.y ?? 0;

      onResize({
        id,
        x,
        y,
        width,
        height,
      });
    },
    [onResize],
  );

  return (
    <ReactResizeDetector handleWidth handleHeight onResize={onComponentResize}>
      {({ targetRef }): JSX.Element => {
        componentRef.current = targetRef.current;
        return <WrappedComponent {...(restProps as P)} resizeableRef={targetRef} />;
      }}
    </ReactResizeDetector>
  );
};

export default WithResizeDetect;
