import { GridColDef } from '@mui/x-data-grid-pro';
import {
  columnsToFilterControls,
  columnsToSortOptions,
  rowSecondary,
} from './gridColumnAdapters';

// Build a representative set of columns matching how the data grids declare them.
const asColumns = (cols: any[]) => cols as unknown as readonly GridColDef[];

describe('columnsToFilterControls', () => {
  it('maps a text column to a debounced search filter using the field path', () => {
    const [control] = columnsToFilterControls(
      asColumns([{ field: 'name', headerName: 'Name' }])
    );
    expect(control).toMatchObject({
      key: 'name',
      label: 'Name',
      kind: 'search',
    });
    expect(control!.toFilter('  Acme  ')).toEqual({ name: 'Acme' });
    // empty / whitespace yields no filter fragment
    expect(control!.toFilter('   ')).toBeUndefined();
    expect(control!.toFilter('')).toBeUndefined();
  });

  it('maps a boolean column to a yes/no filter', () => {
    const [control] = columnsToFilterControls(
      asColumns([{ field: 'pinned', headerName: 'Pinned', type: 'boolean' }])
    );
    expect(control!.kind).toBe('boolean');
    expect(control!.toFilter(true)).toEqual({ pinned: true });
    expect(control!.toFilter(false)).toEqual({ pinned: false });
    expect(control!.toFilter(undefined)).toBeUndefined();
  });

  it('maps a singleSelect column to a single dropdown', () => {
    const [control] = columnsToFilterControls(
      asColumns([
        {
          field: 'status',
          headerName: 'Status',
          type: 'singleSelect',
          valueOptions: ['Active', 'Inactive'],
        },
      ])
    );
    expect(control!.kind).toBe('select');
    expect(control!.options).toEqual([
      { value: 'Active', label: 'Active' },
      { value: 'Inactive', label: 'Inactive' },
    ]);
    expect(control!.toFilter('Active')).toEqual({ status: 'Active' });
    expect(control!.toFilter(undefined)).toBeUndefined();
  });

  it('maps an unsortable singleSelect (multi-enum) to a multi-select', () => {
    const [control] = columnsToFilterControls(
      asColumns([
        {
          field: 'roles',
          headerName: 'Roles',
          type: 'singleSelect',
          sortable: false,
          valueOptions: ['A', 'B'],
        },
      ])
    );
    expect(control!.kind).toBe('multiSelect');
    expect(control!.toFilter(['A', 'B'])).toEqual({ roles: ['A', 'B'] });
    expect(control!.toFilter([])).toBeUndefined();
  });

  it("honors a column's serverFilter for the API shape", () => {
    const [control] = columnsToFilterControls(
      asColumns([
        {
          field: 'fullName',
          headerName: 'Name',
          serverFilter: (value: unknown) => ({ name: value }),
        },
      ])
    );
    expect(control!.toFilter('Bob')).toEqual({ name: 'Bob' });
  });

  it('skips date, dateTime, and non-filterable columns', () => {
    const controls = columnsToFilterControls(
      asColumns([
        { field: 'mouStart', headerName: 'MOU Start', type: 'date' },
        { field: 'createdAt', headerName: 'Created At', type: 'dateTime' },
        { field: 'count', headerName: 'Count', filterable: false },
        { field: 'name', headerName: 'Name' },
      ])
    );
    expect(controls.map((c) => c.key)).toEqual(['name']);
  });
});

describe('columnsToSortOptions', () => {
  it('includes labeled sortable columns and excludes the rest', () => {
    const options = columnsToSortOptions(
      asColumns([
        { field: 'name', headerName: 'Name' },
        { field: 'roles', headerName: 'Roles', sortable: false }, // multi-enum
        { field: 'Engagement', headerName: '' }, // link column, no label
        { field: 'actions', headerName: 'x', type: 'actions' },
        { field: 'status', headerName: 'Status' },
      ])
    );
    expect(options).toEqual([
      { field: 'name', label: 'Name' },
      { field: 'status', label: 'Status' },
    ]);
  });
});

describe('rowSecondary', () => {
  const columns = asColumns([
    {
      field: 'name',
      headerName: 'Name',
      valueGetter: (_: any, r: any) => r.name,
    },
    {
      field: 'country',
      headerName: 'Country',
      valueGetter: (_: any, r: any) => r.country,
    },
    {
      field: 'step',
      headerName: 'Step',
      type: 'singleSelect',
      valueGetter: (_: any, r: any) => r.step,
      valueFormatter: (v: any) => (v === 'active' ? 'Active' : v),
    },
    {
      field: 'pinned',
      headerName: 'Pinned',
      type: 'boolean',
      valueGetter: (_: any, r: any) => r.pinned,
    },
  ]);
  const row = { name: 'Acme', country: 'USA', step: 'active', pinned: false };

  it('shows the default secondary column (labeled) on the default sort', () => {
    expect(rowSecondary(columns, 'name', 'name', 'country', row)).toBe(
      'Country: USA'
    );
  });

  it('shows the sorted column (labeled) when sort differs from default', () => {
    expect(rowSecondary(columns, 'step', 'name', 'country', row)).toBe(
      'Step: Active'
    );
  });

  it('formats booleans as Yes/No', () => {
    expect(rowSecondary(columns, 'pinned', 'name', 'country', row)).toBe(
      'Pinned: No'
    );
  });

  it('returns undefined when the value is empty', () => {
    expect(
      rowSecondary(columns, 'name', 'name', 'country', { ...row, country: '' })
    ).toBeUndefined();
  });
});
