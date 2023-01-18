import { Box, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { Form } from 'react-final-form';
import { RichTextField } from '~/components/RichText';
import { useNavigate } from '~/components/Routing';
import { ReportProp } from '../../ReportProp';
import { TransitionButtons } from './TransitionButtons';
import {
  TransitionFormValues,
  useExecuteTransition,
} from './useExecuteTransition';

export const SubmitReportStep = ({ report }: ReportProp) => {
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
          <RichTextField name="notes" label="Final Notes" />
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
