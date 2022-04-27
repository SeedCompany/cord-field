import { useMutation } from '@apollo/client';
import { isEqual, noop } from 'lodash';
import React, { useMemo } from 'react';
import { Form, FormSpy } from 'react-final-form';
import { UpdateLanguageEngagementInput as UpdateEngagementInput } from '../../../../api';
import {
  DateField,
  FieldGroup,
  SecuredField,
} from '../../../../components/form';
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
    <Form<UpdateEngagementInput> initialValues={initialValues} onSubmit={noop}>
      {() => (
        <FieldGroup prefix="engagement">
          <FormSpy<UpdateEngagementInput>
            subscription={{ values: true }}
            onChange={({ values: input }) => {
              if (!isEqual(initialValues, input)) {
                void updateEngagement({ variables: { input } });
              }
            }}
          />
          <SecuredField obj={engagement} name="completeDate">
            {(props) => (
              <DateField {...props} label="Translation Complete Date" />
            )}
          </SecuredField>
          <SecuredField obj={engagement} name="disbursementCompleteDate">
            {(props) => (
              <DateField {...props} label="Disbursement Complete Date" />
            )}
          </SecuredField>
        </FieldGroup>
      )}
    </Form>
  );
};
