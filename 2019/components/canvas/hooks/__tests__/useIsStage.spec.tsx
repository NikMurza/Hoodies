import { renderHook } from '@testing-library/react-hooks';
import Konva from 'konva';
import { useIsStage } from '../useIsStage';

const stageEvent = {
  target: {
    getType: () => 'Stage',
  },
};

const notStageEvent = {
  target: {
    getType: () => 'NotStage',
  },
};

describe('Visual Editor Hooks / useIsStage', () => {
  it('test', () => {
    const { result } = renderHook(() => useIsStage());

    expect(result.current(stageEvent as Konva.KonvaEventObject<any>)).toBe(true);
    expect(result.current(notStageEvent as Konva.KonvaEventObject<any>)).toBe(false);
  });
});
