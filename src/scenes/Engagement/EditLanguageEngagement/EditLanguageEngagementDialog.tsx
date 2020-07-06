import { Typography } from '@material-ui/core';
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
};

export const EditLanguageEngagementDialog: FC<EditLanguageEngagementDialogProps> = ({
  engagement,
  ...props
}) => {
  const [updateEngagement] = useUpdateLanguageEngagementMutation();

  return (
    <DialogForm<UpdateLanguageEngagementInput>
      title="Change Engagement Start and End Dates"
      closeLabel="Close"
      submitLabel="Change Dates"
      {...props}
      initialValues={{
        engagement: {
          id: engagement.id,
          startDate: engagement.startDate.value,
          endDate: engagement.endDate.value,
        },
      }}
      onSubmit={(input) => {
        updateEngagement({ variables: { input } });
      }}
    >
      <SubmitError />
      <Typography>Start Date</Typography>
      <DateField name="engagement.startDate" />
      <Typography>Start Date</Typography>
      <DateField name="engagement.endDate" />
    </DialogForm>
  );
};
