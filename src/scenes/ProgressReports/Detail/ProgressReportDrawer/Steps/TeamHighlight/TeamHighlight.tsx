import { Box, Typography } from '@mui/material';
import { Form } from 'react-final-form';
import { EnumField, TextField } from '~/components/form';
import { required } from '~/components/form/validators';
import { useProgressReportContext } from '../../../../ProgressReportContext';
import { teamHighlight as prompt } from '../fixtures/teamHighlight.fixture';

const promptMapper: { [key: string]: string } = {
  obstacle:
    'What are the biggest obstacles team members are facing in reaching their goals? How are they dealing with those obstacles? (Ex: translation difficulties, political unrest, suppression of faith)',
  terms:
    'What terms or concepts were difficult to find the right word for in the local language? Please explain how you found a solution.',
  affected:
    'How has working on the translation affected team members or their families? Please give a specific example.',
  others:
    'What have others done to help the team? How did this impact the team’s work? (Ex: People in the community cooking meals for the team, local governments offering the use of a community center, churches hosting literacy classes/checking sessions)',
};

export const TeamHighlightStep = () => {
  const { promptVariant } = useProgressReportContext();

  const data = prompt;

  const stepData = data.prompt.variants.find(
    (prompt) => prompt.variant === promptVariant
  );

  console.log('stepData', stepData);

  const onSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <Form onSubmit={onSubmit}>
      {({ handleSubmit }) => (
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

            {prompt.prompt.prompt.canEdit ? (
              <EnumField
                name="prompt"
                label="Select a question"
                options={Object.keys(promptMapper)}
                getLabel={(key) => promptMapper[key] ?? ''}
                validate={[required]}
                defaultValue={prompt.prompt.prompt.value}
              />
            ) : (
              prompt.prompt.prompt.canRead && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {prompt.prompt.prompt.value}
                </Typography>
              )
            )}

            <Box
              sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2 }}
            >
              <TextField
                name="response"
                label="Response"
                multiline
                rows={6}
                variant="outlined"
                validate={[required]}
                defaultValue={stepData?.response.value}
              />
            </Box>
          </Box>
        </form>
      )}
    </Form>
  );
};
