import type {
  GridColDef as ColDef,
  GridValidRowModel as RowLike,
  GridValueGetter as ValueGetter,
} from '@mui/x-data-grid-pro';
import { merge } from '~/common';

export type { RowLike };

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type WithValueGetterReturning<
  V,
  R extends RowLike,
  F = V,
  TValue = never
> = {
  valueGetter: ValueGetter<R, V, F, TValue>;
};

export const column =
  <Row extends RowLike, V = any, F = V>() =>
  <const InputDef extends Partial<ColDef<Row, V, F>>>(definition: InputDef) =>
    // Prevent the `const` generic from converting arrays to readonly,
    // which is not compatible with `ColDef`
    definition as NoReadonlyArrayProps<InputDef>;

export const columnWithDefaults =
  <Row extends RowLike, V = any, F = V>() =>
  <
    const Defaults extends Partial<ColDef<Row, V, F>>,
    const Overrides extends Partial<ColDef<Row, V, F>>
  >(
    overrides: Overrides,
    defaults: Defaults
  ) =>
    merge(
      defaults as NoReadonlyArrayProps<Defaults>,
      overrides as NoReadonlyArrayProps<Overrides>
    );

type NoReadonlyArrayProps<T> = {
  [K in keyof T]: T[K] extends ReadonlyArray<infer U> ? U[] : T[K];
};
