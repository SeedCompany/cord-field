import { useMutation } from '@apollo/client';
import { Box, Typography } from '@mui/material';
import { ProgressButton } from '../../../../../components/ProgressButton';
import { ReportProp } from '../../ReportProp';
import { VariantResponses } from '../PromptVariant';
import { StepComponent } from '../step.types';
import {
  CreateProgressReportNewsDocument as CreateNews,
  UpdateProgressReportNewsResponseDocument as UpdateResponse,
} from './TeamNewsStep.graphql';

export const TeamNewsStep: StepComponent = ({ report }) => {
  const news = report.teamNews.items[0];

  return (
    <Box mb={4}>
      <Box sx={{ maxWidth: 'md' }}>
        <Typography variant="h3" paragraph>
          Share some team news
        </Typography>
        <CreateFromFirstPrompt report={report} />
        <VariantResponses promptResponse={news} doc={UpdateResponse} />
      </Box>
    </Box>
  );
};
TeamNewsStep.enableWhen = ({ report }) => report.teamNews.canRead;

const CreateFromFirstPrompt = ({ report }: ReportProp) => {
  const news = report.teamNews.items[0];
  const prompt = report.teamNews.available.prompts[0];

  const [createNews, { loading }] = useMutation(CreateNews, {
    variables: {
      input: {
        resource: report.id,
        prompt: prompt?.id ?? '',
      },
    },
  });

  if (news || !prompt) {
    return null;
  }

  return (
    <ProgressButton
      variant="contained"
      progress={loading}
      disabled={loading}
      onClick={() => void createNews()}
    >
      Report News
    </ProgressButton>
  );
};
