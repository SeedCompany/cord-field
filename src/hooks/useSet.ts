/* eslint-disable react-hooks/exhaustive-deps */
import { useLatest } from 'ahooks';
import { useMemo, useState } from 'react';
import { Merge } from 'type-fest';

export type SetHook<T> = Merge<Set<T>, SetModifiers<T>>;
export interface SetModifiers<T> {
  /**
   * Add item to the set.
   * No change if the item already exists, which the return value conveys.
   */
  readonly add: (item: T) => boolean &
    // Not really, just so this can be typed as Set<T>
    Set<T>;
  /**
   * Alias of {@link delete}.
   */
  readonly remove: (item: T) => boolean;
  /**
   * Remove an item from the set.
   * No change if the item already exists, which the return value conveys.
   */
  readonly delete: (item: T) => boolean;
  /**
   * Toggle adding/removing an item from the set.
   * Optionally, explicitly state if the value should be added/removed with the `next` arg.
   * No change if the item already exists, which the return value conveys.
   */
  readonly toggle: (item: T, next?: boolean) => boolean;
  /**
   * Replace the entries with the ones given here.
   * This always produces an identity change, even if the entry values are the same.
   */
  readonly set: (items: Iterable<T>) => void;
  /**
   * Remove all the entries.
   * No change if the set is already empty.
   */
  readonly clear: () => void;
  /**
   * Reset the entries to the ones given in the hook creation.
   * This always produces an identity change, even if the entry values are the same.
   */
  readonly reset: () => void;
}

/**
 * Provides a Set in React state.
 *
 * Each change produces a new Set.
 * However, the modifier functions (their identities) don't change
 * and will always reference the current entries when needed.
 *
 * We do differ with `add()` return value, though.
 * It returns whether an entry was added instead of returning `this`.
 */
export function useSet<T>(initialValue?: Iterable<T>): SetHook<T> {
  const getInitValue = useLatest(() => new Set<T>(initialValue));
  const [current, set] = useState(getInitValue.current);
  const ref = useLatest(current);

  const modifiers = useMemo((): SetModifiers<T> => {
    const toggle = (item: T, next?: boolean) => {
      // Keeping this found check independent of the setter scope below.
      // React handles when it should be called and it could be not synchronous.
      const found = ref.current.has(item);

      set((prev) => {
        // Check again here, because maybe prev has changed, and we don't want
        // to change identity redundantly.
        const currentlyIn = prev.has(item);
        next = next ?? !currentlyIn;
        if ((next && currentlyIn) || (!next && !currentlyIn)) {
          return prev;
        }

        const temp = new Set(prev);
        temp[next ? 'add' : 'delete'](item);
        return temp;
      });

      return found;
    };
    return {
      toggle,
      add: (item) => toggle(item, true) as any,
      remove: (item) => toggle(item, false),
      delete: (item) => toggle(item, false),
      set: (items) => set(new Set(items)),
      reset: () => set(getInitValue.current),
      clear: () => set((prev) => (prev.size === 0 ? prev : new Set())),
    };
  }, []);

  return useMemo(() => Object.assign(current, modifiers), [current]);
}
