import { useEffect, useRef, useState } from 'react';

const isBrowser = typeof window !== 'undefined';

const useWindowSize = (initialWidth = Infinity, initialHeight = Infinity) => {
  const frame = useRef(0);
  const [state, setState] = useState<{ width: number; height: number }>({
    width: isBrowser ? window.innerWidth : initialWidth,
    height: isBrowser ? window.innerHeight : initialHeight,
  });

  useEffect((): (() => void) | void => {
    if (isBrowser) {
      const handler = () => {
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
          setState({
            width: window.innerWidth,
            height: window.innerHeight,
          });
        });
      };

      window.addEventListener('resize', handler);

      return () => {
        cancelAnimationFrame(frame.current);
        window.removeEventListener('resize', handler);
      };
    }
  }, []);

  return state;
};
export default useWindowSize;
