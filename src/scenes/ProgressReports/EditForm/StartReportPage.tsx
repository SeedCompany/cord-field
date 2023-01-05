import { ArrowBack } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { Form } from 'react-final-form';
import { ButtonLink } from '~/components/Routing';
import { ReportProp } from './ReportProp';
import { TransitionButtons } from './Steps/SubmitReportStep/TransitionButtons';
import { useExecuteTransition } from './Steps/SubmitReportStep/useExecuteTransition';

export const StartReportPage = ({ report }: ReportProp) => {
  const onSubmit = useExecuteTransition({
    id: report.id,
  });

  return (
    <Box
      sx={{
        display: 'flex',
        width: 1,
        flex: 1,
        flexDirection: 'column',
        p: 2,
      }}
    >
      <Box sx={{ display: 'flex' }}>
        <ButtonLink
          to=".."
          color="secondary"
          startIcon={<ArrowBack />}
          sx={{ alignSelf: 'start' }}
        >
          Back
        </ButtonLink>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          width: 1,
          maxWidth: 600,
          height: '100%',
          mx: 'auto',
          px: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" paragraph>
          This report has not yet been started
        </Typography>
        {(report.status.transitions.length > 0 ||
          report.status.canBypassTransitions) && (
          <Typography paragraph>
            Click the button if you are ready to start reporting information for
            this quarter.
          </Typography>
        )}
        <Form onSubmit={onSubmit}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <TransitionButtons report={report} size="large" />
            </form>
          )}
        </Form>
      </Box>
    </Box>
  );
};
