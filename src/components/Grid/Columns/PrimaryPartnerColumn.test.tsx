import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
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
  PrimaryPartnerColumn<TestRow>({
    field: 'primaryPartnership.partner.name',
    valueGetter: (_, row) => row.primaryPartner,
  });

type RenderCell = (params: {
  value?: string;
  row: TestRow;
  colDef: ReturnType<typeof makeColumn>;
  api: object;
}) => ReactNode;

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

    expect(
      column.valueGetter(
        undefined as never,
        makeRow(),
        column,
        undefined as never
      )
    ).toBe('Seed Company');
  });

  it('renders the partner name as a link to the partner detail page', () => {
    const column = makeColumn();
    const renderCell = column.renderCell as RenderCell;

    render(
      <MemoryRouter>
        {renderCell({
          value: 'Seed Company',
          row: makeRow(),
          colDef: column,
          api: {},
        })}
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Seed Company' })).toHaveAttribute(
      'href',
      '/partners/partner-1'
    );
  });

  it('renders nothing when there is no primary partner', () => {
    const column = makeColumn();
    const renderCell = column.renderCell as RenderCell;

    const emptyRow: TestRow = { primaryPartner: null };

    render(
      <MemoryRouter>
        {renderCell({
          value: undefined,
          row: emptyRow,
          colDef: column,
          api: {},
        })}
      </MemoryRouter>
    );

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
