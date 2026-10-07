import { useMutation } from '@apollo/client';
import { Box, Typography } from '@mui/material';
import { ProgressButton } from '~/components/ProgressButton';
import { ReportProp } from '../../ReportProp';
import { VariantResponses } from '../PromptVariant';
import { StepComponent } from '../step.types';
import {
  CreateProgressReportNextQuarterPlansDocument as Create,
  UpdateProgressReportNextQuarterPlansResponseDocument as UpdateResponse,
} from './NextQuarterPlansStep.graphql';

export const NextQuarterPlansStep: StepComponent = ({ report }) => {
  const response = report.nextQuarterPlans.items[0];

  return (
    <Box mb={4}>
      <Box sx={{ maxWidth: 'md' }}>
        <Typography variant="h3" paragraph>
          What is planned for next quarter?
        </Typography>
        <CreateFromFirstPrompt report={report} />
        <VariantResponses promptResponse={response} doc={UpdateResponse} />
      </Box>
    </Box>
  );
};

NextQuarterPlansStep.enableWhen = ({ report }) =>
  report.nextQuarterPlans.canRead;

// 'suggested' rather than 'required', matching Team News and Story. These
// sections carry narrative that not every quarter has; blocking submission on
// them would make a partner invent something to get past the gate.
NextQuarterPlansStep.isIncomplete = ({ report, currentUserRoles }) => ({
  isIncomplete:
    report.nextQuarterPlans.items[0]?.responses.some(
      ({ variant: { responsibleRole }, response }) =>
        (responsibleRole ? currentUserRoles.has(responsibleRole) : false) &&
        !response.value &&
        response.canEdit
    ) ?? true,
  severity: 'suggested',
});

const CreateFromFirstPrompt = ({ report }: ReportProp) => {
  const response = report.nextQuarterPlans.items[0];
  const prompt = report.nextQuarterPlans.available.prompts[0];

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
      Add Plans
    </ProgressButton>
  );
};
