import { useMutation } from '@apollo/client';
import { UpdateLanguageEngagement as UpdateLanguageEngagementInput } from '~/api/schema.graphql';
import { EngagementDataGridRowFragment } from './engagementDataGridRow.graphql';
import { UpdateLanguageEngagementGridDocument as UpdateLanguageEngagement } from './UpdateLanguageEngagementGrid.graphql';

export const useProcessEngagementUpdate = () => {
  const [updateLanguageEngagement] = useMutation(UpdateLanguageEngagement);

  return (updated: EngagementDataGridRowFragment) => {
    if (updated.__typename !== 'LanguageEngagement') {
      return updated;
    }

    const input: UpdateLanguageEngagementInput = {
      id: updated.id,
      milestoneReached: updated.milestoneReached.value,
      usingAIAssistedTranslation: updated.usingAIAssistedTranslation.value,
    };
    // Don't wait for the mutation to finish/error, which allows
    // the grid to close the editing state immediately.
    // There shouldn't be any business errors from these current changes,
    // and network errors are handled with snackbars.
    // Additionally, MUI doesn't handle thrown errors either; it just gives
    // them straight back to us on the `onProcessRowUpdateError` callback.
    void updateLanguageEngagement({
      variables: { input },
      // Inform Apollo of these async/queued updates.
      // This is important because users can make multiple changes
      // quickly, since we don't `await` above.
      // These optimistic updates are layered/stacked.
      // So if two value changes are in flight, the value from the first
      // API response isn't presented as the latest value,
      // since there is still another optimistic update left.
      // Said another way: this prevents the UI from presenting the final change,
      // then looking like it reverted to the first change,
      // and then flipping back to the final change again.
      // This also ensures these pending updates are maintained
      // even if the grid is unmounted/remounted.
      optimisticResponse: {
        updateLanguageEngagement: {
          __typename: 'UpdateLanguageEngagementOutput',
          // This is an easy/cheap/hacky way to "unparse" the date scalars
          // before writing them to the cache.
          // Our read policies expect them to be ISO strings as we receive
          // them from the network this way.
          // Since our temporal objects have a toJSON, this works fine to revert that.
          engagement: JSON.parse(JSON.stringify(updated)),
        },
      },
    });

    return updated;
  };
};
