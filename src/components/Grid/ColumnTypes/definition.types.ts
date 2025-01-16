import type {
  GridColDef as ColDef,
  GridValidRowModel as RowLike,
} from '@mui/x-data-grid-pro';

export type { RowLike };

export const column =
  <Row extends RowLike, V = any, F = V>() =>
  <const InputDef extends Partial<ColDef<Row, V, F>>>(definition: InputDef) =>
    // Prevent the `const` generic from converting arrays to readonly,
    // which is not compatible with `ColDef`
    definition as NoReadonlyArrayProps<InputDef>;

type NoReadonlyArrayProps<T> = {
  [K in keyof T]: T[K] extends ReadonlyArray<infer U> ? U[] : T[K];
};
