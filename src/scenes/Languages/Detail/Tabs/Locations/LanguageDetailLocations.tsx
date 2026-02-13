import { useMutation } from '@apollo/client';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
  GridColDef,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
import { useDialog } from '~/components/Dialog';
import {
  DefaultDataGridStyles,
  flexLayout,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSource,
} from '~/components/Grid';
import { createAddItemFooter } from '~/components/Grid/createAddItemFooter';
import {
  LocationColumns,
  LocationInitialState,
  LocationToolbar,
} from '~/components/LocationDataGrid';
import { TabPanelContent } from '~/components/Tabs';
import { AddLocationToLanguageForm } from '../../../../Languages/Edit/AddLocationToLanguageForm';
import { LanguageDetailFragment } from '../../LanguageDetail.graphql';
import {
  LanguageLocationDataGridRowFragment as LanguageLocation,
  LanguageLocationsDocument,
  RemoveLocationFromLanguageDocument,
} from './LanguageLocations.graphql';

interface LanguageDetailLocationProps {
  language: LanguageDetailFragment;
}

export const LanguageDetailLocations = ({
  language,
}: LanguageDetailLocationProps) => {
  const { id, locations } = language;
  const [locationFormState, addLocation] = useDialog();

  const [removeLocation] = useMutation(RemoveLocationFromLanguageDocument);
  const [props] = useDataGridSource({
    query: LanguageLocationsDocument,
    variables: { languageId: id },
    listAt: 'language.locations',
    initialInput: {
      sort: 'name',
    },
  });

  const actionsCol: GridColDef<LanguageLocation> = {
    field: 'actions',
    headerName: '',
    width: 60,
    align: 'center',
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    hideable: false,
    renderCell: ({ row: location }) => (
      <Tooltip title="Remove Location">
        <IconButton
          size="small"
          onClick={() =>
            void removeLocation({
              variables: {
                language: id,
                location: location.id,
              },
              refetchQueries: [LanguageLocationsDocument],
            })
          }
        >
          <DeleteIcon fontSize="small" color="error" />
        </IconButton>
      </Tooltip>
    ),
  };

  const columns = useMemo(
    () => [...LocationColumns, ...(locations.canCreate ? [actionsCol] : [])],
    [locations.canCreate, removeLocation, language]
  );

  const LocationFooter = useMemo(
    () =>
      createAddItemFooter({
        addItem: addLocation,
        tooltipTitle: 'Add Location to Language',
      }),
    [addLocation]
  );

  const slots = useMemo(
    () =>
      merge({}, DefaultDataGridStyles.slots, props.slots, {
        toolbar: LocationToolbar,
        footer: LocationFooter,
      } satisfies DataGridProps['slots']),
    [props.slots, LocationFooter]
  );

  const slotProps = useMemo(
    () => merge({}, DefaultDataGridStyles.slotProps, props.slotProps),
    [props.slotProps]
  );

  return (
    <TabPanelContent>
      <DataGrid<LanguageLocation>
        {...DefaultDataGridStyles}
        {...props}
        slots={slots}
        slotProps={slotProps}
        columns={columns}
        initialState={LocationInitialState}
        headerFilters
        hideFooter={!locations.canCreate}
        sx={[flexLayout, noHeaderFilterButtons, noFooter]}
      />
      {locations.canCreate && (
        <AddLocationToLanguageForm languageId={id} {...locationFormState} />
      )}
    </TabPanelContent>
  );
};
