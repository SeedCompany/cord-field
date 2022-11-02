import { Promisable } from 'type-fest';
import { Nullable } from './types';

/**
 * Create a new function which calls all functions given.
 *
 * @example
 * const paintWall = (color: string) => {};
 * const paintCeiling = (color: string) => {};
 * const paintHouse = callAll(paintWall, paintCeiling);
 * paintHouse('white');
 *
 *
 * @example Functions can be null/false to skip to help with conditionals.
 * callAll(
 *   ifThing ? conditionalFn : null,
 *   ifThing && conditionalFn,
 * )
 */
export const callAll =
  <Args extends any[]>(
    ...fns: Array<Nullable<(...args: Args) => void> | false>
  ) =>
  (...args: Args) => {
    for (const fn of fns) {
      if (!fn) {
        continue;
      }
      fn(...args);
    }
  };

/**
 * Create a new function which calls each function given
 * and returns the first one with a truthy result.
 *
 * @example
 * const verifyEmail = callSome(
 *   verifyString,
 *   verifyLength,
 *   verifyRegexFormat,
 * );
 * const maybeError = verifyEmail('');
 *
 * @example Functions can be null/false to skip to help with conditionals.
 * callSome(
 *   ifThing ? conditionalFn : null,
 *   ifThing && conditionalFn,
 * )
 */
export const callSome =
  <Args extends any[], Return>(
    ...fns: Array<Nullable<(...args: Args) => Return> | false>
  ) =>
  (...args: Args): Return | undefined => {
    for (const fn of fns) {
      if (!fn) {
        continue;
      }
      const result = fn(...args);
      if (result) {
        return result;
      }
    }
  };

/**
 * Similar to its sync-counterpart but for async functions.
 * With this one, you have to choose the execution algorithm.
 */
export const callSomeAsync = <Args extends any[], Return>(
  ...fns: Array<Nullable<((...args: Args) => Promisable<Return>) | false>>
) => {
  const cleaned = fns.filter(Boolean) as Array<(...args: Args) => Return>;
  return {
    /**
     * Async functions are started all at once, and the first one that resolves
     * a truthy value is returned.
     *
     * Use this when you don't mind executing all functions and want the fastest result.
     */
    race: async (...args: Args): Promise<Return | undefined> => {
      const results: Return[] = [];
      const running = new Set<Promise<Return>>();
      for (const fn of cleaned) {
        const promise = Promise.resolve(fn(...args));
        running.add(promise);
        void promise.then((result: Return) => {
          running.delete(promise);
          results.push(result);
        });
      }
      do {
        await Promise.race(running.values());
        while (results.length > 0) {
          const result = results.shift();
          if (result) {
            return result;
          }
        }
      } while (running.size > 0);
      return undefined;
    },

    /**
     * Async functions are started all at once.
     * After all resolves, the first truthy result found from the order of
     * functions specified is returned.
     *
     * Use this when you don't mind executing all functions, but want the order
     * enforced.
     */
    parallel: async (...args: Args): Promise<Return | undefined> => {
      const results = await Promise.all(cleaned.map((fn) => fn(...args)));
      return results.find(Boolean);
    },

    /**
     * Similar to its sync-counterpart but for async functions.
     *
     * Async functions are called one by one, and the first truthy result is returned.
     *
     * Use this when you don't want latter functions to be called if a former passes,
     * and don't mind the slower execution time.
     */
    sequential: async (...args: Args): Promise<Return | undefined> => {
      for await (const fn of cleaned) {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        const result = await fn(...args);
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (result) {
          return result;
        }
      }
      return undefined;
    },
  };
};
