import { noop } from 'lodash';
import { RefObject, useEffect, useState } from 'react';

/** Is HTML element is scrolling? */
export const useScrolling = function (ref: RefObject<HTMLElement>) {
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const currentEl = ref.current;
    if (!currentEl) {
      return noop;
    }
    let timeoutId: number;
    const handleScrollEnd = () => setScrolling(false);
    const handleScroll = function () {
      setScrolling(true);
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(handleScrollEnd, 150);
    };
    currentEl.addEventListener('scroll', handleScroll, false);
    return () => {
      currentEl.removeEventListener('scroll', handleScroll, false);
    };
  }, [ref]);

  return scrolling;
};
