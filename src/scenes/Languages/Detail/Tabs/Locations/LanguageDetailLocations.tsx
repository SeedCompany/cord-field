import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  DefaultDataGridStyles,
  flexLayout,
  noFooter,
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
} from './LanguageLocations.graphql';

export const LanguageDetailLocations = () => {
  const { languageId = '' } = useParams();

  const [props] = useDataGridSource({
    query: LanguageLocationsDocument,
    variables: { languageId },
    listAt: 'language.locations',
    initialInput: {
      sort: 'name',
    },
  });

  const slots = useMemo(
    () =>
      merge({}, DefaultDataGridStyles.slots, props.slots, {
        toolbar: LocationToolbar,
      } satisfies DataGridProps['slots']),
    [props.slots]
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
        columns={LocationColumns}
        initialState={LocationInitialState}
        headerFilters
        hideFooter
        sx={[flexLayout, noHeaderFilterButtons, noFooter]}
      />
    </TabPanelContent>
  );
};
