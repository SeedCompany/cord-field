import { useMutation } from '@apollo/client';
import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
import {
  EngagementDataGridRowFragment as Engagement,
  EngagementColumns,
  EngagementInitialState,
  EngagementToolbar,
} from '~/components/EngagementDataGrid';
import {
  DefaultDataGridStyles,
  flexLayout,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSource,
} from '~/components/Grid';
import { UpdateLanguageEngagementDocument } from '../../Engagement/EditEngagement/EditEngagementDialog.graphql';
import { EngagementListDocument } from './EngagementList.graphql';

export const EngagementsPanel = () => {
  const [updateLanguageEngagement] = useMutation(
    UpdateLanguageEngagementDocument
  );

  const [dataGridProps] = useDataGridSource({
    query: EngagementListDocument,
    variables: {},
    listAt: 'engagements',
    initialInput: {
      sort: EngagementColumns[0]!.field,
    },
  });

  const slots = useMemo(
    () =>
      merge({}, DefaultDataGridStyles.slots, dataGridProps.slots, {
        toolbar: EngagementToolbar,
      } satisfies DataGridProps['slots']),
    [dataGridProps.slots]
  );

  const slotProps = useMemo(
    () => merge({}, DefaultDataGridStyles.slotProps, dataGridProps.slotProps),
    [dataGridProps.slotProps]
  );

  return (
    <DataGrid<Engagement>
      {...DefaultDataGridStyles}
      {...dataGridProps}
      slots={slots}
      slotProps={slotProps}
      columns={EngagementColumns}
      initialState={EngagementInitialState}
      headerFilters
      hideFooter
      processRowUpdate={async (updatedRow) => {
        if (updatedRow.__typename === 'LanguageEngagement') {
          const updatedEngagement = {
            id: updatedRow.id,
            milestoneReached: updatedRow.milestoneReached.value,
            usingAIAssistedTranslation:
              updatedRow.usingAIAssistedTranslation.value,
          };
          try {
            await updateLanguageEngagement({
              variables: { input: { engagement: updatedEngagement } },
            });
          } catch (error) {
            const milestoneCellMode = dataGridProps.apiRef.current.getCellMode(
              updatedRow.id,
              'milestoneReached'
            );
            dataGridProps.apiRef.current.stopCellEditMode({
              id: updatedRow.id,
              field:
                milestoneCellMode === 'edit'
                  ? 'milestoneReached'
                  : 'usingAIAssistedTranslation',
            });
            return updatedRow;
          }
        }

        return updatedRow;
      }}
      onProcessRowUpdateError={(error) => {
        return error;
      }}
      sx={[flexLayout, noHeaderFilterButtons, noFooter]}
    />
  );
};
