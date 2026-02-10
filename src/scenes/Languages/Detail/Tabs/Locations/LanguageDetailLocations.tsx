import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
  GridColDef,
} from '@mui/x-data-grid-pro';
import { IconButton, Tooltip } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { merge } from 'lodash';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  DefaultDataGridStyles,
  flexLayout,
  noHeaderFilterButtons,
  useDataGridSource,
} from '~/components/Grid';
import {
  LocationColumns,
  LocationInitialState,
  LocationToolbar,
} from '~/components/LocationDataGrid';
import { TabPanelContent } from '~/components/Tabs';
import {
  LanguageLocationDataGridRowFragment as LanguageLocation,
  LanguageLocationsDocument,
  RemoveLocationFromLanguageDocument,
} from './LanguageLocations.graphql';
import { useDialog } from '~/components/Dialog';
import { AddLocationToLanguageForm } from '~/scenes/Languages/Edit/AddLocationToLanguageForm';
import { createAddItemFooter } from '~/components/Grid/createAddItemFooter';

export const LanguageDetailLocations = () => {
  const { languageId = '' } = useParams();
  const [locationFormState, addLocation] = useDialog();
  const [removeLocation] = useMutation(RemoveLocationFromLanguageDocument);

  const [props] = useDataGridSource({
    query: LanguageLocationsDocument,
    variables: { languageId },
    listAt: 'language.locations',
    initialInput: {
      sort: 'name',
    },
  });

  const columns = useMemo<Array<GridColDef<LanguageLocation>>>(
    () => [
      ...LocationColumns,
      {
        field: 'Remove Location',
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
                removeLocation({
                  variables: {
                    language: languageId,
                    location: location.id,
                  },
                  refetchQueries: [
                    {
                      query: LanguageLocationsDocument,
                      variables: { languageId },
                    },
                  ],
                })
              }
            >
              <DeleteIcon fontSize="small" color="error" />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    []
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
        sx={[flexLayout, noHeaderFilterButtons]}
      />
      <AddLocationToLanguageForm
        languageId={languageId}
        {...locationFormState}
      />
    </TabPanelContent>
  );
};
