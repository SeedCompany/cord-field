import { noop } from 'lodash';
import { useEffect } from 'react';

/**
 * Same as useEffect on client, but on SSR the effect is called inline.
 * This makes it good for logic that is ran immediately after receiving API data.
 */
export const useIsomorphicEffect: typeof useEffect =
  typeof window === 'undefined' ? (effect) => effect() : useEffect;

/**
 * Immediately called on server, but never called on client
 */
export const useSsrEffect: typeof useEffect =
  typeof window === 'undefined' ? (effect) => effect() : noop;
