import { useGridMutation } from '../Grid';
import { EngagementDataGridRowFragmentDoc as EngagementGridRow } from './engagementDataGridRow.graphql';
import { UpdateLanguageEngagementGridDocument as UpdateLanguageEngagement } from './UpdateLanguageEngagementGrid.graphql';

export const useProcessEngagementUpdate = () =>
  useGridMutation(EngagementGridRow, UpdateLanguageEngagement, (row) => {
    if (row.__typename !== 'LanguageEngagement') {
      return undefined;
    }
    return {
      variables: {
        input: {
          id: row.id,
          milestoneReached: row.milestoneReached.value,
          usingAIAssistedTranslation: row.usingAIAssistedTranslation.value,
        },
      },
      optimisticResponse: {
        updateLanguageEngagement: {
          __typename: 'UpdateLanguageEngagementOutput',
          engagement: row,
        },
      },
    };
  });
