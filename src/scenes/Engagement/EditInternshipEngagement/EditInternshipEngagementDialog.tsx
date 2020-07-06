import { Typography } from '@material-ui/core';
import { startCase } from 'lodash';
import React, { FC } from 'react';
import { Except } from 'type-fest';
import {
  MethodologyToApproach,
  UpdateInternshipEngagementInput,
} from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import {
  CheckboxesField,
  CheckboxOption,
  DateField,
  SubmitError,
} from '../../../components/form';
import { InternshipEngagementDetailFragment } from '../InternshipEngagement/InternshipEngagement.generated';
import { useUpdateInternshipEngagementMutation } from './EditInternshipEngagementDialog.generated';

type EditInternshipEngagementDialogProps = Except<
  DialogFormProps<UpdateInternshipEngagementInput>,
  'onSubmit' | 'initialValues'
> & {
  engagement: InternshipEngagementDetailFragment;
  editValue?: string;
};

export const EditInternshipEngagementDialog: FC<EditInternshipEngagementDialogProps> = ({
  engagement,
  editValue,
  ...props
}) => {
  const [updateEngagement] = useUpdateInternshipEngagementMutation();

  const title =
    editValue === 'startEndDate'
      ? 'Change Engagement Start and End Dates'
      : editValue === 'completeDate'
      ? 'Change Growth Plan Complete Date'
      : editValue === 'disbursementCompleteDate'
      ? 'Change Disbursement Complete Date'
      : editValue === 'communicationsCompleteDate'
      ? 'Change Communications Complete Date'
      : editValue === 'methodologies'
      ? 'Change Methodologies'
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
    ) : editValue === 'methodologies' ? (
      <>
        <Typography>Methodologies</Typography>
        <CheckboxesField name="engagement.methodologies">
          {Object.keys(MethodologyToApproach).map((group) => (
            <CheckboxOption
              key={group}
              label={startCase(group)}
              value={group}
            />
          ))}
        </CheckboxesField>
      </>
    ) : null);

  return (
    <DialogForm<UpdateInternshipEngagementInput>
      title={title}
      closeLabel="Close"
      submitLabel="Update Engagement"
      {...props}
      initialValues={{
        engagement: {
          id: engagement.id,
          startDate: engagement.startDate.value,
          endDate: engagement.endDate.value,
          completeDate: engagement.completeDate.value,
          disbursementCompleteDate: engagement.disbursementCompleteDate.value,
          communicationsCompleteDate:
            engagement.communicationsCompleteDate.value,
          methodologies: engagement.methodologies.value,
        },
      }}
      onSubmit={(input) => {
        updateEngagement({ variables: { input } });
      }}
    >
      <SubmitError />
      {fields}
    </DialogForm>
  );
};
