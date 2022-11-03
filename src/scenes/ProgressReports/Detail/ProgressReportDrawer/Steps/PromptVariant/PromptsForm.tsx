import { Box, Typography } from '@mui/material';
import { SubmissionErrors } from 'final-form';
import { Form } from 'react-final-form';
import { EnumField, EnumOption, SubmitButton } from '~/components/form';
import { required } from '~/components/form/validators';
import { RichTextView } from '~/components/RichText';
import { ProgressReportAvailableDataFragment } from '../../ProgressReportDrawer.graphql';

interface PromptsFormProps {
  availableData: ProgressReportAvailableDataFragment | null;
  reportId: string;
  createItemMutation: (
    input: any
  ) => void | SubmissionErrors | Promise<SubmissionErrors>;
}

export const PromptsForm = ({
  availableData: stepData,
  reportId,
  createItemMutation,
}: PromptsFormProps) => {
  return (
    <Form
      onSubmit={createItemMutation}
      initialValues={{
        reportId,
      }}
    >
      {({ handleSubmit, validating }) => (
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              padding: 2,
              pt: 0,
            }}
          >
            <Typography sx={{ mb: 2 }} variant="h3">
              Share a team highlight story.
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              As you reflect on the past three months, select ONE question to
              answer.
            </Typography>

            {stepData?.prompts.length && (
              <EnumField
                name="prompt"
                label="Select a question"
                validate={[required]}
                required
              >
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

            <SubmitButton
              variant="outlined"
              color="secondary"
              disabled={validating}
            >
              {stepData?.prompts.length ? 'Submit' : 'Loading...'}
            </SubmitButton>
          </Box>
        </form>
      )}
    </Form>
  );
};
