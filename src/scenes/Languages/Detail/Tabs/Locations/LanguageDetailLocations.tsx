import { useMutation } from '@apollo/client';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { DataGridPro as DataGrid, GridColDef } from '@mui/x-data-grid-pro';
import { useMemo } from 'react';
import { useIsMobile } from '~/common';
import { useDialog } from '~/components/Dialog';
import {
  DefaultDataGridStyles,
  flexLayout,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSlots,
  useDataGridSource,
} from '~/components/Grid';
import { createAddItemFooter } from '~/components/Grid/createAddItemFooter';
import { EntityList as LanguagesLocationsList } from '~/components/List';
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
  const isMobile = useIsMobile();
  return isMobile ? (
    <LanguagesLocationsList
      query={LanguageLocationsDocument}
      listAt={(data) => data.language.locations}
      variables={{ languageId: language.id }}
      columns={LocationColumns}
      sortDefault={{ field: 'name', direction: 'ASC' }}
      defaultSecondaryField="type"
      primary={(location) => location.name.value}
      to={(location) => `/locations/${location.id}`}
    />
  ) : (
    // The grid (and its `useDataGridSource`) must only mount on desktop — that
    // hook drives a `GridApiPro` ref and would crash if run without a grid.
    <LanguageLocationsGrid language={language} />
  );
};

const LanguageLocationsGrid = ({ language }: LanguageDetailLocationProps) => {
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

  const columns = useMemo(() => {
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
    return [...LocationColumns, ...(locations.canCreate ? [actionsCol] : [])];
  }, [locations.canCreate, id, removeLocation]);

  const LocationFooter = useMemo(
    () =>
      createAddItemFooter({
        addItem: addLocation,
        tooltipTitle: 'Add Location to Language',
      }),
    [addLocation]
  );

  const { slots, slotProps } = useDataGridSlots(props, {
    slots: { toolbar: LocationToolbar, footer: LocationFooter },
  });

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
