import { Box } from '@mui/material';
import { ReactNode } from 'react';
import { StyleProps } from '~/common';
import { PromptFragment as Prompt } from '~/common/fragments';
import {
  EnumField,
  EnumOption,
  Form,
  FormProps,
  SubmitButton,
} from '~/components/form';
import { RichTextView } from '~/components/RichText';

export interface PromptSelection {
  prompt: string;
}

export interface PromptsFormProps
  extends FormProps<PromptSelection>,
    StyleProps {
  availablePrompts: readonly Prompt[];
  preamble?: ReactNode;
}

export const PromptsForm = ({
  availablePrompts,
  preamble,
  sx,
  className,
  ...rest
}: PromptsFormProps) => (
  <Form<PromptSelection> {...rest}>
    {({ handleSubmit }) => (
      <Box
        component="form"
        sx={sx}
        className={className}
        onSubmit={handleSubmit}
      >
        {preamble}
        <EnumField name="prompt" required margin="normal">
          {availablePrompts.map((prompt) => {
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

        <SubmitButton
          variant="outlined"
          color="secondary"
          size="medium"
          fullWidth={false}
        >
          Select prompt
        </SubmitButton>
      </Box>
    )}
  </Form>
);
