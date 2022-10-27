import { ArrowForward } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { Sx } from '~/common';
import { useProgressReportContext } from '../../ProgressReportContext';
import { Step1, Step2, Step3 } from '../TemporarySteps';
import { colorPalette } from './colorPalette';
import { TeamHighlightStep } from './Steps/TeamHighlight';

const typographyLinkSx: Sx = (theme) => ({
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
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <StepContainerHeader />
      <Box sx={{ flex: 1, padding: 2, pt: 1 }}>
        {step === 0 && <TeamHighlightStep />}
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}
      </Box>
    </div>
  );
};

const marginRightSx = {
  marginRight: 2,
};

const isActiveSx: Sx = {
  backgroundColor: 'error.main',
  color: 'white',
  '&:hover': {
    backgroundColor: 'error.dark',
    borderColor: 'error.dark',
  },
};

const StepContainerHeader = () => {
  const { nextProgressReportStep, setPromptVariant, promptVariant } =
    useProgressReportContext();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'background.paper',
        padding: 2,
        borderTop: `1px solid ${colorPalette.header.border}`,
        borderBottom: `1px solid ${colorPalette.header.border}`,
      }}
    >
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div>
          <Typography variant="body2" component="span" marginRight={1}>
            Refinement Roles:
          </Typography>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => setPromptVariant('Partner')}
            sx={[marginRightSx, promptVariant === 'Partner' && isActiveSx]}
          >
            Partner
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => setPromptVariant('Translation')}
            sx={[marginRightSx, promptVariant === 'Translation' && isActiveSx]}
          >
            Translation
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => setPromptVariant('FPM Notes')}
            sx={[marginRightSx, promptVariant === 'FPM Notes' && isActiveSx]}
          >
            FPM
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => setPromptVariant('Communications Edit')}
            sx={[
              marginRightSx,
              promptVariant === 'Communications Edit' && isActiveSx,
            ]}
          >
            Communication
          </Button>
        </div>
        <Typography
          variant="caption"
          color="error"
          sx={{
            fontSize: 10,
            mt: 1,
          }}
        >
          * These buttons are ONLY for testing purposes
        </Typography>
      </div>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
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
