import { useMutation } from '@apollo/client';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { isEqual } from 'lodash';

export const useGridMutation = <Row, MutationRes, Vars>(
  rowShape: DocumentNode<Row>,
  mutation: DocumentNode<MutationRes, Vars>,
  makeInput: NoInfer<
    (object: Row) =>
      | {
          variables: Vars;
          optimisticResponse: MutationRes;
        }
      | undefined
  >
) => {
  const [update] = useMutation(mutation);

  return (updatedRow: Row, prevRow: Row) => {
    const updatedInput = makeInput(updatedRow);
    const prevInput = makeInput(prevRow);

    if (!updatedInput || !prevInput) {
      return updatedRow;
    }

    if (isEqual(updatedInput.variables, prevInput.variables)) {
      return updatedRow;
    }

    // Don't wait for the mutation to finish/error, which allows
    // the grid to close the editing state immediately.
    // There shouldn't be any business errors from these current changes,
    // and network errors are handled with snackbars.
    // Additionally, MUI doesn't handle thrown errors either; it just gives
    // them straight back to us on the `onProcessRowUpdateError` callback.
    void update({
      variables: updatedInput.variables,
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
      optimisticResponse: updatedInput.optimisticResponse,
    });

    return updatedRow;
  };
};
