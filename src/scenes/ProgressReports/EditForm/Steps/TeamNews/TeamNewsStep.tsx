import { useMutation } from '@apollo/client';
import { Box, Typography } from '@mui/material';
import { simpleSwitch } from '@seedcompany/common';
import { ProgressButton } from '../../../../../components/ProgressButton';
import { ReportProp } from '../../ReportProp';
import { VariantResponses } from '../PromptVariant';
import { StepComponent } from '../step.types';
import {
  TeamNewsFieldOperationsInstructions,
  TeamNewsPartnerInstructions,
} from './Instructions';
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
        <VariantResponses
          promptResponse={news}
          doc={UpdateResponse}
          instructions={(variant) =>
            simpleSwitch(variant, {
              draft: <TeamNewsPartnerInstructions />,
              fpm: <TeamNewsFieldOperationsInstructions />,
            })
          }
        />
      </Box>
    </Box>
  );
};
TeamNewsStep.enableWhen = ({ report }) => report.teamNews.canRead;

TeamNewsStep.isMissing = ({ report, currentUserRoles }) => {
  if (report.teamNews.items.length === 0) return true;

  const isMissingResponses = report.teamNews.items[0]?.responses.some(
    (item) => {
      return item.variant.responsibleRole
        ? currentUserRoles.has(item.variant.responsibleRole) &&
            !item.response.value &&
            item.response.canEdit
        : false;
    }
  );
  return isMissingResponses ?? false;
};

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
