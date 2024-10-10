import {
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Alert, Stack, SvgIconProps, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FORM_ERROR } from 'final-form';
import { kebabCase } from 'lodash';
import { useFeatureFlagVariantKey } from 'posthog-js/react';
import { DialogForm, DialogFormProps } from '~/components/Dialog/DialogForm';
import { VisibilityAndClickTracker } from '~/components/Feature';
import { Link } from '~/components/Routing';
import { useProgressReportContext } from '../../ProgressReportContext';
import { IncompleteSeverity } from '../step.types';

const blockRequireFlag = 'progress-report-block-submit-on-required-error';

export const ConfirmIncompleteSubmissionDialog = (
  props: DialogFormProps<void>
) => {
  const { incompleteSeverities } = useProgressReportContext();
  const blockRequired = useFeatureFlagVariantKey(blockRequireFlag);
  return (
    <VisibilityAndClickTracker
      flag={blockRequireFlag}
      trackView={props.open}
      trackInteraction={props.open}
    >
      <DialogForm
        title={
          <>
            Submit <em>incomplete</em> report?
          </>
        }
        SubmitProps={{ color: 'primary' }}
        sendIfClean
        {...props}
        validate={() =>
          incompleteSeverities.has('required') && blockRequired
            ? { [FORM_ERROR]: 'Fill out the required steps first' }
            : undefined
        }
      >
        {({ error, submitFailed }) => (
          <Stack gap={2}>
            <Typography>The following was left blank:</Typography>
            <IncompleteSteps />
            {error && submitFailed && <Alert severity="error">{error}</Alert>}
          </Stack>
        )}
      </DialogForm>
    </VisibilityAndClickTracker>
  );
};

const IncompleteSteps = () => {
  const { incompleteSteps } = useProgressReportContext();
  return (
    <Stack component={UL} sx={{ gap: 1 }}>
      {Object.entries(incompleteSteps).map(([groupName, steps]) => (
        <li key={groupName}>
          <Typography variant="body2" textTransform="uppercase" gutterBottom>
            {groupName}
          </Typography>
          <Stack component={UL} sx={{ gap: 1, ml: 2 }}>
            {steps.map(({ label: stepName, severity }) => (
              <Typography component="li" key={stepName}>
                <Link
                  // Carson doesn't love this logic being duplicated here,
                  // but values semantic markup more
                  to={{ search: `?step=${kebabCase(stepName)}` }}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <SeverityIcon severity={severity} sx={{ mr: 1 }} />
                  {stepName}
                </Link>
              </Typography>
            ))}
          </Stack>
        </li>
      ))}
    </Stack>
  );
};

const UL = styled('ul')({
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

const SeverityIcon = ({
  severity,
  ...rest
}: {
  severity: IncompleteSeverity;
} & SvgIconProps) =>
  severity === 'required' ? (
    <Tooltip title="Required">
      <ErrorIcon color="error" {...rest} />
    </Tooltip>
  ) : (
    <Tooltip title="Recommended">
      <WarningIcon color="warning" {...rest} />
    </Tooltip>
  );
