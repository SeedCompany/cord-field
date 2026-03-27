import { DataGridPro as DataGrid } from '@mui/x-data-grid-pro';
import {
  DefaultDataGridStyles,
  flexLayout,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSlots,
  useDataGridSource,
} from '~/components/Grid';
import {
  LanguageDataGridRowFragment as Language,
  LanguageColumns,
  LanguageInitialState,
  LanguageToolbar,
} from '~/components/LanguageDataGrid';
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

  const { slots, slotProps } = useDataGridSlots(dataGridProps, {
    slots: { toolbar: LanguageToolbar },
  });

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
