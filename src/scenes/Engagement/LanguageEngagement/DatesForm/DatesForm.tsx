import { useMutation } from '@apollo/client';
import { useMemo } from 'react';
import { UpdateLanguageEngagement as UpdateEngagementInput } from '~/api/schema.graphql.ts';
import { DateField, Form, SecuredField } from '../../../../components/form';
import { UpdateLanguageEngagementDocument as UpdateEngagement } from '../../EditEngagement/EditEngagementDialog.graphql.ts';
import { LanguageEngagementDatesFormFragment as Engagement } from './DatesForm.graphql.ts';

export const DatesForm = ({ engagement }: { engagement: Engagement }) => {
  const [updateEngagement] = useMutation(UpdateEngagement);

  const initialValues = useMemo(
    () => ({
      id: engagement.id,
      completeDate: engagement.completeDate.value,
      disbursementCompleteDate: engagement.disbursementCompleteDate.value,
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
