import { useMutation } from '@apollo/client';
import { ArrowBack } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { Form } from 'react-final-form';
import { SubmitButton } from '~/components/form';
import { ButtonLink } from '~/components/Routing';
import { useProgressReportContext } from './ProgressReportContext';
import { TransitionProgressReportDocument } from './Steps/SubmitReportStep/TransitionProgressReport.graphql';

export const StartReportPage = () => {
  const { report } = useProgressReportContext();
  const [executeTransition] = useMutation(TransitionProgressReportDocument);

  const inProgressTransition = report.status.transitions.find(
    (t) => t.to === 'InProgress'
  );

  const onSubmit = async () => {
    await executeTransition({
      variables: {
        input: {
          report: report.id,
          transition: inProgressTransition?.id,
        },
      },
    });
  };

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
        {inProgressTransition ? (
          <>
            <Typography lineHeight="initial" paddingY={2}>
              This report has not yet been started. Click the button if you are
              ready to start reporting information for this quarter.
            </Typography>
            <Form onSubmit={onSubmit}>
              {({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <SubmitButton
                    color="primary"
                    variant="contained"
                    size="large"
                  >
                    Start Report
                  </SubmitButton>
                </form>
              )}
            </Form>
          </>
        ) : (
          <Typography variant="h2" paddingY={2}>
            This report has not yet been started
          </Typography>
        )}
      </Box>
    </Box>
  );
};
