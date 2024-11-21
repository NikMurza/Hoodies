import * as React from 'react';
import Konva from 'konva';
// eslint-disable-next-line import/no-unresolved
import { IFrame } from 'konva/types/types';
import * as ReactKonva from 'react-konva';
import { useGetStage } from '@common/components/lib/canvas/hooks/useGetStage';
import { useGetZoom } from '@common/components/lib/canvas/hooks/useGetZoom';
import { useThrottle } from '@common/hooks';

const isDevelopment = process.env.NODE_ENV !== 'production';

function useFPS(stageRef: React.RefObject<ReactKonva.Stage>): JSX.Element {
  const stage = useGetStage(stageRef);
  const textRef = React.useRef<Konva.Text>(null);

  const updateFps = useThrottle((frame: IFrame): void => {
    const FPS = frame?.frameRate ?? 0;
    const formatted = FPS.toFixed(0).padStart(2, '0');

    textRef.current.text(formatted);
  }, 100);

  React.useEffect((): void => {
    const animation: Konva.Animation = new Konva.Animation((frame: IFrame): void => {
      if (!stage || !textRef.current) {
        return;
      }

      updateFps(frame);

      const zoom = useGetZoom(stageRef);
      const x = (-stage.x() + 5) / zoom;
      const y = (-stage.y() + 5) / zoom;

      const text = textRef.current;

      text.x(x);
      text.y(y);
      text.fontSize(12 / zoom);
    }, textRef?.current?.getLayer());

    animation.start();
  }, [textRef, textRef.current]);

  if (!isDevelopment) {
    return null;
  }

  return (
    <ReactKonva.Layer listening={false}>
      <ReactKonva.Text
        ref={textRef}
        align="left"
        fill="gray"
        fontFamily="monospace"
        fontStyle="normal"
      />
    </ReactKonva.Layer>
  );
}

export default useFPS;
