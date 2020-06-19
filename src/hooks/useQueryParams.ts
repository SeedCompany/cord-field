import { compact, omit, pick, pickBy } from 'lodash';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  decodeDelimitedArray,
  DecodedValueMap,
  decodeQueryParams,
  encodeDelimitedArray,
  encodeQueryParams,
  QueryParamConfig,
  QueryParamConfigMap,
  StringParam,
} from 'serialize-query-params';

export { withDefault, NumberParam, StringParam } from 'serialize-query-params';

// This is a list param that encodes with commas.
// It also doesn't empty list in the url.
export const ListParam: QueryParamConfig<string[] | undefined> = {
  encode: (val) => encodeDelimitedArray(val, ',') || undefined,
  decode: (val) => compact(decodeDelimitedArray(val, ',')),
};

// This is a boolean param, but it doesn't put the default value in the url.
export const BooleanParam = (
  defaultVal = false
): QueryParamConfig<boolean | undefined> => ({
  encode: (val) => (val == null || val === defaultVal ? '' : val ? '1' : '0'),
  decode: (val) => (val === '1' ? true : val === '0' ? false : undefined),
});

// This is just a list param, but is typed as T[]. Useful for string literals.
export const EnumListParam = <T extends string>() =>
  (ListParam as unknown) as QueryParamConfig<T[]>;

// This is just a string param, but is typed as T. Useful for string literals.
export const EnumParam = <T extends string>() =>
  (StringParam as unknown) as QueryParamConfig<T>;

interface QueryChangeOptions {
  // Whether to push a new history state or replace the existing one.
  // We replace by default here since that's more common with query params.
  push?: boolean | undefined;
  state?: object | null | undefined;
}

/**
 * Creates a query/search param hook with a defined schema.
 *
 * This creates a hook which means the config/schema cannot be changed
 * at runtime but we also don't have to check for that so it's more performant.
 *
 * Multiple hooks can be used at once. The setter only changes the values
 * defined by the hooks schema. The setter itself does not allow partial sets.
 * Basically it works just like `useState`.
 *
 * By default, the setter replaces the current history entry instead of pushing
 * a new one. This default is the opposite of react-router's defaults, but I
 * think it makes more sense here for query parameter handling.
 *
 * @example
 * const useColorState = makeQueryHandler({
 *   name: StringParam,
 *   red: NumberParam,
 *   green: NumberParam,
 *   blue: NumberParam,
 *   favorite: BooleanParam(),
 * });
 * export const MyComponent = () => {
 *   const [color, setColor] = useColorState();
 *   color.name // string | undefined
 *   color.red // number | undefined
 * };
 *
 * Each value of the schema is an object that defines encode & decode functions.
 * This makes it easy to have custom handling and abstract it.
 *
 *
 * This integrates `react-router` v6 with the `serialize-query-params` library.
 * This is essentially what `use-query-params` library does, but it isn't updated
 * for RR v6. RR v6 includes more OOTB in this area so only thin wrapper is needed.
 */
export const makeQueryHandler = <QPCMap extends QueryParamConfigMap>(
  paramConfigMap: QPCMap
) => () => {
  const [search, setNext] = useSearchParams();

  const query = useMemo(() => {
    const toObj = Object.fromEntries(search);
    const filtered = pick(toObj, Object.keys(paramConfigMap));
    const decoded = decodeQueryParams(paramConfigMap, filtered as any);
    return decoded;
  }, [search]);

  const setQuery = useCallback(
    (
      next: Partial<DecodedValueMap<QPCMap>>,
      options: QueryChangeOptions = {}
    ) => {
      const encoded = encodeQueryParams(paramConfigMap, next);
      // filter out falsy values to keep url clean
      const filtered = pickBy(encoded as Record<string, string>);

      // Merge in unrelated query params so they are preserved
      const unrelated = omit(
        Object.fromEntries(search),
        Object.keys(paramConfigMap)
      );
      const merged = { ...unrelated, ...filtered };

      const nextSearch = new URLSearchParams(merged);
      const { push, state } = options;
      setNext(nextSearch, {
        replace: !push,
        state,
      });
    },
    [search, setNext]
  );

  return [query, setQuery] as const;
};
