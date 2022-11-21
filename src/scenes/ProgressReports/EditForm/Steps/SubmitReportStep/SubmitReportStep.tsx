import { useMutation } from '@apollo/client';
import { Box, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { Form } from 'react-final-form';
import { useDialog } from '~/components/Dialog';
import { SubmitButton } from '~/components/form';
import { FormattedDateTime } from '~/components/Formatters';
import { RichTextField } from '~/components/RichText';
import { useProgressReportContext } from '../../ProgressReportContext';
import { TransitionProgressReportDocument } from './SubmitReportStep.graphql';
import { SuccessDialog } from './SuccessDialog';

export const SubmitReportStep = () => {
  const { report } = useProgressReportContext();
  const [savedAt, setSavedAt] = useState<DateTime | null>(null);
  const [submitReport] = useMutation(TransitionProgressReportDocument);
  const [successState, showSuccess] = useDialog();

  const onSubmit = (values: any) => {
    setSavedAt(DateTime.local());
    void submitReport({
      variables: {
        input: {
          notes: values.notes,
          report: report.id,
          transition: values.submitAction,
        },
      },
    });

    showSuccess();
  };

  return (
    <div>
      <Typography variant="h3" gutterBottom>
        Submit Report
      </Typography>
      <Typography variant="body2" gutterBottom>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elit pharetra
        enim justo, molestie amet viverra faucibus. Egestas congue felis
        <br />
        You are editing a {report.status.value} report.
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Form onSubmit={onSubmit}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <RichTextField name="notes" label="Final Notes" />
              {savedAt && (
                <Typography variant="caption" sx={{ mb: 1 }} component="div">
                  Saved at <FormattedDateTime date={savedAt} relative />
                </Typography>
              )}
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" sx={{ mb: 1 }} component="div">
                  To complete this report, please choose the next action.
                </Typography>
                {report.status.transitions.map((transition) => (
                  <SubmitButton
                    variant="outlined"
                    color="secondary"
                    key={transition.id}
                    action={transition.id}
                    onClick={() => setSavedAt(DateTime.now())}
                  >
                    {transition.label}
                  </SubmitButton>
                ))}
              </Box>
            </form>
          )}
        </Form>
      </Box>
      <SuccessDialog {...successState} />
    </div>
  );
};
