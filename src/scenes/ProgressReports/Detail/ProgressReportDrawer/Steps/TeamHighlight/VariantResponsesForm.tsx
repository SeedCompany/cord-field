import { useMutation } from '@apollo/client';
import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from '@mui/material';
import RichTextRenderer from 'editorjs-blocks-react-renderer';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { Form } from 'react-final-form';
import { SubmitButton, TextField } from '~/components/form';
import {
  DrawerPeriodicReportItemFragment,
  DrawerPeriodicReportItemResponseFragment,
} from '../../ProgressReportDrawer.graphql';
import { RoleIcon } from '../../RoleIcon';
import { UpdateProgressReportHighlightResponseDocument } from './PromptsForm.graphql';

export const VariantResponsesForm = ({
  currentItem,
}: {
  currentItem: DrawerPeriodicReportItemFragment;
}) => {
  const [submitResponse] = useMutation(
    UpdateProgressReportHighlightResponseDocument
  );

  const onSubmit = async (values: any) => {
    console.log(values);

    const data = await submitResponse({
      variables: {
        input: {
          id: currentItem.id,
          response: {
            version: '2.24.3',
            time: 1667231018164,
            blocks: [
              {
                id: 'YeoJuo6IPP',
                type: 'paragraph',
                data: {
                  text: values.response,
                },
              },
            ],
          },
          variant: values.variant,
        },
      },
    });

    console.log(data);
  };

  return (
    <>
      <Typography variant="h3">Share a team highlight story.</Typography>
      <Typography variant="body1" component="div" sx={{ mb: 4 }}>
        <RichTextRenderer data={currentItem.prompt.text.value} />
      </Typography>
      {currentItem.responses.map(
        (response: DrawerPeriodicReportItemResponseFragment) => (
          <Form
            onSubmit={onSubmit}
            key={response.variant.responsibleRole}
            initialValues={{
              variant: response.variant.key,
            }}
          >
            {({ handleSubmit }) => (
              <form
                onSubmit={handleSubmit}
                css={(theme) => ({
                  marginBottom: theme.spacing(2),
                })}
              >
                <AccordionComponent response={response} expanded />
              </form>
            )}
          </Form>
        )
      )}
    </>
  );
};

const AccordionComponent = ({
  response,
  expanded: _expanded,
}: {
  response: DrawerPeriodicReportItemResponseFragment;
  expanded?: boolean;
}) => {
  const [expanded, setExpanded] = useState(_expanded ?? false);
  const [savedAt, _setSavedAt] = useState<DateTime | null>(null);

  if (response.response.canRead) {
    return (
      <Accordion
        key={response.variant.responsibleRole}
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
          aria-controls={`${response.variant.responsibleRole}-content`}
          expandIcon={<ExpandMore />}
          sx={{
            '& .MuiAccordionSummary-content': {
              alignItems: 'center',
            },
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <RoleIcon roleStep={response.variant.responsibleRole} />
          <span>{response.variant.responsibleRole}</span>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            px: 4,
          }}
        >
          {response.response.canRead && response.response.value.blocks && (
            <RichTextRenderer data={response.response.value} />
          )}

          {response.response.canEdit && (
            <Box>
              <TextField
                name="response"
                label="Response"
                multiline
                rows={6}
                variant="outlined"
              />
              {savedAt && (
                <Typography variant="caption" sx={{ mb: 1 }} component="div">
                  Saved at {savedAt.toISO()}
                </Typography>
              )}
              <SubmitButton
                variant="outlined"
                color="secondary"
                onClick={() => _setSavedAt(DateTime.now())}
              >
                Save Progress
              </SubmitButton>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    );
  }
  return null;
};
