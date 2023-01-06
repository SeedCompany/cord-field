import { Box, Typography } from '@mui/material';
import { ReportProp } from '../../ReportProp';
import { Prompt, VariantResponses } from '../PromptVariant';
import {
  ChangeProgressReportHighlightPromptDocument as ChangePrompt,
  CreateProgressReportHighlightDocument as CreateHighlight,
  UpdateProgressReportHighlightResponseDocument as UpdateResponse,
} from './TeamHighlightStep.graphql';

export const TeamHighlightStep = ({ report }: ReportProp) => {
  const highlight = report.highlights.items[0];

  return (
    <div
      css={(theme) => ({
        marginBottom: theme.spacing(4),
      })}
    >
      <Box sx={{ maxWidth: 'md' }}>
        <Typography variant="h3" gutterBottom>
          Share a team highlight story
        </Typography>
        <Prompt
          reportId={report.id}
          list={report.highlights}
          promptResponse={highlight}
          createItemDocument={CreateHighlight}
          changePromptDocument={ChangePrompt}
          promptInstructions={
            <Typography variant="body2" gutterBottom>
              As you reflect on the past three months, select a prompt below to
              answer.
            </Typography>
          }
        />
        <VariantResponses promptResponse={highlight} doc={UpdateResponse} />
      </Box>
    </div>
  );
};
