import {
  getGridSingleSelectOperators,
  GridEditSingleSelectCell,
} from '@mui/x-data-grid-pro';
import { column, RowLike } from './definition.types';

export interface OrganizationOption {
  readonly id: string;
  readonly name: string;
}

/**
 * budget-line-items-poc: single-select column for picking an organization
 * from a small, pre-fetched list (e.g. a project's own partnerships) --
 * deliberately NOT a global organization search (see
 * `~/components/form/Lookup/Organization/OrganizationField`, which is a
 * global search and is the wrong fit for a per-project scoped column).
 *
 * Mirrors `enumColumn`'s shape/UX (MUI DataGrid's built-in singleSelect
 * editor renders a plain MUI `Select`), just with `{value, label}` options
 * built from real organization ids/names instead of a fixed string enum.
 * The stored/edited value is the organization's `id` (or `null` to clear);
 * callers still provide their own `valueGetter`/`valueSetter` since the row
 * shape (which field holds the organization) varies by caller.
 */
export const organizationColumn = <Row extends RowLike>(
  options: readonly OrganizationOption[]
) => {
  const labelById = new Map(options.map((o) => [o.id, o.name]));
  const valueOptions: Array<{ value: string | null; label: string }> = [
    { value: null, label: '—' },
    ...options.map((o) => ({ value: o.id as string | null, label: o.name })),
  ];
  return column<Row, string | null, string>()({
    type: 'singleSelect',
    filterOperators: getGridSingleSelectOperators().filter(
      (op) => op.value !== 'not'
    ),
    valueOptions,
    valueFormatter: (value: string | null) =>
      value ? labelById.get(value) ?? '' : '—',
    renderEditCell: (params) => (
      <GridEditSingleSelectCell
        {...params}
        // Stop editing on the first value changed, matching `enumColumn`'s
        // behavior -- selecting a value immediately commits it.
        onValueChange={async (event, formatted) => {
          const { api, id, field } = params;
          await api.setEditCellValue({ id, field, value: formatted }, event);
          api.stopCellEditMode({ id, field });
        }}
      />
    ),
  });
};
