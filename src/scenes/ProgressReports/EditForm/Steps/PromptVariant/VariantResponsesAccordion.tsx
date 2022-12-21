import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { Form, FormProps } from 'react-final-form';
import { Scalars } from '~/api/schema/schema.graphql';
import { VariantResponseFragment as VariantResponse } from '~/common/fragments';
import { SubmitButton } from '~/components/form';
import { FormattedDateTime } from '~/components/Formatters';
import { RichTextField, RichTextView } from '~/components/RichText';
import { RoleIcon } from '../../RoleIcon';

interface FormShape {
  variant: string;
  response: Scalars['RichText'] | null;
}

export interface VariantResponsesAccordionProps
  extends Pick<FormProps<FormShape>, 'onSubmit'> {
  response: VariantResponse;
  expanded?: boolean;
}

export const VariantResponsesAccordion = ({
  response,
  expanded: _expanded,
  onSubmit,
}: VariantResponsesAccordionProps) => {
  const [expanded, setExpanded] = useState(_expanded ?? false);
  const [savedAt, setSavedAt] = useState<DateTime | null>(null);

  if (!response.response.canRead) {
    return null;
  }

  return (
    <Accordion
      key={response.variant.key}
      expanded={expanded}
      elevation={2}
      square
    >
      <AccordionSummary
        aria-controls={`${response.variant.key}-content`}
        expandIcon={<ExpandMore />}
        sx={{
          '& .MuiAccordionSummary-content': {
            alignItems: 'center',
          },
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <RoleIcon variantRole={response.variant.responsibleRole} />
        <span>{response.variant.label}</span>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 4 }}>
        {response.response.canEdit ? (
          <Form<FormShape>
            onSubmit={onSubmit}
            initialValues={{
              variant: response.variant.key,
              response: response.response.value,
            }}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <RichTextField
                  name="response"
                  label="Response"
                  tools={['paragraph', 'delimiter', 'marker']}
                  // Only marketing writers should be concerned with this.
                  // Everyone else we want as much info as possible.
                  showCharacterCount={
                    response.variant.responsibleRole === 'Marketing'
                  }
                />
                {savedAt && (
                  <Typography variant="caption" sx={{ mb: 1 }} component="div">
                    Saved at <FormattedDateTime date={savedAt} relative />
                  </Typography>
                )}
                <SubmitButton
                  variant="outlined"
                  color="secondary"
                  onClick={() => setSavedAt(DateTime.now())}
                >
                  Save Progress
                </SubmitButton>
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
      </AccordionDetails>
    </Accordion>
  );
};
