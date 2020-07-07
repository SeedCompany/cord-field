import { Typography } from '@material-ui/core';
import { pick } from 'lodash';
import React, { FC } from 'react';
import { Except } from 'type-fest';
import { UpdateLanguageEngagementInput } from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { DateField, SubmitError } from '../../../components/form';
import { LanguageEngagementDetailFragment } from '../LanguageEngagement/LanguageEngagementDetail.generated';
import { useUpdateLanguageEngagementMutation } from './EditLanguageEngagementDialog.generated';

type EditLanguageEngagementDialogProps = Except<
  DialogFormProps<UpdateLanguageEngagementInput>,
  'onSubmit' | 'initialValues'
> & {
  engagement: LanguageEngagementDetailFragment;
  editValue?: string;
};

export const EditLanguageEngagementDialog: FC<EditLanguageEngagementDialogProps> = ({
  engagement,
  editValue,
  ...props
}) => {
  const [updateEngagement] = useUpdateLanguageEngagementMutation();

  const title =
    editValue === 'startEndDate'
      ? 'Change Engagement Start and End Dates'
      : editValue === 'completeDate'
      ? 'Change Growth Plan Complete Date '
      : editValue === 'disbursementCompleteDate'
      ? 'Change Disbursement Complete Date '
      : editValue === 'communicationsCompleteDate'
      ? 'Change Communications Complete Date '
      : null;

  const fields =
    editValue &&
    (editValue === 'startEndDate' ? (
      <>
        <Typography>Start Date</Typography>
        <DateField name="engagement.startDate" />
        <Typography>Start Date</Typography>
        <DateField name="engagement.endDate" />
      </>
    ) : [
        'completeDate',
        'disbursementCompleteDate',
        'communicationsCompleteDate',
      ].includes(editValue) ? (
      <>
        <Typography>Complete Date</Typography>
        <DateField name={`engagement.${editValue}`} />
      </>
    ) : null);

  // Filter out relevant initial values so the other values don't get added to the mutation
  const fullEngagementInitialValues = {
    startDate: engagement.startDate.value,
    endDate: engagement.endDate.value,
    completeDate: engagement.completeDate.value,
    disbursementCompleteDate: engagement.disbursementCompleteDate.value,
    communicationsCompleteDate: engagement.communicationsCompleteDate.value,
  };
  const pickKeys =
    editValue === 'startEndDate'
      ? ['id', 'startDate', 'endDate']
      : ['id', editValue || ''];

  const filteredInitialValues = {
    engagement: {
      id: engagement.id,
      ...pick(fullEngagementInitialValues, pickKeys),
    },
  };

  return (
    <DialogForm<UpdateLanguageEngagementInput>
      title={title}
      closeLabel="Close"
      submitLabel="Update Engagement"
      {...props}
      initialValues={filteredInitialValues}
      onSubmit={(input) => {
        updateEngagement({ variables: { input } });
      }}
    >
      <SubmitError />
      {fields}
    </DialogForm>
  );
};
