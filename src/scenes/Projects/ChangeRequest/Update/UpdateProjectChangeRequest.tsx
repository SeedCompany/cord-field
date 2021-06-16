import { useMutation } from '@apollo/client';
import React from 'react';
import { Except } from 'type-fest';
import {
  displayPlanChangeStatus,
  displayProjectChangeRequestType,
  ProjectChangeRequestStatusList,
  ProjectChangeRequestTypeList,
  removeItemFromList,
  UpdateProjectChangeRequestInput,
  useCurrentChangeset,
} from '../../../../api';
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
import { callAll } from '../../../../util';
import { ProjectOverviewDocument } from '../../Overview/ProjectOverview.generated';
import { ProjectChangeRequestListQuery as ListQuery } from '../List';
import {
  DeleteProjectChangeRequestDocument as DeleteRequest,
  UpdateProjectChangeRequestDocument as UpdateRequest,
} from './UpdateProjectChangeRequest.generated';

export interface UpdatePlanChangeFormParams {
  project: ListQuery['project'];
  changeRequest: ChangeRequest;
}

type FormShape = UpdateProjectChangeRequestInput & SubmitAction<'delete'>;

type UpdatePlanChangeProps = Except<
  DialogFormProps<FormShape>,
  'onSubmit' | 'initialValues'
> &
  UpdatePlanChangeFormParams;

export const UpdateProjectChangeRequest = ({
  project,
  changeRequest,
  ...props
}: UpdatePlanChangeProps) => {
  const [_, setCurrentChangeset] = useCurrentChangeset();
  const [updatePlanChange] = useMutation(UpdateRequest);
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
      initialValues={{
        projectChangeRequest: {
          id: changeRequest.id,
          status: changeRequest.status.value!,
          types: changeRequest.types.value,
          summary: changeRequest.summary.value!,
        },
      }}
      onSubmit={async (input) => {
        if (input.submitAction === 'delete') {
          await deletePlanChange({
            variables: {
              id: changeRequest.id,
            },
          });
          return;
        }

        await updatePlanChange({
          variables: { input },
          refetchQueries: [
            {
              query: ProjectOverviewDocument,
              variables: {
                input: project.id,
                changeset: changeRequest.id,
              },
            },
          ],
        });
        // Change Request is approved
        if (
          input.projectChangeRequest.status === 'Approved' &&
          changeRequest.status.value !== input.projectChangeRequest.status
        ) {
          setCurrentChangeset(null);
        }
      }}
      fieldsPrefix="projectChangeRequest"
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
        getOptionLabel={displayProjectChangeRequestType}
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
        inputProps={{ rowsMin: 2 }}
      />
      <AutocompleteField
        options={ProjectChangeRequestStatusList}
        getOptionLabel={displayPlanChangeStatus}
        name="status"
        label="Status"
        variant="outlined"
        required
      />
    </DialogForm>
  );
};
