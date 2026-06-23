import { GridColDef } from '@mui/x-data-grid-pro';
import { set } from 'lodash';
import { DateTime } from 'luxon';

/**
 * Adapters that translate a data grid's column definitions into the mobile row
 * list's filter controls, sort options, and labeled cell values — so the mobile
 * experience mirrors the grid's header filters / sortable columns without
 * re-declaring any of it. Consumed by {@link EntityList} and the mobile
 * filter drawer ({@link MobileFilterButton}).
 *
 * **Shared contract (single source of truth).** These reuse the column's own
 * typed props rather than a parallel mobile config — keeping drift low:
 * - Filter → API: the column's `serverFilter` (typed via the `GridBaseColDef`
 *   augmentation in `convertMuiFiltersToApi.ts`), else `lodash.set({}, field, value)`.
 *   This is byte-for-byte the grid's own default in {@link convertMuiFiltersToApi}.
 * - Display value: the column's `valueGetter` / `valueFormatter`.
 * - Sort field: the column's `field` (matches the grid's sort model → list input).
 *
 * **Known limitation (intentional, not silent):** the grid additionally applies
 * filter-operator–specific conversions via `getAsApiInput` (e.g. date
 * after/before ranges). The mobile drawer does NOT replicate those, so columns
 * that depend on them are excluded — date columns are skipped here, and any new
 * column needing custom API mapping must express it via `serverFilter` (which
 * both the grid and these adapters honor). The `as any` casts below are confined
 * to invoking the column value pipeline without a grid `apiRef` (try/catch
 * guarded); column shape contracts are locked by gridColumnAdapters.test.ts.
 */

export interface EnumOption {
  value: string;
  label: string;
}

export type FilterKind = 'search' | 'select' | 'multiSelect' | 'boolean';

/**
 * A single mobile filter control, derived from a data-grid column. `toFilter`
 * turns the control's current value into the matching slice of the API `filter`
 * input (or `undefined` when empty), mirroring how the grid's header filters map
 * to the API.
 */
export interface FilterControl {
  key: string;
  label: string;
  kind: FilterKind;
  options?: readonly EnumOption[];
  toFilter: (value: unknown) => Record<string, any> | undefined;
}

export type SortDirection = 'ASC' | 'DESC';

/** A single sortable field offered in the mobile drawer (mirrors a grid column). */
export interface SortOption {
  field: string;
  label: string;
}

export interface SortState {
  field: string;
  direction: SortDirection;
}

/** Sort config a row list registers: its sortable fields + the default selection. */
export interface SortConfig {
  options: readonly SortOption[];
  default: SortState;
}

const optionLabel = (col: any, raw: unknown): string => {
  let label: unknown;
  if (typeof col.getOptionLabel === 'function') {
    label = col.getOptionLabel(raw);
  }
  if (typeof label !== 'string' && typeof col.valueFormatter === 'function') {
    label = col.valueFormatter(raw, undefined, col, undefined);
  }
  return typeof label === 'string' ? label : String(raw);
};

/**
 * Derive mobile filter controls from a grid's column definitions, so the filter
 * drawer matches the grid's header filters. Maps each filterable column to a
 * control by its type (boolean → toggle, singleSelect → dropdown, else → search)
 * and converts values to the API `filter` the same way `convertMuiFiltersToApi`
 * does — via the column's `serverFilter`, or its `field` path by default.
 *
 * Date columns are not yet supported on mobile and are skipped.
 */
