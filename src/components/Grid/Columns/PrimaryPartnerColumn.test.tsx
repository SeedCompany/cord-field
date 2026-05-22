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

const makeRow = (name = 'Seed Company', id = 'partner-1'): TestRow => ({
  primaryPartner: {
    id,
    organization: {
      value: {
        name: {
          value: name,
        },
      },
    },
  },
});

const makeColumn = () =>
  PrimaryPartnerColumn({
    field: 'primaryPartnership.partner.name',
    valueGetter: (_value: never, row: TestRow) => row.primaryPartner,
  });

describe('PrimaryPartnerColumn', () => {
  it('renders the partner name as a link to the partner detail page', () => {
    const column = makeColumn();
    const partner = makeRow('Seed Company', 'partner-123');
    const partnerName = partner.primaryPartner?.organization.value.name.value;

    const params: GridRenderCellParams<TestRow, string | undefined> = {
      value: partnerName,
      row: partner,
      colDef: column,
      api: { current: null },
    };

    render(<MemoryRouter>{column.renderCell(params)}</MemoryRouter>);

    expect(screen.getByRole('link', { name: 'Seed Company' })).toHaveAttribute(
      'href',
      '/partners/partner-123'
    );
  });

  it('renders nothing when there is no primary partner', () => {
    const column = makeColumn();
    const emptyRow: TestRow = { primaryPartner: null };

    const params: GridRenderCellParams<TestRow, undefined> = {
      value: undefined,
      row: emptyRow,
      colDef: column,
      api: { current: null },
    };

    render(<MemoryRouter>{column.renderCell(params)}</MemoryRouter>);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('creates the expected nested server filter', () => {
    const column = makeColumn();

    expect(column.serverFilter('Seed Company')).toEqual({
      primaryPartnership: {
        partner: {
          organization: {
            name: 'Seed Company',
          },
        },
      },
    });
  });

  it('is included in the project grid columns with correct metadata', () => {
    const column = ProjectColumns.find(
      (col) => col.field === 'primaryPartnership.partner.name'
    );

    expect(column).toMatchObject({
      headerName: 'Primary Partner',
      width: 300,
    });
  });
});
