import { useCallback, useMemo, useState } from 'react';

export interface DialogState {
  open: boolean;
  onClose: () => void;
  onExited: () => void;
}

export function useDialog<T = never>(): readonly [
  DialogState,
  ShowFn<T>,
  T | undefined
] {
  const [isOpen, setOpen] = useState(false);
  const [item, setItem] = useState<T | undefined>(undefined);
  const show = useCallback((item: T) => {
    setItem(item);
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
