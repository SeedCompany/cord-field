import { Box } from '@mui/material';
import { SubmissionErrors } from 'final-form';
import { ReactNode } from 'react';
import { Form } from 'react-final-form';
import { EnumField, EnumOption, SubmitButton } from '~/components/form';
import { RichTextView } from '~/components/RichText';
import { ProgressReportAvailableDataFragment } from '../../ProgressReportDrawer.graphql';

interface PromptsFormProps {
  availableData: ProgressReportAvailableDataFragment | null;
  onCreateItem: (
    input: any
  ) => void | SubmissionErrors | Promise<SubmissionErrors>;
  title: ReactNode;
  promptInstructions: ReactNode;
}

export const PromptsForm = ({
  availableData: stepData,
  onCreateItem,
  title,
  promptInstructions,
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
          {title}
          {promptInstructions}
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
            {stepData?.prompts.length ? 'Save Prompt' : 'Loading...'}
          </SubmitButton>
        </Box>
      )}
    </Form>
  );
};
