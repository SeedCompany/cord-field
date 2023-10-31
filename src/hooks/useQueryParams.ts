import { isNotFalsy, mapKeys, mapValues } from '@seedcompany/common';
import { invert, omit, pick, pickBy } from 'lodash';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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

export { NumberParam, StringParam } from 'serialize-query-params';

export interface QueryParamConfig<Val, Encoded = Val>
  extends UpstreamQueryParamConfig<Val, Encoded> {
  defaultValue?: Val;
  /** Key used in url */
  key?: string;
}

export const ListParam: QueryParamConfig<string[] | undefined> = {
  encode: (val) => encodeDelimitedArray(val, ',') || undefined,
  decode: (val) => {
    const list = decodeDelimitedArray(val, ',')?.filter(isNotFalsy);
    return list && list.length > 0 ? list : undefined;
  },
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

export const EnumListParam = <const T extends string>(
  options: readonly T[],
  mappingOverride?: Partial<Record<T, string>>
): QueryParamConfig<readonly T[] | undefined> => {
  const decodeMapping = mapKeys.fromList(options, (opt) => {
    return mappingOverride?.[opt] ?? opt.toLowerCase();
  }).asRecord;
  const encodeMapping = invert(decodeMapping);
  return withTransform(ListParam, {
    encode: (value, encoder) =>
      encoder(value?.map((v) => encodeMapping[v] ?? v)),
    decode: (raw, decoder) => {
      const value = decoder(raw)
        ?.map((v) => decodeMapping[v])
        .filter(isNotFalsy);
      return value && value.length > 0 ? value : undefined;
    },
  });
};

export const EnumParam = <const T extends string>(
  options: readonly T[],
  mappingOverride?: Partial<Record<T, string>>
): QueryParamConfig<T | undefined> => {
  const decodeMapping = mapKeys.fromList(options, (opt) => {
    return mappingOverride?.[opt] ?? opt.toLowerCase();
  }).asRecord;
  const encodeMapping = invert(decodeMapping);
  return withTransform(StringParam, {
    encode: (value, encoder) =>
      encoder(value ? encodeMapping[value] : undefined),
    decode: (raw, decoder) => {
      const value = decoder(raw);
      return value ? decodeMapping[value] : undefined;
    },
  });
};

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
  const rawKeysToOurs = mapKeys(
    paramConfigMap,
    (key, value) => value.key ?? key
  ).asRecord;
  const rawKeys = Object.keys(rawKeysToOurs);
  const defaultValues = mapValues(
    paramConfigMap,
    (_, c) => c.defaultValue
  ).asRecord;

  return () => {
    const [search, setNext] = useSearchParams();

    const [query, unrelated] = useMemo(() => {
      const toObj = Object.fromEntries(search);

      // Spit object between entries we are managing and unrelated ones.
      // unrelated will be used in update to preserve their current values.
      const unrelated = omit(toObj, rawKeys);
      const filtered = pick(toObj, rawKeys);

      // convert raw keys to our keys
      const mapped = mapKeys(filtered, (key) => rawKeysToOurs[key]).asRecord;
      // decode values
      const decoded = decodeQueryParams(paramConfigMap, mapped as any);
      // merge in default values
      const defaulted: DecodedValueMap<QPCMap> = {
        ...defaultValues,
        ...decoded,
      };

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
          (key) => paramConfigMap[key]!.key ?? key
        ).asRecord;
        // Merge in unrelated query params so they are preserved
        const merged = { ...unrelated, ...mapped };

        const { push, state } = options;
        setNext(merged, {
          replace: !push,
          state,
        });
      },
      [unrelated, setNext]
    );

    return [query, setQuery] as const;
  };
};
