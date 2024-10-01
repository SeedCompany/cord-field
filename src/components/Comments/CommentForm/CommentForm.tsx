import { Box, Button } from '@mui/material';
import { ReactNode } from 'react';
import { RichTextJson, StyleProps } from '~/common';
import { Form, FormProps, SubmitButton } from '../../form';
import { RichTextField } from '../../RichText';

interface FormShape {
  body: RichTextJson | null;
}

export interface CommentFormProps extends FormProps<FormShape>, StyleProps {
  placeholder?: string;
  submitLabel?: ReactNode;
  onCancel?: () => void;
}

export const CommentForm = ({
  placeholder = 'Write a comment...',
  submitLabel,
  onCancel,
  sx,
  className,
  ...rest
}: CommentFormProps) => (
  <Form<FormShape> {...rest}>
    {({ handleSubmit }) => (
      <Box
        sx={sx}
        className={className}
        component="form"
        onSubmit={handleSubmit}
      >
        <RichTextField
          name="body"
          label="Comment"
          tools={['paragraph', 'delimiter', 'marker', 'list']}
          placeholder={placeholder}
        />
        <Box display="flex" justifyContent="end" gap={2}>
          {!!onCancel && (
            <Button color="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <SubmitButton
            variant="contained"
            size="small"
            color="secondary"
            fullWidth={false}
          >
            {submitLabel}
          </SubmitButton>
        </Box>
      </Box>
    )}
  </Form>
);
