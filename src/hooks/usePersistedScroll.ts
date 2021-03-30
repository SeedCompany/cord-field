import { RefObject, useEffect, useRef } from 'react';
import {
  useFirstMountState,
  useScroll,
  useScrolling,
  useThrottle,
} from 'react-use';
import { useLocationState } from '../components/Routing';

/**
 * Persists scroll location in history so that that it can be restored when
 * going back.
 * Note that this can only be used on one element on a page currently.
 */
export const usePersistedScroll = (scrollRef: RefObject<HTMLElement>) => {
  const firstRender = useFirstMountState();
  const currentPos = useThrottle(useScroll(scrollRef).y, 200);
  const isScrolling = useScrolling(scrollRef);
  const [{ scroll: savedPos }, setLocationState] = useLocationState({
    scroll: 0,
  });
  // Ref to prevent infinite loop between setting & restoring
  const temp = useRef(0);

  useEffect(() => {
    if (
      savedPos === currentPos || // if there are no changes, don't update scroll pos
      temp.current === savedPos // if we just set state, don't to scroll to it
    ) {
      return;
    }
    temp.current = savedPos;
    scrollRef.current?.scrollTo({ top: savedPos });
  }, [savedPos, currentPos, scrollRef]);

  useEffect(() => {
    if (
      isScrolling || // don't update while scrolling
      firstRender || // ignore on first render to allow effect above to restore state
      savedPos === currentPos || // if there are no changes, don't re-set it again
      temp.current === currentPos // if we've just restored state, don't re-set it again
    ) {
      return;
    }
    temp.current = currentPos;
    setLocationState({ scroll: currentPos });
  }, [setLocationState, currentPos, isScrolling, savedPos, firstRender]);
};
