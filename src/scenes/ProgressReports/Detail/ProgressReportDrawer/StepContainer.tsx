import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Box, Theme, Typography } from '@mui/material';
import { useNavigate } from '~/components/Routing';
import { useProgressReportContext } from '../../ProgressReportContext';
import { Step0, Step1, Step2, Step3 } from '../TemporarySteps';

const typographyLinkSx = (theme: Theme) => ({
  color: theme.palette.grey[800],
  fontSize: 14,
  cursor: 'pointer',
  marginLeft: 2,
  '&:hover': {
    textDecoration: 'underline',
  },
});

export const StepContainer = () => {
  const { step } = useProgressReportContext();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <StepContainerHeader />
      <Box sx={{ flex: 1, padding: 2, pt: 4 }}>
        {step === 0 && <Step0 />}
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}
      </Box>
    </Box>
  );
};

const StepContainerHeader = () => {
  const {
    nextProgressReportStep,
    previousProgressReportStep,
    setCurrentProgressReport,
  } = useProgressReportContext();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'background.paper',
        padding: 2,
        borderTop: '1px solid #D1DADF',
        borderBottom: '1px solid #D1DADF',
      }}
    >
      <Typography
        component="span"
        sx={typographyLinkSx}
        onClick={() => {
          setCurrentProgressReport(null);
          navigate('');
        }}
      >
        <ArrowBack
          sx={{
            marginRight: 1,
            fontSize: '1rem',
            marginBottom: '-3px',
          }}
        />
        All Reports
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography
          component="span"
          onClick={previousProgressReportStep}
          sx={typographyLinkSx}
        >
          <ArrowBack
            sx={{
              marginRight: 1,
              fontSize: '1rem',
              marginBottom: '-3px',
            }}
          />
          Previous
        </Typography>
        <Typography
          component="span"
          onClick={nextProgressReportStep}
          sx={typographyLinkSx}
        >
          Next
          <ArrowForward
            sx={{
              marginLeft: 1,
              fontSize: '1rem',
              marginBottom: '-3px',
            }}
          />
        </Typography>
      </Box>
    </Box>
  );
};
