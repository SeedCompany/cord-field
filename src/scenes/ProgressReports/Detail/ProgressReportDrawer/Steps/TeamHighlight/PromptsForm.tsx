import { useMutation } from '@apollo/client';
import { Box, Typography } from '@mui/material';
import RichText from 'editorjs-blocks-react-renderer';
import { Form } from 'react-final-form';
import { EnumField, EnumOption, SubmitButton } from '~/components/form';
import { required } from '~/components/form/validators';
import { DrawerAvailableDataFragment } from '../../ProgressReportDrawer.graphql';
import { CreateProgressReportHighlightDocument } from './PromptsForm.graphql';

export const PromptsForm = ({
  stepData,
  reportId,
  onSuccess,
}: {
  stepData?: DrawerAvailableDataFragment;
  reportId?: string;
  onSuccess?: (item: any) => void;
}) => {
  const [createProgressReportHighlight] = useMutation(
    CreateProgressReportHighlightDocument
  );

  const onSubmit = async (values: { prompt: string; reportId: string }) => {
    console.log(values);

    const { data } = await createProgressReportHighlight({
      variables: {
        input: {
          prompt: values.prompt,
          resource: values.reportId,
        },
      },
    });
    onSuccess?.(data?.createProgressReportHighlight);
  };

  return (
    <Form
      onSubmit={onSubmit}
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
                {stepData.prompts.map((prompt) => (
                  <EnumOption
                    key={prompt.id}
                    value={prompt.id}
                    label={<RichText data={prompt.text.value} />}
                  />
                ))}
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
