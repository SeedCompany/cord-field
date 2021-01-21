import { compact, mapKeys, mapValues, omit, pick, pickBy } from 'lodash';
import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  decodeDelimitedArray,
  DecodedValueMap,
  decodeQueryParams,
  encodeDelimitedArray,
  encodeQueryParams,
  StringParam,
  QueryParamConfig as UpstreamQueryParamConfig,
} from 'serialize-query-params';
import { areListsEqual, compareNullable } from '../components/form/util';
import { entries, mapFromList } from '../util';

export { NumberParam, StringParam } from 'serialize-query-params';

export interface QueryParamConfig<Val, Encoded = Val>
  extends UpstreamQueryParamConfig<Val, Encoded> {
  defaultValue?: Val;
  /** Key used in url */
  key?: string;
}

export const ListParam: QueryParamConfig<string[] | undefined> = {
  encode: (val) => encodeDelimitedArray(val, ',') || undefined,
  decode: (val) => compact(decodeDelimitedArray(val, ',')),
  equals: compareNullable(areListsEqual),
};

export const BooleanParam = (): QueryParamConfig<boolean | undefined> => ({
  encode: (val) => (val == null ? undefined : val ? '1' : '0'),
  decode: (val) =>
    val === '1' || val === 'true'
      ? true
      : val === '0' || val === 'false'
      ? false
      : undefined,
});

// This is just a list param, but is typed as T[]. Useful for string literals.
export const EnumListParam = <T extends string>() =>
  (ListParam as unknown) as QueryParamConfig<T[] | undefined>;

// This is just a string param, but is typed as T. Useful for string literals.
export const EnumParam = <T extends string>() =>
  (StringParam as unknown) as QueryParamConfig<T | undefined>;

/**
 * This applies a default value to the param config.
 * The default value is used when the value is omitted from the url.
 * The default value is omitted from the url on change.
 */
export const withDefault = <Val, Default extends Val>(
  param: QueryParamConfig<Val | undefined>,
  defaultValue: Default
): QueryParamConfig<NonNullable<Val> | Default> => ({
  ...param,
  encode: (val) =>
    (param.equals ?? tripleEquals)(val, defaultValue)
      ? undefined
      : param.encode(val),
  decode: (val) =>
    val == null ? defaultValue : param.decode(val) ?? defaultValue,
  defaultValue,
});

export interface Transforms<OuterD, InnerD = OuterD> {
  encode: (
    value: OuterD,
    encoder: QueryParamConfig<InnerD>['encode']
  ) => RawParamValue;
  decode: (
    value: RawParamValue,
    decoder: QueryParamConfig<InnerD>['decode']
  ) => OuterD;
}
export const withTransform = <OuterD, InnerD = OuterD>(
  param: QueryParamConfig<InnerD>,
  transforms: Transforms<OuterD, InnerD>
): QueryParamConfig<OuterD> => ({
  ...param,
  encode: (val) => transforms.encode(val, param.encode),
  decode: (val) => transforms.decode(val, param.decode),
  // @ts-expect-error assume default value, if given, is still compatible.
  // withDefault can be applied on top of this function to fix if its not.
  defaultValue: param.defaultValue,
});

export const withKey = <D>(param: QueryParamConfig<D>, key: string) => ({
  ...param,
  key,
});

/** The value a url parameter can be */
type RawParamValue = string | Array<string | null> | null | undefined;

const tripleEquals = (a: unknown, b: unknown) => a === b;

interface QueryChangeOptions {
  // Whether to push a new history state or replace the existing one.
  // We replace by default here since that's more common with query params.
  push?: boolean | undefined;
  state?: Record<string, any> | null | undefined;
}

type QueryParamConfigMapShape = Record<string, QueryParamConfig<any>>;

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
export const makeQueryHandler = <QPCMap extends QueryParamConfigMapShape>(
  paramConfigMap: QPCMap
) => {
  const rawKeysToOurs = mapFromList(entries(paramConfigMap), ([key, value]) => [
    value.key ?? key,
    key,
  ]);
  const rawKeys = Object.keys(rawKeysToOurs);
  const defaultValues = mapValues(paramConfigMap, (c) => c.defaultValue);

  return () => {
    const [search] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [query, unrelated] = useMemo(() => {
      const toObj = Object.fromEntries(search);

      // Spit object between entries we are managing and unrelated ones.
      // unrelated will be used in update to preserve their current values.
      const unrelated = omit(toObj, rawKeys);
      const filtered = pick(toObj, rawKeys);

      // convert raw keys to our keys
      const mapped = mapKeys(filtered, (_, key) => rawKeysToOurs[key]);
      // decode values
      const decoded = decodeQueryParams(paramConfigMap, mapped as any);
      // merge in default values
      const defaulted = { ...defaultValues, ...decoded };

      return [defaulted, unrelated] as const;
    }, [search]);

    const setQuery = useCallback(
      (
        next: Partial<DecodedValueMap<QPCMap>>,
        options: QueryChangeOptions = {}
      ) => {
        const encoded = encodeQueryParams(paramConfigMap, next);
        // filter out falsy values to keep url clean
        const filtered = pickBy(encoded as Record<string, string>);
        // convert our keys to the configured raw keys
        const mapped = mapKeys(
          filtered,
          (_, key) => paramConfigMap[key]!.key ?? key
        );
        // Merge in unrelated query params so they are preserved
        const merged = { ...unrelated, ...mapped };

        // react-router's useSearchParams setter is bugged
        // https://github.com/ReactTraining/react-router/issues/7496
        // Passing current path & hash along with setter to function as expected.
        const nextSearch = new URLSearchParams(merged).toString();
        const { push, state } = options;
        navigate(
          {
            search: nextSearch.length ? '?' + nextSearch : '',
            // Pass current values to leave them unchanged
            pathname: location.pathname,
            hash: location.hash,
          },
          {
            replace: !push,
            state,
          }
        );
      },
      [unrelated, navigate, location]
    );

    return [query, setQuery] as const;
  };
};
