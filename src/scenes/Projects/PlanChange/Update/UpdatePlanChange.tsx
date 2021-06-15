import { useMutation } from '@apollo/client';
import React from 'react';
import { Except } from 'type-fest';
import {
  displayPlanChangeStatus,
  displayPlanChangeType,
  PlanChangeStatusList,
  PlanChangeTypeList,
  removeItemFromList,
  UpdatePlanChangeInput,
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
import { PlanChangeCardFragment } from '../../../../components/PlanChangeCard/PlanChange.generated';
import { callAll } from '../../../../util';
import { ProjectOverviewDocument } from '../../Overview/ProjectOverview.generated';
import { PlanChangesQuery } from '../List/PlanChanges.generated';
import {
  DeletePlanChangeDocument,
  UpdatePlanChangeDocument,
} from './UpdatePlanChange.generated';

export interface UpdatePlanChangeFormParams {
  project: PlanChangesQuery['project'];
  planChange: PlanChangeCardFragment;
}

type UpdatePlanChangeProps = Except<
  DialogFormProps<UpdatePlanChangeInput>,
  'onSubmit' | 'initialValues'
> &
  UpdatePlanChangeFormParams;

export const UpdatePlanChange = ({
  project,
  planChange,
  ...props
}: UpdatePlanChangeProps) => {
  const [_, setCurrentChangeset] = useCurrentChangeset();
  const [updatePlanChange] = useMutation(UpdatePlanChangeDocument);

  const [deletePlanChange] = useMutation(DeletePlanChangeDocument, {
    update: callAll(
      removeItemFromList({
        listId: [project, 'planChanges'],
        item: { id: planChange.id },
      })
    ),
  });

  return (
    <DialogForm<UpdatePlanChangeInput & SubmitAction<'delete'>>
      title="Update Plan Change"
      closeLabel="Close"
      submitLabel="Save"
      {...props}
      initialValues={{
        planChange: {
          id: planChange.id,
          status: planChange.status.value!,
          types: planChange.types.value,
          summary: planChange.summary.value!,
        },
      }}
      onSubmit={async (input) => {
        if (input.submitAction === 'delete') {
          await deletePlanChange({
            variables: {
              planChangeId: planChange.id,
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
                changeset: planChange.id,
              },
            },
          ],
        });
        // CR is approved
        if (
          input.planChange.status === 'Approved' &&
          planChange.status.value !== input.planChange.status
        ) {
          setCurrentChangeset(null);
        }
      }}
      fieldsPrefix="planChange"
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
        options={PlanChangeTypeList}
        getOptionLabel={displayPlanChangeType}
        name="types"
        label="Types"
        variant="outlined"
      />
      <TextField
        name="summary"
        label="Summary"
        placeholder="Enter summary"
        multiline
        inputProps={{ rowsMin: 2 }}
      />
      <AutocompleteField
        options={PlanChangeStatusList}
        getOptionLabel={displayPlanChangeStatus}
        name="status"
        label="Status"
        variant="outlined"
      />
    </DialogForm>
  );
};
