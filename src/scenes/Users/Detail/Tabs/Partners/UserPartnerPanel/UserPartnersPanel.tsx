import { useMutation } from '@apollo/client';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { DataGridPro as DataGrid, GridColDef } from '@mui/x-data-grid-pro';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDialog } from '~/components/Dialog';
import {
  createAddItemFooter,
  DefaultDataGridStyles,
  flexLayout,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSlots,
  useDataGridSource,
} from '~/components/Grid';
import {
  PartnerColumns,
  PartnerInitialState,
  PartnerToolbar,
} from '~/components/PartnersDataGrid/PartnerColumns';
import type { PartnerDataGridRowFragment as UserPartner } from '~/components/PartnersDataGrid/partnerDataGridRow.graphql';
import { AddOrganizationToUserForm } from '../AddOrganizationToUserForm';
import {
  RemoveOrganizationFromUserDocument,
  UserPartnersDocument,
} from './UserPartnerList.graphql';

interface UserPartnersPanelProps {
  canCreate: boolean;
}

export const UserPartnersPanel = ({ canCreate }: UserPartnersPanelProps) => {
  const { userId = '' } = useParams();
  const [addPartnerState, openAddPartner] = useDialog();

  const [removeOrganization] = useMutation(RemoveOrganizationFromUserDocument);

  const [dataGridProps] = useDataGridSource({
    query: UserPartnersDocument,
    variables: { userId },
    listAt: 'user.partners',
    initialInput: {
      sort: 'organization.name',
    },
  });

  const columns = useMemo(() => {
    const actionsCol: GridColDef<UserPartner> = {
      field: 'actions',
      headerName: '',
      width: 60,
      align: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      hideable: false,
      renderCell: ({ row: partner }) => (
        <Tooltip title="Remove Partner">
          <IconButton
            size="small"
            onClick={() =>
              void removeOrganization({
                variables: {
                  user: userId,
                  org: partner.organization.value!.id,
                },
                refetchQueries: [UserPartnersDocument],
              })
            }
          >
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Tooltip>
      ),
    };
    return [...PartnerColumns, ...(canCreate ? [actionsCol] : [])];
  }, [canCreate, userId, removeOrganization]);

  const AddPartnerFooter = useMemo(
    () =>
      createAddItemFooter({
        addItem: openAddPartner,
        tooltipTitle: 'Add Partner to User',
      }),
    [openAddPartner]
  );

  const { slots, slotProps } = useDataGridSlots(dataGridProps, {
    slots: {
      toolbar: PartnerToolbar,
      footer: AddPartnerFooter,
    },
  });

  return (
    <>
      <DataGrid<UserPartner>
        {...DefaultDataGridStyles}
        {...dataGridProps}
        slots={slots}
        slotProps={slotProps}
        columns={columns}
        initialState={PartnerInitialState}
        headerFilters
        hideFooter={!canCreate}
        sx={[flexLayout, noHeaderFilterButtons, noFooter]}
      />
      {canCreate && (
        <AddOrganizationToUserForm userId={userId} {...addPartnerState} />
      )}
    </>
  );
};
