import { useMutation } from '@apollo/client';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { DataGridPro as DataGrid, GridColDef } from '@mui/x-data-grid-pro';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { removeItemFromList } from '~/api';
import { useDialog } from '~/components/Dialog';
import {
  booleanColumn,
  createAddItemFooter,
  DefaultDataGridStyles,
  flexLayout,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSlots,
  useDataGridSource,
} from '~/components/Grid';
import { TabPanelContent } from '~/components/Tabs';
import {
  UserColumns,
  UserInitialState,
  UserToolbar,
} from '~/components/UserDataGrid/UserColumns';
import { UserDataGridRowFragment as User } from '~/components/UserDataGrid/userDataGridRow.graphql';
import { AddPersonToPartnerForm } from './AddPersonToPartnerForm';
import {
  PartnerDetailPeopleFragment,
  PartnerPeopleDocument,
  RemovePersonFromPartnerDocument,
} from './PartnerDetailsPeople.graphql';

interface Props {
  partner?: PartnerDetailPeopleFragment;
}

export const PartnerDetailPeople = ({ partner }: Props) => {
  const { partnerId = '' } = useParams();
  const orgId = partner?.organization.value?.id;
  const pocId = partner?.pointOfContact.value?.id;
  const canCreate = partner?.people.canCreate ?? false;

  const [addState, openAdd] = useDialog();
  const [removePerson] = useMutation(RemovePersonFromPartnerDocument);

  const [dataGridProps, { addRow }] = useDataGridSource({
    query: PartnerPeopleDocument,
    variables: { id: partnerId },
    listAt: 'partner.people',
    initialInput: { sort: 'fullName' },
  });

  const columns = useMemo<Array<GridColDef<User>>>(() => {
    const pocCol: GridColDef<User> = {
      field: 'isPointOfContact',
      headerName: 'Point of Contact',
      width: 160,
      ...booleanColumn(),
      valueGetter: (_, row) => row.id === pocId,
    };

    const actionsCol: GridColDef<User> = {
      field: 'actions',
      headerName: '',
      width: 60,
      align: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      hideable: false,
      renderCell: ({ row }) => (
        <Tooltip title="Remove from Partner">
          <IconButton
            size="small"
            onClick={() =>
              void removePerson({
                variables: { user: row.id, org: orgId! },
                update: partner
                  ? removeItemFromList({
                      listId: [partner, 'people'],
                      item: row,
                    })
                  : undefined,
              })
            }
          >
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </Tooltip>
      ),
    };

    const [name, ...rest] = UserColumns;
    return [
      name!,
      pocCol,
      ...rest,
      ...(canCreate && orgId ? [actionsCol] : []),
    ];
  }, [canCreate, orgId, partner, pocId, removePerson]);

  const AddFooter = useMemo(
    () =>
      createAddItemFooter({
        addItem: openAdd,
        tooltipTitle: 'Add Person to Partner',
      }),
    [openAdd]
  );

  const { slots, slotProps } = useDataGridSlots(dataGridProps, {
    slots: { toolbar: UserToolbar, footer: AddFooter },
  });

  return (
    <TabPanelContent>
      <DataGrid<User>
        {...DefaultDataGridStyles}
        {...dataGridProps}
        slots={slots}
        slotProps={slotProps}
        columns={columns}
        initialState={UserInitialState}
        getRowId={(row) => row.id}
        headerFilters
        hideFooter={!canCreate}
        sx={[flexLayout, noHeaderFilterButtons, noFooter]}
      />
      {canCreate && partner ? (
        <AddPersonToPartnerForm
          partner={partner}
          onAdded={addRow}
          {...addState}
        />
      ) : null}
    </TabPanelContent>
  );
};
