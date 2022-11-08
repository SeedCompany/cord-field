import { Box, Typography } from '@mui/material';
import { SubmissionErrors } from 'final-form';
import { Form } from 'react-final-form';
import { EnumField, EnumOption, SubmitButton } from '~/components/form';
import { RichTextView } from '~/components/RichText';
import { ProgressReportAvailableDataFragment } from '../../ProgressReportDrawer.graphql';

interface PromptsFormProps {
  availableData: ProgressReportAvailableDataFragment | null;
  onCreateItem: (
    input: any
  ) => void | SubmissionErrors | Promise<SubmissionErrors>;
}

export const PromptsForm = ({
  availableData: stepData,
  onCreateItem,
}: PromptsFormProps) => {
  return (
    <Form onSubmit={onCreateItem}>
      {({ handleSubmit }) => (
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: 2,
            pt: 0,
          }}
          onSubmit={handleSubmit}
        >
          <Typography gutterBottom variant="h3">
            Share a team highlight story.
          </Typography>
          <Typography variant="body2" gutterBottom>
            As you reflect on the past three months, select ONE question to
            answer.
          </Typography>

          {stepData?.prompts.length && (
            <EnumField name="prompt" label="Select a prompt" required>
              {stepData.prompts.map((prompt) => {
                if (!prompt.text.value) {
                  return null;
                }
                return (
                  <EnumOption
                    key={prompt.id}
                    value={prompt.id}
                    label={<RichTextView data={prompt.text.value} />}
                  />
                );
              })}
            </EnumField>
          )}

          <SubmitButton variant="outlined" color="secondary">
            {stepData?.prompts.length ? 'Submit' : 'Loading...'}
          </SubmitButton>
        </Box>
      )}
    </Form>
  );
};
