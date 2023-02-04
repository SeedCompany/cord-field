import { useMutation } from '@apollo/client';
import { useMemo } from 'react';
import { UpdateLanguageEngagementInput as UpdateEngagementInput } from '~/api/schema.graphql';
import { DateField, Form, SecuredField } from '../../../../components/form';
import { UpdateLanguageEngagementDocument as UpdateEngagement } from '../../EditEngagement/EditEngagementDialog.graphql';
import { LanguageEngagementDatesFormFragment as Engagement } from './DatesForm.graphql';

export const DatesForm = ({ engagement }: { engagement: Engagement }) => {
  const [updateEngagement] = useMutation(UpdateEngagement);

  const initialValues = useMemo(
    () => ({
      engagement: {
        id: engagement.id,
        completeDate: engagement.completeDate.value,
        disbursementCompleteDate: engagement.disbursementCompleteDate.value,
      },
    }),
    [engagement]
  );

  return (
    <Form<UpdateEngagementInput>
      initialValues={initialValues}
      onSubmit={async (input) => {
        await updateEngagement({ variables: { input } });
      }}
      autoSubmit
      fieldsPrefix="engagement"
    >
      <SecuredField obj={engagement} name="completeDate">
        {(props) => <DateField {...props} label="Translation Complete Date" />}
      </SecuredField>
      <SecuredField obj={engagement} name="disbursementCompleteDate">
        {(props) => <DateField {...props} label="Disbursement Complete Date" />}
      </SecuredField>
    </Form>
  );
};
