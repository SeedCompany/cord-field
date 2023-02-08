import { Box, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { Form } from 'react-final-form';
import { RichTextField } from '~/components/RichText';
import { useNavigate } from '~/components/Routing';
import { StepComponent } from '../step.types';
import { TransitionButtons } from './TransitionButtons';
import {
  TransitionFormValues,
  useExecuteTransition,
} from './useExecuteTransition';

export const SubmitReportStep: StepComponent = ({ report }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const executeTransition = useExecuteTransition({
    id: report.id,
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
            <TransitionButtons report={report} />
          </Box>
        </Box>
      )}
    </Form>
  );
};
SubmitReportStep.enableWhen = ({ report }) =>
  report.status.canBypassTransitions || report.status.transitions.length > 0;
