import { Typography } from '@mui/material';
import { ReactNode, useState } from 'react';
import { Scalars } from '~/api/schema/schema.graphql';
import { VariantResponseFragment as VariantResponse } from '~/common/fragments';
import { Form, FormProps, SavingStatus } from '~/components/form';
import { RichTextField, RichTextView } from '~/components/RichText';
import { VariantAccordion } from '../VariantAccordion';
import { InstructionsToggle } from './VariantInstructionsToggle';

interface FormShape {
  variant: string;
  response: Scalars['RichText'] | null;
}

export interface VariantResponsesAccordionProps
  extends Pick<FormProps<FormShape>, 'onSubmit'> {
  response: VariantResponse;
  expanded?: boolean;
  instructions?: ReactNode;
}

export const VariantResponsesAccordion = ({
  response,
  expanded,
  instructions,
  onSubmit,
}: VariantResponsesAccordionProps) => {
  const [initialValues] = useState(() => ({
    variant: response.variant.key,
    response: response.response.value,
  }));

  if (!response.response.canRead) {
    return null;
  }

  return (
    <VariantAccordion variant={response.variant} expanded={expanded}>
      {response.response.canEdit ? (
        <Form<FormShape>
          onSubmit={onSubmit}
          initialValues={initialValues}
          autoSubmit
        >
          {({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
              {instructions && (
                <InstructionsToggle sx={{ mb: 2 }}>
                  {instructions}
                </InstructionsToggle>
              )}

              <RichTextField
                name="response"
                label="Response"
                tools={['paragraph', 'delimiter', 'marker', 'list']}
                // Only marketing writers should be concerned with this.
                // Everyone else we want as much info as possible.
                showCharacterCount={
                  response.variant.responsibleRole === 'Marketing'
                }
                helperText={
                  <SavingStatus
                    submitting={submitting}
                    savedAt={response.modifiedAt}
                  />
                }
              />
            </form>
          )}
        </Form>
      ) : response.response.value ? (
        <RichTextView data={response.response.value} />
      ) : (
        <Typography color="textSecondary" paragraph>
          No response given yet
        </Typography>
      )}
    </VariantAccordion>
  );
};
