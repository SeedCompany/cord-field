import { useMutation } from '@apollo/client';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Card, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { DataGridPro as DataGrid, GridColDef } from '@mui/x-data-grid-pro';
import { sortBy } from '@seedcompany/common';
import { useMemo } from 'react';
import { invalidateProps, onUpdateInvalidateProps } from '~/api';
import { useCurrencyFormatter } from '../../../components/Formatters/useCurrencyFormatter';
import {
  createAddItemFooter,
  EditNumberCell,
  isCellEditable,
  organizationColumn,
  OrganizationOption,
  textColumn,
  useDataGridSlots,
} from '../../../components/Grid';
import {
  Budget,
  FiscalYearAmounts,
  getAmounts,
  getSecuredValue,
  sumAmounts,
  useFiscalYearColumns,
} from './budgetLineHelpers';
import {
  CreateOtherPartnerContributionDocument,
  DeleteOtherPartnerContributionDocument,
  OtherPartnerContributionFragment as OtherPartnerContribution,
  UpdateOtherPartnerContributionDocument,
} from './OtherPartnerContribution.graphql';

interface OtherPartnerContributionsGridProps {
  budget: Budget | undefined;
  loading: boolean;
  /** This project's partnership organizations, for the Donor column picker --
   * scoped to the project, not a global org search. */
  partnerOrganizations: readonly OrganizationOption[];
}

/**
 * budget-line-items-poc (item 3): the "Other Partner Contributions" grid.
 * The backend for this resource (fragment + create/update/delete mutations)
 * was already built out in a prior pass -- this is the first UI for it.
 * Mirrors `ProjectBudgetLineItems`'s grid structure/conventions, just with a
 * smaller column set (donor, description, fiscal years, total).
 */
