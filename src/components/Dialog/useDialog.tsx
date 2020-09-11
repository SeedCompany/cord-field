import { SyntheticEvent, useCallback, useMemo, useState } from 'react';

export function useDialog<T = never>() {
  const [isOpen, setOpen] = useState(false);
  const [item, setItem] = useState<T | undefined>(undefined);
  const show = useCallback((item: T) => {
    // Don't store events. This allows the show function to be passed directly
    // as an event handler.
    const isEvent =
      item &&
      typeof ((item as unknown) as SyntheticEvent).persist === 'function';
    if (!isEvent) {
      setItem(item);
    }
    setOpen(true);
  }, []) as ShowFn<T>;
  const state = useMemo(
    () => ({
      open: isOpen,
      onClose: () => setOpen(false),
      onExited: () => setItem(undefined),
    }),
    [isOpen]
  );
  return [state, show, item] as const;
}

type ShowFn<T> = [T] extends [never] ? () => void : (item: T) => void;
