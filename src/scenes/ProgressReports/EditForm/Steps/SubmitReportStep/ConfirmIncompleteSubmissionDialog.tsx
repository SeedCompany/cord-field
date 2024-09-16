import { Warning } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { kebabCase } from 'lodash';
import { DialogForm, DialogFormProps } from '~/components/Dialog/DialogForm';
import { Link } from '~/components/Routing';
import { useProgressReportContext } from '../../ProgressReportContext';
import { IncompleteSeverity } from '../step.types';

export const ConfirmIncompleteSubmissionDialog = (
  props: DialogFormProps<void>
) => (
  <DialogForm
    title={
      <>
        Submit <em>incomplete</em> report?
      </>
    }
    SubmitProps={{ color: 'primary' }}
    sendIfClean
    {...props}
  >
    <Typography paragraph>The following was left blank:</Typography>
    <IncompleteSteps />
  </DialogForm>
);

const IncompleteSteps = () => {
  const { incompleteSteps } = useProgressReportContext();
  return (
    <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {Object.entries(incompleteSteps).map(([groupName, steps]) => (
        <li key={groupName}>
          <Typography
            variant="body2"
            component="div"
            textTransform="uppercase"
            sx={{ mb: 1 }}
          >
            {groupName}
          </Typography>
          <Box
            component="ul"
            sx={{
              listStyle: 'none',
              pl: 0,
              mb: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            {steps.map(({ label: stepName, severity }) => (
              <Typography
                component="li"
                key={stepName}
                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
              >
                <Box
                  component="span"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mr: 1,
                    ml: 2,
                  }}
                >
                  <IncompleteSeverityIcon severity={severity} />
                </Box>
                <Link
                  color="inherit"
                  // Carson doesn't love this logic being duplicated here,
                  // but values semantic markup more
                  to={{ search: `?step=${kebabCase(stepName)}` }}
                >
                  {stepName}
                </Link>
              </Typography>
            ))}
          </Box>
        </li>
      ))}
    </Box>
  );
};

const IncompleteSeverityIcon = ({
  severity,
}: {
  severity: IncompleteSeverity;
}) => {
  return (
    <Warning color="warning" />
  );
};
