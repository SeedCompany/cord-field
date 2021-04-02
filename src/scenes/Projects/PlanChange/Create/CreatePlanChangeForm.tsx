import React from 'react';
import {
  CreatePlanChangeInput,
  displayPlanChangeStatus,
  displayPlanChangeType,
  PlanChangeStatusList,
  PlanChangeTypeList,
} from '../../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../components/Dialog/DialogForm';
import { SubmitError, TextField } from '../../../../components/form';
import { AutocompleteField } from '../../../../components/form/AutocompleteField';

export type CreatePlanChangeFormProps<R> = DialogFormProps<
  CreatePlanChangeInput,
  R
>;

export const CreatePlanChangeForm = <R extends any>(
  props: CreatePlanChangeFormProps<R>
) => (
  <DialogForm {...props} title="Create Change To Plan">
    <SubmitError />
    <AutocompleteField
      multiple
      options={PlanChangeTypeList}
      getOptionLabel={displayPlanChangeType}
      name="planChange.types"
      label="Types"
      variant="outlined"
      required
    />
    <TextField
      name="planChange.summary"
      label="Summary"
      placeholder="Enter summary"
      required
    />
    <AutocompleteField
      options={PlanChangeStatusList}
      getOptionLabel={displayPlanChangeStatus}
      name="planChange.status"
      label="Status"
      variant="outlined"
      required
    />
  </DialogForm>
);