export const OtherPartnerContributionsGrid = (
  props: OtherPartnerContributionsGridProps
) => {
  const { budget, loading, partnerOrganizations } = props;
  const formatCurrency = useCurrencyFormatter({ maximumFractionDigits: 2 });

  const [createContribution] = useMutation(
    CreateOtherPartnerContributionDocument,
    {
      update: budget
        ? onUpdateInvalidateProps(
            budget,
            'otherPartnerContributions',
            'calculationSummary'
          )
        : undefined,
    }
  );

  const [updateContribution] = useMutation(
    UpdateOtherPartnerContributionDocument,
    {
      update: budget
        ? onUpdateInvalidateProps(budget, 'calculationSummary')
        : undefined,
    }
  );

  const [deleteContribution] = useMutation(
    DeleteOtherPartnerContributionDocument
  );

  const fiscalYearColumns = useFiscalYearColumns(budget);

  const rows = useMemo(
    () =>
      sortBy(budget?.otherPartnerContributions ?? [], (row) => row.createdAt),
    [budget]
  );

  const columns: Array<GridColDef<OtherPartnerContribution>> = useMemo(() => {
    const fyColumns: Array<GridColDef<OtherPartnerContribution>> =
      fiscalYearColumns.map(
        (fy): GridColDef<OtherPartnerContribution> => ({
          field: `fy_${fy.year}`,
          headerName: fy.label,
          description: `Fiscal Year ${fy.year} amount`,
          flex: 1,
          minWidth: 120,
          align: 'right',
          headerAlign: 'right',
          valueGetter: (_, row) =>
            getAmounts(row.fiscalYearAmounts)?.[String(fy.year)] ?? null,
          valueSetter: (value, row) => {
            const rawAmounts: FiscalYearAmounts = {
              ...(getAmounts(row.fiscalYearAmounts) ?? {}),
              [String(fy.year)]: value,
            };
            const nextAmounts =
              rawAmounts as unknown as OtherPartnerContribution['fiscalYearAmounts']['value'];
            return {
              ...row,
              fiscalYearAmounts: {
                ...row.fiscalYearAmounts,
                value: nextAmounts,
              },
            };
          },
          valueFormatter: (value: number | null) =>
            value != null ? formatCurrency(value) : '-',
          renderEditCell: (params) => <EditNumberCell {...params} />,
          editable: true,
          isEditable: ({ row }) => row.fiscalYearAmounts.canEdit,
        })
      );

    const totalCol: GridColDef<OtherPartnerContribution> = {
      field: 'total',
      headerName: 'Total',
      description: "Sum of this contribution's amounts across all fiscal years",
      flex: 1,
      minWidth: 120,
      align: 'right',
      headerAlign: 'right',
      sortable: false,
      filterable: false,
      valueGetter: (_, row) => sumAmounts(getAmounts(row.fiscalYearAmounts)),
      valueFormatter: (value: number) => formatCurrency(value),
    };

    const handleDelete = (row: OtherPartnerContribution) => {
      void deleteContribution({
        variables: { id: row.id },
        update: (cache, { data }) => {
          if (!data || !budget) {
            return;
          }
          invalidateProps(
            cache,
            budget,
            'otherPartnerContributions',
            'calculationSummary'
          );
          cache.evict({
            id: cache.identify({
              __typename: 'OtherPartnerContribution',
              id: row.id,
            }),
          });
          cache.gc();
        },
      });
    };

    const actionsCol: GridColDef<OtherPartnerContribution> = {
      field: 'actions',
      headerName: '',
      width: 60,
      align: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      hideable: false,
      renderCell: ({ row }) => (
        <Tooltip title="Delete Contribution">
          <span>
            <IconButton
              size="small"
              disabled={!row.canDelete}
              onClick={() => handleDelete(row)}
            >
              <DeleteIcon fontSize="small" color="error" />
            </IconButton>
          </span>
        </Tooltip>
      ),
    };

    return [
      {
        field: 'donor',
        headerName: 'Donor',
        flex: 1,
        minWidth: 180,
        ...organizationColumn<OtherPartnerContribution>(partnerOrganizations),
        valueGetter: (_, row) => row.donor.value?.id ?? null,
        valueSetter: (value: string | null, row) => ({
          ...row,
          donor: {
            ...row.donor,
            value: buildOrganizationValue(value, partnerOrganizations),
          },
        }),
        editable: true,
        isEditable: ({ row }) => row.donor.canEdit,
      },
      {
        field: 'description',
        headerName: 'Description',
        flex: 1.5,
        minWidth: 160,
        ...textColumn<OtherPartnerContribution>(),
        valueGetter: (_, row) => getSecuredValue(row.description),
        valueSetter: (value: string | null, row) => ({
          ...row,
          description: { ...row.description, value },
        }),
        editable: true,
        isEditable: ({ row }) => row.description.canEdit,
      },
      ...fyColumns,
      totalCol,
      actionsCol,
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fiscalYearColumns,
    formatCurrency,
    deleteContribution,
    budget,
    partnerOrganizations,
  ]);

  const AddFooter = useMemo(
    () =>
      createAddItemFooter({
        label: 'Add Contribution',
        tooltipTitle: 'Add another partner contribution',
        addItem: () => {
          if (!budget) {
            return;
          }
          void createContribution({
            variables: { input: { budget: budget.id } },
          });
        },
      }),
    [budget, createContribution]
  );

  const { slots, slotProps } = useDataGridSlots(
    {},
    { slots: { footer: AddFooter } }
  );

  const handleRowSave = async (
    row: OtherPartnerContribution,
    prev: OtherPartnerContribution
  ): Promise<OtherPartnerContribution> => {
    const changes = getChanges(prev, row);
    if (!changes) {
      return row;
    }
    await updateContribution({
      variables: { input: { id: row.id, ...changes } },
    });
    return row;
  };

  return (
    <Stack spacing={1}>
      <Typography variant="h6">Other Partner Contributions</Typography>
      <Card>
        <DataGrid<OtherPartnerContribution>
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          loading={loading}
          slots={slots}
          slotProps={slotProps}
          autoHeight
          disableColumnMenu
          rowSelection={false}
          isCellEditable={isCellEditable}
          processRowUpdate={handleRowSave}
          localeText={{
            noRowsLabel: 'No other partner contributions yet',
          }}
          sx={{
            '& .MuiDataGrid-columnHeader:last-child .MuiDataGrid-columnSeparator--sideRight':
              {
                display: 'none',
              },
          }}
        />
      </Card>
    </Stack>
  );
};

const buildOrganizationValue = (
  id: string | null,
  options: readonly OrganizationOption[]
): OtherPartnerContribution['donor']['value'] => {
  if (!id) return null;
  const org = options.find((o) => o.id === id);
  // See `ProjectBudgetLineItems`'s identical helper for why this cast is
  // unavoidable (a synthetic, local-only value never sent to the server).
  return {
    __typename: 'Organization',
    id,
    createdAt: new Date().toISOString(),
    name: {
      __typename: 'SecuredString',
      canRead: true,
      canEdit: true,
      value: org?.name ?? '',
    },
  } as unknown as OtherPartnerContribution['donor']['value'];
};

const getChanges = (
  original: OtherPartnerContribution,
  updated: OtherPartnerContribution
) => {
  const changes: Record<string, unknown> = {};
  if (original.donor.value?.id !== updated.donor.value?.id) {
    changes.donor = updated.donor.value?.id ?? null;
  }
  if (original.description.value !== updated.description.value) {
    changes.description = updated.description.value ?? null;
  }
  const originalAmounts = JSON.stringify(
    original.fiscalYearAmounts.value ?? {}
  );
  const updatedAmounts = JSON.stringify(updated.fiscalYearAmounts.value ?? {});
  if (originalAmounts !== updatedAmounts) {
    changes.fiscalYearAmounts = updated.fiscalYearAmounts.value ?? {};
  }
  return Object.keys(changes).length > 0 ? changes : null;
};
