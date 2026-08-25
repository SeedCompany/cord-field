import { type TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import {
  type ChangePrompt,
  type ChoosePrompt,
  type UpdatePromptVariantResponse,
} from '~/api/schema.graphql';
import { type PromptResponseListFragment } from '~/common/fragments';
import { RichTextView } from '../../../components/RichText';
import {
  Prompt,
  VariantResponses,
} from '../../ProgressReports/EditForm/Steps/PromptVariant';

interface ProseSectionProps {
  title: string;
  instructions: string;
  reportId: string;
  list: PromptResponseListFragment;
  createDoc: DocumentNode<unknown, { input: ChoosePrompt }>;
  changePromptDoc: DocumentNode<unknown, { input: ChangePrompt }>;
  updateResponseDoc: DocumentNode<
    unknown,
    { input: UpdatePromptVariantResponse }
  >;
  /** The overview page reads; the wizard edits. */
  editable?: boolean;
}

/**
 * One narrative section of a GTL report.
 *
 * Built entirely on the prompt-variant components the Momentum wizard already
 * uses — they take their mutation documents as props, so nothing needed forking
 * to point them at GTL. Each response shows one accordion per audience variant,
 * so the Global Leader's own words and the Investor Communications rewrite are
 * edited separately rather than one overwriting the other.
 */
export const ProseSection = ({
  title,
  instructions,
  reportId,
  list,
  createDoc,
  changePromptDoc,
  updateResponseDoc,
  editable = true,
}: ProseSectionProps) => {
  if (!list.canRead) return null;

  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {instructions}
        </Typography>

        {list.items.length === 0 && (!list.canCreate || !editable) && (
          <Typography variant="body2" color="text.secondary">
            Nothing written yet.
          </Typography>
        )}

        {editable
          ? // An empty list still renders the chooser — that is how the first
            // response gets created.
            (list.items.length > 0 ? list.items : [undefined]).map(
              (promptResponse, i) => (
                <div key={promptResponse?.id ?? `new-${i}`}>
                  <Prompt
                    reportId={reportId}
                    promptResponse={promptResponse}
                    list={list}
                    createItemDocument={createDoc}
                    changePromptDocument={changePromptDoc}
                    promptInstructions={null}
                  />
                  <VariantResponses
                    promptResponse={promptResponse}
                    doc={updateResponseDoc}
                  />
                </div>
              )
            )
          : list.items.map((item) => (
              <ReadOnlyResponse key={item.id} item={item} />
            ))}
      </CardContent>
    </Card>
  );
};

/** How a response reads on the overview page: every variant that has words. */
const ReadOnlyResponse = ({
  item,
}: {
  item: PromptResponseListFragment['items'][number];
}) => (
  <Box sx={{ mb: 2 }}>
    {item.prompt.value?.text.value && (
      <Box sx={{ color: 'text.secondary', typography: 'body2', mb: 0.5 }}>
        <RichTextView data={item.prompt.value.text.value} />
      </Box>
    )}
    {item.responses
      .filter((r) => r.response.value)
      .map((r) => (
        <Box key={r.variant.key} sx={{ mb: 1 }}>
          <Chip size="small" label={r.variant.label} sx={{ mr: 1 }} />
          <RichTextView data={r.response.value} />
        </Box>
      ))}
  </Box>
);
