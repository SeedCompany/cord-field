import type { GridRenderCellParams } from '@mui/x-data-grid-pro';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProjectColumns } from '../../ProjectDataGrid/ProjectColumns';
import { PrimaryPartnerColumn } from './PrimaryPartnerColumn';

interface TestRow {
  readonly primaryPartner: {
    readonly id: string;
    readonly organization: {
      readonly value: {
        readonly name: {
          readonly value: string;
        };
      };
    };
  } | null;
}

const makeColumn = () =>
  PrimaryPartnerColumn({
    field: 'primaryPartnership.partner.name',
    valueGetter: (_value: never, row: TestRow) => row.primaryPartner,
  });

type TestColumn = ReturnType<typeof makeColumn>;
type RenderCellParams = GridRenderCellParams<
  TestRow,
  string | null | undefined
>;

const makeRenderCellParams = (
  _column: TestColumn,
  row: TestRow,
  value?: string
): RenderCellParams => ({
  id: 'row-1',
  field: 'primaryPartnership.partner.name',
  value,
  formattedValue: value,
  row,
  rowNode: null as never,
  colDef: null as never,
  cellMode: 'view',
  hasFocus: false,
  tabIndex: -1,
  api: null as never,
  isEditable: false,
});

const makeRow = (name = 'Seed Company'): TestRow => ({
  primaryPartner: {
    id: 'partner-1',
    organization: {
      value: {
        name: {
          value: name,
        },
      },
    },
  },
});

describe('PrimaryPartnerColumn', () => {
  it('extracts the partner organization name from the primary partnership', () => {
    const column = makeColumn();
    const valueGetter = column.valueGetter;

    expect(
      valueGetter(
        undefined as never,
        makeRow(),
        undefined as never,
        undefined as never
      )
    ).toBe('Seed Company');
  });

  it('renders the partner name as a link to the partner detail page', () => {
    const column = makeColumn();

    render(
      <MemoryRouter>
        {column.renderCell(
          makeRenderCellParams(column, makeRow(), 'Seed Company')
        )}
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Seed Company' })).toHaveAttribute(
      'href',
      '/partners/partner-1'
    );
  });

  it('renders nothing when there is no primary partner', () => {
    const column = makeColumn();

    const emptyRow: TestRow = { primaryPartner: null };

    render(
      <MemoryRouter>
        {column.renderCell(makeRenderCellParams(column, emptyRow))}
      </MemoryRouter>
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('creates the expected nested server filter', () => {
    const column = makeColumn();
    const serverFilter = column.serverFilter;

    expect(serverFilter('Seed Company')).toEqual({
      primaryPartnership: {
        partner: {
          organization: {
            name: 'Seed Company',
          },
        },
      },
    });
  });

  it('is included in the project grid columns', () => {
    expect(
      ProjectColumns.find(
        (column) => column.field === 'primaryPartnership.partner.name'
      )
    ).toMatchObject({
      headerName: 'Primary Partner',
      width: 300,
    });
  });
});
