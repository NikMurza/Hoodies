import Konva from 'konva';

export function useIsStage<T extends Event>(): (e: Konva.KonvaEventObject<T>) => boolean {
  return (e): boolean => e?.target?.getType() === 'Stage';
}
