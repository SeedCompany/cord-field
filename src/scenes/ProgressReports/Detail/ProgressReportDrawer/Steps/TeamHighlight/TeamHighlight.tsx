import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Typography,
} from '@mui/material';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { EnumField, SubmitButton, TextField } from '~/components/form';
import { required } from '~/components/form/validators';
import {
  PromptVariant,
  promptVariants,
  useProgressReportContext,
} from '../../../../ProgressReportContext';
import { PromptVariantIcon } from '../../StepIcon';
import { progressReport } from '../fixtures/progressReport.fixture';
import { SecuredVariantPromptResponseList } from '../fixtures/types.fixture';
import { VariantResponse } from '../fixtures/variantResponses.fixtures';

export const TeamHighlightStep = () => {
  const { promptVariant } = useProgressReportContext();
  const [data, setData] = useState<SecuredVariantPromptResponseList>(
    progressReport.highlights.available
  );
  const [responseData, setResponseData] = useState<VariantResponse | null>(
    data.items[0]?.responses.find((r) => r.variant === promptVariant) ?? null
  );
  const [savedAt, setSavedAt] = useState<DateTime | null>(null);

  useEffect(() => {
    setResponseData(
      data.items[0]?.responses.find((r) => r.variant === promptVariant) ?? null
    );
  }, [promptVariant, data]);

  const onSubmit = (values: any) => {
    setSavedAt(DateTime.local());
    // replace newline \n or \r with <br />
    const htmlResponse = values.response.replace(/\r?\n|\r/gm, '<br />');

    setData(() => {
      const newData = {
        ...data,
        items: [
          {
            ...data.items[0]!,
            responses: [
              ...data.items[0]!.responses.filter(
                (r) => r.variant !== promptVariant
              ),
              {
                ...responseData!,
                variant: promptVariant,
                response: {
                  ...responseData!.response,
                  value: htmlResponse,
                },
              },
            ],
          },
        ],
      };

      if (values.prompt.id) {
        newData.items[0]!.prompt = {
          ...data.items[0]!.prompt,
          id: values.prompt.id,
          prompt: {
            ...data.items[0]!.prompt?.prompt,
            canEdit: false,
            canRead: true,
            value: data.options.prompts.find((p) => p.id === values.prompt.id)!
              .prompt.value.value,
          },
        };
      }

      return newData;
    });
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        prompt: { id: data.items[0]?.prompt?.id },
        response: responseData?.response.value?.replace(/<br \/>/gm, '\n'),
      }}
    >
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

            {data.items[0]?.prompt.prompt?.canEdit ?? true ? (
              <EnumField
                name="prompt.id"
                label="Select a question"
                options={data.options.prompts.map((p) => p.id)}
                getLabel={(id) =>
                  data.options.prompts.find((p) => p.id === id)!.prompt.value
                    .value
                }
                validate={[required]}
              />
            ) : (
              data.items[0]?.prompt.prompt.canRead && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {data.items[0]?.prompt.prompt?.value}
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
              />
              {savedAt && (
                <Typography variant="caption" sx={{ my: 1 }}>
                  Saved at {savedAt.toISO()}
                </Typography>
              )}
              <SubmitButton variant="outlined" color="secondary" sx={{}}>
                Save Progress
              </SubmitButton>

              <Divider sx={{ my: 2 }} />
              {data.items[0]?.responses.sort(customSort).map((response) => (
                <AccordionComponent
                  response={response}
                  key={response.variant}
                  promptVariant={responseData?.variant}
                  expanded
                />
              ))}
            </Box>
          </Box>
        </form>
      )}
    </Form>
  );
};

const customSort = (a: VariantResponse, b: VariantResponse) => {
  return promptVariants.indexOf(b.variant) - promptVariants.indexOf(a.variant);
};

const AccordionComponent = ({
  response,
  promptVariant,
  expanded: _expanded,
}: {
  response: VariantResponse;
  promptVariant?: PromptVariant;
  expanded?: boolean;
}) => {
  const [expanded, setExpanded] = useState(_expanded ?? false);

  if (
    response.response.canRead &&
    response.response.value &&
    response.variant !== promptVariant
  ) {
    return (
      <Accordion
        key={response.variant}
        expanded={expanded}
        elevation={2}
        square
        sx={{
          mt: 2,
          '&.Mui-expanded': {
            mb: 0,
          },
        }}
      >
        <AccordionSummary
          aria-controls={`${response.variant}-content`}
          expandIcon={<ExpandMore />}
          sx={{
            '& .MuiAccordionSummary-content': {
              alignItems: 'center',
            },
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <PromptVariantIcon promptVariant={response.variant} />
          <span>{response.variant}</span>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            px: 4,
          }}
        >
          <Typography
            dangerouslySetInnerHTML={{
              __html: response.response.value,
            }}
          />
        </AccordionDetails>
      </Accordion>
    );
  }
  return null;
};
