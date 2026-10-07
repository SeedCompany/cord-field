import { useMutation } from '@apollo/client';
import { Box, Typography } from '@mui/material';
import { ProgressButton } from '~/components/ProgressButton';
import { ReportProp } from '../../ReportProp';
import { VariantResponses } from '../PromptVariant';
import { StepComponent } from '../step.types';
import {
  CreateProgressReportOtherActivitiesDocument as Create,
  UpdateProgressReportOtherActivitiesResponseDocument as UpdateResponse,
} from './OtherActivitiesStep.graphql';

export const OtherActivitiesStep: StepComponent = ({ report }) => {
  const response = report.otherActivities.items[0];

  return (
    <Box mb={4}>
      <Box sx={{ maxWidth: 'md' }}>
        <Typography variant="h3" paragraph>
          What else did the team do this quarter?
        </Typography>
        <CreateFromFirstPrompt report={report} />
        <VariantResponses promptResponse={response} doc={UpdateResponse} />
      </Box>
    </Box>
  );
};

OtherActivitiesStep.enableWhen = ({ report }) => report.otherActivities.canRead;

// 'suggested' rather than 'required', matching Team News and Story. These
// sections carry narrative that not every quarter has; blocking submission on
// them would make a partner invent something to get past the gate.
OtherActivitiesStep.isIncomplete = ({ report, currentUserRoles }) => ({
  isIncomplete:
    report.otherActivities.items[0]?.responses.some(
      ({ variant: { responsibleRole }, response }) =>
        (responsibleRole ? currentUserRoles.has(responsibleRole) : false) &&
        !response.value &&
        response.canEdit
    ) ?? true,
  severity: 'suggested',
});

const CreateFromFirstPrompt = ({ report }: ReportProp) => {
  const response = report.otherActivities.items[0];
  const prompt = report.otherActivities.available.prompts[0];

  const [create, { loading }] = useMutation(Create, {
    variables: {
      input: {
        resource: report.id,
        prompt: prompt?.id ?? '',
      },
    },
  });

  if (response || !prompt) {
    return null;
  }

  return (
    <ProgressButton
      variant="contained"
      progress={loading}
      disabled={loading}
      onClick={() => void create()}
    >
      Add Activities
    </ProgressButton>
  );
};
