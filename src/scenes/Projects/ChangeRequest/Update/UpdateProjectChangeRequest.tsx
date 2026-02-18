import { useMutation } from '@apollo/client';
import { Except } from 'type-fest';
import { removeItemFromList } from '~/api';
import {
  ProjectChangeRequestStatusLabels,
  ProjectChangeRequestStatusList,
  ProjectChangeRequestTypeLabels,
  ProjectChangeRequestTypeList,
  UpdateProjectChangeRequest as UpdateProjectChangeRequestInput,
} from '~/api/schema.graphql';
import { callAll, labelFrom } from '~/common';
import { ProjectIdFragment } from '~/common/fragments';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import {
  SubmitAction,
  SubmitButton,
  SubmitError,
  TextField,
} from '../../../../components/form';
import { AutocompleteField } from '../../../../components/form/AutocompleteField';
import { ProjectChangeRequestListItemFragment as ChangeRequest } from '../../../../components/ProjectChangeRequestListItem';
import { useProjectId } from '../../useProjectId';
import {
  DeleteProjectChangeRequestDocument as DeleteRequest,
  UpdateProjectChangeRequestDocument as UpdateRequest,
} from './UpdateProjectChangeRequest.graphql';

export interface UpdateProjectChangeRequestFormParams {
  project: ProjectIdFragment;
  changeRequest: ChangeRequest;
}

type FormShape = UpdateProjectChangeRequestInput & SubmitAction<'delete'>;

type UpdatePlanChangeProps = Except<
  DialogFormProps<FormShape>,
  'onSubmit' | 'initialValues'
> &
  UpdateProjectChangeRequestFormParams;

export const UpdateProjectChangeRequest = ({
  project,
  changeRequest,
  ...props
}: UpdatePlanChangeProps) => {
  const { closeChangeset } = useProjectId();
  const [updatePlanChange, { client }] = useMutation(UpdateRequest);
  const [deletePlanChange] = useMutation(DeleteRequest, {
    update: callAll(
      removeItemFromList({
        listId: [project, 'changeRequests'],
        item: { id: changeRequest.id },
      })
    ),
  });

  return (
    <DialogForm<FormShape>
      title="Update Change Request"
      closeLabel="Close"
      submitLabel="Save"
      {...props}
      sendIfClean="delete"
      disableChangesetWarning
      initialValues={{
        id: changeRequest.id,
        status: changeRequest.status.value!,
        types: changeRequest.types.value,
        summary: changeRequest.summary.value!,
      }}
      onSubmit={async (input) => {
        if (input.submitAction === 'delete') {
          await deletePlanChange({
            variables: {
              id: changeRequest.id,
            },
          });
          closeChangeset();
          return;
        }

        await updatePlanChange({
          variables: { input },
        });
        // Change Request is approved
        if (
          input.status === 'Approved' &&
          changeRequest.status.value !== input.status
        ) {
          closeChangeset();
          // A change request approval can have such wide-spread implications,
          // and it's not a common action, so the easiest solution is just to
          // wipe the cache.
          await client.resetStore();
        }
      }}
      leftAction={
        <SubmitButton
          action="delete"
          color="error"
          fullWidth={false}
          variant="text"
        >
          Delete
        </SubmitButton>
      }
    >
      <SubmitError />
      <AutocompleteField
        multiple
        options={ProjectChangeRequestTypeList}
        getOptionLabel={labelFrom(ProjectChangeRequestTypeLabels)}
        name="types"
        label="Types"
        variant="outlined"
        required
      />
      <TextField
        name="summary"
        label="Summary"
        placeholder="Why is this change request needed?"
        variant="outlined"
        required
        multiline
        minRows={2}
      />
      <AutocompleteField
        options={ProjectChangeRequestStatusList}
        getOptionLabel={labelFrom(ProjectChangeRequestStatusLabels)}
        name="status"
        label="Status"
        variant="outlined"
        required
      />
    </DialogForm>
  );
};
