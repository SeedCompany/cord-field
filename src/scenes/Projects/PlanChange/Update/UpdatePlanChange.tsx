import { useMutation } from '@apollo/client';
import { Container } from '@material-ui/core';
import React from 'react';
import { Except } from 'type-fest';
import {
  displayPlanChangeStatus,
  displayPlanChangeType,
  PlanChangeStatusList,
  PlanChangeTypeList,
  removeItemFromList,
  UpdatePlanChangeInput,
} from '../../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import {
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
  const [updatePlanChange] = useMutation(UpdatePlanChangeDocument);

  const [deletePlanChange] = useMutation(DeletePlanChangeDocument, {
    update: callAll(
      removeItemFromList({
        listId: 'planChanges',
        item: { id: planChange.id },
      }),
      removeItemFromList({
        listId: [project, 'changes'],
        item: { id: planChange.id },
      })
    ),
  });

  return (
    <DialogForm<UpdatePlanChangeInput>
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
        await updatePlanChange({
          variables: { input },
          refetchQueries: [
            {
              query: ProjectOverviewDocument,
              variables: {
                input: project.id,
                changeId: planChange.id,
              },
            },
          ],
        });
      }}
      fieldsPrefix="planChange"
      leftAction={
        <SubmitButton
          action="delete"
          color="error"
          fullWidth={false}
          variant="text"
          onClick={async () => {
            await deletePlanChange({
              variables: {
                planChangeId: planChange.id,
              },
            });
          }}
        >
          Delete
        </SubmitButton>
      }
    >
      <Container>
        <SubmitError />
        <AutocompleteField
          multiple
          options={PlanChangeTypeList}
          getOptionLabel={displayPlanChangeType}
          name="types"
          label="Types"
          variant="outlined"
        />
        <TextField name="summary" label="Summary" placeholder="Enter summary" />
        <AutocompleteField
          options={PlanChangeStatusList}
          getOptionLabel={displayPlanChangeStatus}
          name="status"
          label="Status"
          variant="outlined"
        />
      </Container>
    </DialogForm>
  );
};
