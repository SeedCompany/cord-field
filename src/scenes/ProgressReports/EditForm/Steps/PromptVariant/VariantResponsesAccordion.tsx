import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Scalars } from '~/api/schema/schema.graphql';
import { VariantResponseFragment as VariantResponse } from '~/common/fragments';
import { Form, FormProps, SavingStatus } from '~/components/form';
import { RichTextField, RichTextView } from '~/components/RichText';
import { RoleIcon } from '~/components/RoleIcon';

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
  const [initialValues] = useState(() => ({
    variant: response.variant.key,
    response: response.response.value,
  }));

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
            initialValues={initialValues}
            autoSubmit
          >
            {({ handleSubmit, submitting }) => (
              <form onSubmit={handleSubmit}>
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
      </AccordionDetails>
    </Accordion>
  );
};
