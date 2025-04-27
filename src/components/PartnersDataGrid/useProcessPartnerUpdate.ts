import { useMutation } from '@apollo/client';
import { DateTime } from 'luxon';
import { UpdatePartner as UpdatePartnerInput } from '~/api/schema.graphql';
import { CalendarDate } from '~/common';
import { PartnerDataGridRowFragment } from './partnerDataGridRow.graphql';
import { UpdatePartnerGridDocument as UpdatePartner } from './UpdatePartnerGrid.graphql';

export const useProcessPartnerUpdate = () => {
  const [updatePartner] = useMutation(UpdatePartner);

  return (
    updated: PartnerDataGridRowFragment,
    prev: PartnerDataGridRowFragment
  ) => {
    // MUI DataGrid provides Date objects for edited dates, while our API returns ISO strings
    // Convert the updated Date to ISO format to compare with prev.startDate.value
    const formatted = updated.startDate
      ? DateTime.fromJSDate(updated.startDate as Date).toISODate()
      : null;

    if (formatted === prev.startDate.value || !formatted) {
      return prev;
    }

    const input: UpdatePartnerInput = {
      id: updated.id,
      startDate: updated.startDate as CalendarDate,
    };

    // Don't wait for the mutation to finish/error, which allows
    // the grid to close the editing state immediately.
    // There shouldn't be any business errors from these current changes,
    // and network errors are handled with snackbars.
    // Additionally, MUI doesn't handle thrown errors either; it just gives
    // them straight back to us on the `onProcessRowUpdateError` callback.
    void updatePartner({
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
        updatePartner: {
          __typename: 'UpdatePartnerOutput',
          // This is an easy/cheap/hacky way to "unparse" the date scalars
          // before writing them to the cache.
          // Our read policies expect them to be ISO strings as we receive
          // them from the network this way.
          // Since our temporal objects have a toJSON, this works fine to revert that.
          partner: JSON.parse(JSON.stringify(updated)),
        },
      },
    });

    return updated;
  };
};
