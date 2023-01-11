import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardProps,
  Stack,
  Typography,
} from '@mui/material';
import { ReactNode } from 'react';
import { PromptResponseFragment } from '~/common/fragments';
import { RichTextView } from '../../../components/RichText';
import { VariantChip } from '../../../components/VariantChip';

interface PromptResponseCardProps
  extends Omit<CardProps, 'title' | 'placeholder'> {
  title: ReactNode;
  promptResponse?: PromptResponseFragment;
  showPrompt?: boolean;
  placeholder?: ReactNode;
  actions?: ReactNode;
}

export const PromptResponseCard = ({
  title,
  promptResponse,
  showPrompt,
  placeholder,
  actions,
  ...rest
}: PromptResponseCardProps) => {
  const variantResponse = promptResponse?.responses
    .slice()
    .reverse()
    .find((vr) => vr.response.value);
  const { prompt } = promptResponse ?? {};
  const { variant } = variantResponse ?? {};
  const response = variantResponse?.response.value;
  return (
    <Card {...rest}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between">
          {typeof title === 'string' ? (
            <Typography variant="h3" paragraph>
              {title}
            </Typography>
          ) : (
            title
          )}
          {response && variant?.responsibleRole && (
            <VariantChip variant={variant} />
          )}
        </Stack>
        {showPrompt && prompt && (
          <Box mb={2} fontStyle="italic">
            <RichTextView data={prompt.value?.text.value} />
          </Box>
        )}
        {response ? (
          <RichTextView data={response} />
        ) : typeof placeholder === 'string' ? (
          <Typography color="text.secondary">{placeholder}</Typography>
        ) : (
          placeholder
        )}
      </CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </Card>
  );
};
