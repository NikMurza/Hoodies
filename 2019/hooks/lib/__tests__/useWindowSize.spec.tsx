import { act, renderHook } from '@testing-library/react-hooks';
import { useWindowSize } from '@common/hooks';

export interface CustomGlobal extends NodeJS.Global {
  innerWidth?: number;
  innerHeight?: number;
}

describe('hooks/useWindowSize', () => {
  const customGlobal: CustomGlobal = global;
  customGlobal.innerWidth = 500;
  customGlobal.innerHeight = 800;

  it('initial size', () => {
    const { result } = renderHook(() => useWindowSize());

    expect(result.current.width).toBe(500);
    expect(result.current.height).toBe(800);
  });

  it('updated innerWidth and innerHeight', () => {
    const { result } = renderHook(() => useWindowSize());

    expect(result.current.width).toBe(500);
    expect(result.current.height).toBe(800);

    act(() => {
      customGlobal.innerWidth = 1000;
      customGlobal.innerHeight = 1000;

      window.dispatchEvent(new Event('resize'));
    });

    expect(result.current.width).toBe(1000);
    expect(result.current.height).toBe(1000);
  });
});
