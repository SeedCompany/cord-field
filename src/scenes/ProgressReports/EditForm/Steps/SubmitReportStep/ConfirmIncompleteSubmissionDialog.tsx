import { Box, Typography } from '@mui/material';
import { kebabCase } from 'lodash';
import { DialogForm, DialogFormProps } from '~/components/Dialog/DialogForm';
import { Link } from '~/components/Routing';
import { useProgressReportContext } from '../../ProgressReportContext';

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
    <Typography paragraph>
      The following was not updated or left blank:
    </Typography>
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
            component="span"
            textTransform="uppercase"
          >
            {groupName}
          </Typography>
          <Box component="ul" sx={{ listStyle: 'disc', pl: 4, mb: 1 }}>
            {steps.map(([stepName]) => (
              <Typography component="li" key={stepName}>
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
