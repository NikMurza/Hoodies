import Konva from 'konva';
import { renderHook } from '@testing-library/react-hooks';
import { VisualEditorPosition } from '@common/components/lib/types/visual-editor';
import { usePosition, ReactEvent, KonvaEvent } from '../usePosition';

const defaultPosition: VisualEditorPosition = {
  x: 154,
  y: 40000,
};

const resultPosition: VisualEditorPosition = {
  x: 154,
  y: 40000,
};

const stageImplementation = <T extends any>() => {
  return {
    setPointersPositions: (e: ReactEvent<T>) => jest.fn(),
    getPointerPosition: (): VisualEditorPosition => defaultPosition,
    getAbsoluteTransform: () => stageImplementation<T>(),
    copy: () => stageImplementation<T>(),
    invert: () => stageImplementation<T>(),
    point: (position: VisualEditorPosition): VisualEditorPosition => ({
      x: position.x * 2,
      y: position.y / 2,
    }),
  };
};

describe('Visual Editor Hooks / usePosition', () => {
  it('e is ReactEvent', () => {
    const event: ReactEvent<HTMLDivElement> = {} as ReactEvent<HTMLDivElement>;
    const stage = stageImplementation<HTMLDivElement>();

    const { result } = renderHook(() =>
      usePosition<HTMLDivElement>(event, (stage as unknown) as Konva.Stage),
    );

    expect(result.current).toStrictEqual(resultPosition);
  });

  it('e is KonvaEvent', () => {
    const event: KonvaEvent<PointerEvent> = ({
      evt: {},
      currentTarget: {
        getStage: () => stageImplementation<PointerEvent>(),
      },
    } as unknown) as KonvaEvent<PointerEvent>;

    const { result } = renderHook(() => usePosition<PointerEvent>(event));

    expect(result.current).toStrictEqual(resultPosition);
  });
});