export const columnsToFilterControls = (
  columns: readonly GridColDef[]
): FilterControl[] =>
  columns.flatMap((column): FilterControl[] => {
    const col = column as any;
    if (col.filterable === false || !col.field || col.type === 'date') {
      return [];
    }
    const field: string = col.field;
    const label = String(col.headerName ?? field);
    const apply = (val: unknown) =>
      typeof col.serverFilter === 'function'
        ? col.serverFilter(val, { field, value: val, operator: 'is' })
        : set({}, field, val);

    if (col.type === 'boolean') {
      return [
        {
          key: field,
          label,
          kind: 'boolean',
          toFilter: (v) => (v === true || v === false ? apply(v) : undefined),
        },
      ];
    }
    if (col.type === 'singleSelect' && Array.isArray(col.valueOptions)) {
      const options: EnumOption[] = col.valueOptions.map((opt: any) => {
        const raw = opt && typeof opt === 'object' ? opt.value : opt;
        const lbl =
          opt && typeof opt === 'object' && opt.label != null
            ? String(opt.label)
            : optionLabel(col, raw);
        return { value: String(raw), label: lbl };
      });
      // multiEnumColumn marks itself unsortable; single enumColumn does not.
      const multi = col.sortable === false;
      return [
        {
          key: field,
          label,
          kind: multi ? 'multiSelect' : 'select',
          options,
          toFilter: multi
            ? (v) => (Array.isArray(v) && v.length > 0 ? apply(v) : undefined)
            : (v) => (v ? apply(v) : undefined),
        },
      ];
    }
    return [
      {
        key: field,
        label,
        kind: 'search',
        toFilter: (v) => {
          const text = typeof v === 'string' ? v.trim() : '';
          return text ? apply(text) : undefined;
        },
      },
    ];
  });

/**
 * Derive the sort options for the mobile drawer from a grid's columns — every
 * column the grid lets you sort by (i.e. not `sortable: false`, e.g. link/action
 * and multi-enum columns) that has a label. The `field` is the API `sort` value,
 * matching how the grid maps its sort model to the list input.
 */
export const columnsToSortOptions = (
  columns: readonly GridColDef[]
): SortOption[] =>
  columns.flatMap((column): SortOption[] => {
    const col = column as any;
    const label = col.headerName ? String(col.headerName) : '';
    if (
      !col.field ||
      col.sortable === false ||
      col.type === 'actions' ||
      !label
    ) {
      return [];
    }
    return [{ field: col.field, label }];
  });

// Extract a row's display string for a column, reusing the grid column's
// value pipeline (the same machinery the header cells use). Falls back through
// valueGetter → valueFormatter → type-aware formatting; returns undefined when
// the value is empty or can't be derived.
const formatColumnValue = (col: any, row: any): string | undefined => {
  let raw: any;
  try {
    raw =
      typeof col.valueGetter === 'function'
        ? col.valueGetter(undefined, row, col, undefined)
        : row[col.field];
  } catch {
    return undefined;
  }
  if (raw == null || raw === '') {
    return undefined;
  }
  try {
    if (typeof col.valueFormatter === 'function') {
      const formatted = col.valueFormatter(raw, row, col, undefined);
      return formatted == null || formatted === ''
        ? undefined
        : String(formatted);
    }
  } catch {
    // fall through to type-aware formatting
  }
  if (col.type === 'date' && raw instanceof Date) {
    return DateTime.fromJSDate(raw).toLocaleString(DateTime.DATE_MED);
  }
  if (col.type === 'boolean') {
    return raw ? 'Yes' : 'No';
  }
  return String(raw);
};

/** A row's column value labeled with its header (e.g. `"Step: Active"`), or undefined when empty. */
const labelColumnValue = (
  columns: readonly GridColDef[],
  field: string,
  row: Record<string, any>
): string | undefined => {
  const col = columns.find((c) => c.field === field) as any;
  if (!col?.headerName) {
    return undefined;
  }
  const value = formatColumnValue(col, row);
  return value == null ? undefined : `${String(col.headerName)}: ${value}`;
};

/**
 * The (always-labeled) secondary line a row should show: the sorted column when
 * the active sort differs from the list's default, otherwise the list's default
 * secondary column. Labeled with the column header (e.g. `"Step: Active"`).
 * Returns undefined when no value derives.
 */
export const rowSecondary = (
  columns: readonly GridColDef[],
  sort: string | undefined,
  defaultSort: string,
  defaultSecondaryField: string | undefined,
  row: Record<string, any>
): string | undefined => {
  const field = sort && sort !== defaultSort ? sort : defaultSecondaryField;
  return field ? labelColumnValue(columns, field, row) : undefined;
};
