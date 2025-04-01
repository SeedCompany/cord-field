import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
import {
  DefaultDataGridStyles,
  flexLayout,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSource,
} from '~/components/Grid';
import {
  LanguageColumns,
  LanguageInitialState,
  LanguageToolbar,
} from '~/components/LanguageDataGrid/LanguageColumns';
import { LanguageListItemFragment as Language } from '~/components/LanguageListItemCard/LanguageListItem.graphql';
import { LanguagesDocument } from './languages.graphql';

export const LanguageGrid = () => {
  const [dataGridProps] = useDataGridSource({
    query: LanguagesDocument,
    variables: { input: {} },
    listAt: 'languages',
    initialInput: {
      sort: LanguageColumns[0]!.field,
    },
  });

  const slots = useMemo(
    () =>
      merge({}, DefaultDataGridStyles.slots, dataGridProps.slots, {
        toolbar: LanguageToolbar,
      } satisfies DataGridProps['slots']),
    [dataGridProps.slots]
  );

  const slotProps = useMemo(
    () => merge({}, DefaultDataGridStyles.slotProps, dataGridProps.slotProps),
    [dataGridProps.slotProps]
  );

  return (
    <DataGrid<Language>
      {...DefaultDataGridStyles}
      {...dataGridProps}
      slots={slots}
      slotProps={slotProps}
      columns={LanguageColumns}
      initialState={LanguageInitialState}
      headerFilters
      hideFooter
      sx={[flexLayout, noHeaderFilterButtons, noFooter]}
    />
  );
};
