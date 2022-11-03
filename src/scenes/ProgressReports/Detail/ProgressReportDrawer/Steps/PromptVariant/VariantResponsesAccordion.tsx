import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { SubmissionErrors } from 'final-form';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { Form } from 'react-final-form';
import { SubmitButton } from '~/components/form';
import { RichTextField, RichTextView } from '~/components/RichText';
import { ProgressReportItemResponseEditFragment } from '../../ProgressReportDrawer.graphql';
import { RoleIcon } from '../../RoleIcon';

export const VariantResponsesAccordion = ({
  response,
  expanded: _expanded,
  onSubmit,
}: {
  response: ProgressReportItemResponseEditFragment;
  expanded?: boolean;
  onSubmit: (input: any) => void | SubmissionErrors | Promise<SubmissionErrors>;
}) => {
  const [expanded, setExpanded] = useState(_expanded ?? false);
  const [savedAt, setSavedAt] = useState<DateTime | null>(null);

  if (response.response.canRead) {
    return (
      <Accordion
        key={response.variant.responsibleRole}
        expanded={expanded}
        elevation={2}
        square
      >
        <AccordionSummary
          aria-controls={`${response.variant.responsibleRole}-content`}
          expandIcon={<ExpandMore />}
          sx={{
            '& .MuiAccordionSummary-content': {
              alignItems: 'center',
            },
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <RoleIcon roleStep={response.variant.responsibleRole} />
          <span>{response.variant.label}</span>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 4 }}>
          {response.response.canEdit ? (
            <Form
              onSubmit={onSubmit}
              initialValues={{
                variant: response.variant.key,
                response: response.response.value,
              }}
            >
              {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <RichTextField name="response" label="Response" />
                  {savedAt && (
                    <Typography
                      variant="caption"
                      sx={{ mb: 1 }}
                      component="div"
                    >
                      Saved at {savedAt.toISO()}
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
          ) : null}
        </AccordionDetails>
      </Accordion>
    );
  }
  return null;
};
