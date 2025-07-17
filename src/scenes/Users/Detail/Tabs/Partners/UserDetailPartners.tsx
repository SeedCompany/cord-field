import { useMutation } from '@apollo/client/react/hooks/useMutation';
import { Add, Delete } from '@mui/icons-material';
import { Button, Tooltip } from '@mui/material';
import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
  GridActionsCellItem,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useCallback, useMemo } from 'react';
import { removeItemFromList } from '~/api';
import { useDialog } from '~/components/Dialog';
import {
  DefaultDataGridStyles,
  flexLayout,
  noHeaderFilterButtons,
  useDataGridSource,
} from '~/components/Grid';
import { Footer } from '~/components/Grid/Footer';
import {
  PartnerDataGridRowFragment as Partner,
  PartnerColumns,
  PartnerInitialState,
  PartnerToolbar,
} from '~/components/PartnersDataGrid';
import { TabPanelContent } from '~/components/Tabs/TabPanelContent';
import { AssignOrganizationToUserFormFragment } from './AssignOrgToUserForm/AssignOrgToUser.graphql';
import { AssignOrgToUserForm } from './AssignOrgToUserForm/AssignOrgToUserForm';
import { RemoveOrganizationFromUserDocument } from './RemoveOrgFromUser.graphql';
import { UserPartnerListDocument } from './UserPartnerList.graphql';

interface UserDetailPartnersProps {
  user: AssignOrganizationToUserFormFragment;
}

export const UserDetailPartners = ({ user }: UserDetailPartnersProps) => {
  const [dataGridProps] = useDataGridSource({
    query: UserPartnerListDocument,
    variables: { userId: user.id },
    listAt: 'user.partners',
    initialInput: {
      sort: 'organization.name',
    },
  });

  const [addPartnerState, addPartner] = useDialog();

  const PartnerFooter = useCallback(
    () => (
      <Footer>
        <Tooltip title="Add Partner" placement="top">
          <Button color="primary" onClick={addPartner} size="small">
            <Add />
          </Button>
        </Tooltip>
        <Tooltip title="Remove Partner" placement="top">
          <Button
            color="error"
            onClick={() => {
              const isActionColVisible = dataGridProps.apiRef.current
                .getVisibleColumns()
                .find((col) => col.field === 'actions');
              dataGridProps.apiRef.current.setColumnVisibility(
                'actions',
                !isActionColVisible
              );
              dataGridProps.apiRef.current.setPinnedColumns({
                left: ['organization.name'],
                right: isActionColVisible ? [] : ['actions'],
              });
            }}
            size="small"
          >
            <Delete />
          </Button>
        </Tooltip>
      </Footer>
    ),
    [addPartner, dataGridProps.apiRef]
  );

  const slots = useMemo(
    () =>
      merge({}, DefaultDataGridStyles.slots, dataGridProps.slots, {
        toolbar: PartnerToolbar,
        footer: PartnerFooter,
      } satisfies DataGridProps['slots']),
    [dataGridProps.slots, PartnerFooter]
  );

  const slotProps = useMemo(
    () => merge({}, DefaultDataGridStyles.slotProps, dataGridProps.slotProps),
    [dataGridProps.slotProps]
  );

  const [removeOrgFromUser] = useMutation(RemoveOrganizationFromUserDocument);

  const getActions = ({ row }: { row: Partner }) => [
    <GridActionsCellItem
      key="remove"
      icon={<Delete />}
      label="Remove Partner"
      onClick={() =>
        void removeOrgFromUser({
          variables: {
            input: {
              assignment: {
                userId: user.id,
                orgId: row.organization.value!.id,
              },
            },
          },
          update: removeItemFromList({
            listId: [user, 'partners'],
            item: row,
          }),
        })
      }
      color="error"
    />,
  ];

  return (
    <TabPanelContent>
      <DataGrid<Partner>
        {...dataGridProps}
        {...DefaultDataGridStyles}
        slots={slots}
        slotProps={slotProps}
        columns={[
          ...PartnerColumns,
          {
            field: 'actions',
            type: 'actions',
            headerName: 'Remove',
            width: 100,
            hideable: false,
            getActions,
          },
        ]}
        initialState={PartnerInitialState}
        headerFilters
        sx={[flexLayout, noHeaderFilterButtons]}
      />
      <AssignOrgToUserForm {...addPartnerState} user={user} />
    </TabPanelContent>
  );
};
