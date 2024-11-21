import * as React from 'react';
import { Size } from './types';

export default function useWindowSize(): Size {
  function getSize(): Size {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  const [windowSize, setWindowSize] = React.useState<Size>(getSize);

  React.useEffect(() => {
    function handleResize(): void {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return (): void => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}
