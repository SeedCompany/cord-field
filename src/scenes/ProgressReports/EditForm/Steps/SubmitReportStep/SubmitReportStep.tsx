import { Box, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Form } from 'react-final-form';
import { RichTextField } from '~/components/RichText';
import { useNavigate } from '~/components/Routing';
import { StepComponent } from '../step.types';
import { ProgressReportStatusFragment } from './ProgressReportStatus.graphql';
import { TransitionButtons } from './TransitionButtons';
import {
  TransitionFormValues,
  useExecuteTransition,
} from './useExecuteTransition';

export const SubmitReportStep: StepComponent = ({ report }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Maintain the old status state while closing the drawer.
  // Prevents a flash of the new status before the drawer closes.
  const [prevStatus, setPrevStatus] = useState<ProgressReportStatusFragment>();

  const executeTransition = useExecuteTransition({
    id: report.id,
    before: () => {
      setPrevStatus(report.status);
    },
    after: () => {
      enqueueSnackbar('Report submitted — Thanks!', {
        variant: 'success',
      });
      navigate('..');
    },
  });

  return (
    <Form<TransitionFormValues> onSubmit={executeTransition}>
      {({ handleSubmit }) => (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ maxWidth: 'sm', mx: 'auto' }}
        >
          <Typography variant="h3" paragraph>
            Submit Report
          </Typography>
          <RichTextField
            name="notes"
            label="Final Notes"
            placeholder="Optional: Audience - internal - Share additional information related to the team or language engagement not covered in the Quarterly Report with Seed Co team members"
          />
          <Typography align="center" paragraph>
            To complete this report, please choose the next action
          </Typography>
          <Box maxWidth={450} mx="auto">
            <TransitionButtons status={prevStatus ?? report.status} />
          </Box>
        </Box>
      )}
    </Form>
  );
};
SubmitReportStep.enableWhen = ({ report }) =>
  report.status.canBypassTransitions || report.status.transitions.length > 0;
