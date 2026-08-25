import { type TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { Card, CardContent, Typography } from '@mui/material';
import {
  type ChangePrompt,
  type ChoosePrompt,
  type UpdatePromptVariantResponse,
} from '~/api/schema.graphql';
import { type PromptResponseListFragment } from '~/common/fragments';
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

        {list.items.length === 0 && !list.canCreate && (
          <Typography variant="body2" color="text.secondary">
            Nothing written yet.
          </Typography>
        )}

        {/* An empty list still renders the chooser, which is how the first
            response gets created. */}
        {(list.items.length > 0 ? list.items : [undefined]).map(
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
        )}
      </CardContent>
    </Card>
  );
};
