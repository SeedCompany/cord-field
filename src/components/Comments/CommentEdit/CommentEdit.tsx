import { useMutation } from '@apollo/client';
import { Box } from '@mui/material';
import { useState } from 'react';
import { RichTextJson, StyleProps } from '~/common';
import { Form, SubmitButton } from '../../form';
import { RichTextField } from '../../RichText';
import { CommentPropsFragment } from '../CommentsThreadList.graphql';
import { UpdateCommentDocument } from './CommentEdit.graphql';

export interface CommentEditProps extends StyleProps {
  placeholder?: string;
  onSubmit?: () => void;
  onClose?: () => void;
  comment?: CommentPropsFragment;
}

interface FormShape {
  body: RichTextJson | null;
}
export const CommentEdit = ({
  placeholder = 'Write a comment...',
  onSubmit,
  comment,
  sx,
}: CommentEditProps) => {
  const [updateComment] = useMutation(UpdateCommentDocument);

  const [initialValues] = useState(() => ({
    body: comment?.body.value ?? null,
  }));

  if (!comment) {
    return null;
  }

  return (
    <Box sx={sx}>
      <Form<FormShape>
        onSubmit={async (values, form) => {
          if (!values.body) return;

          await updateComment({
            variables: {
              input: {
                body: values.body,
                id: comment.id,
              },
            },
          });

          form.reset({ body: null });
          onSubmit?.();
        }}
        initialValues={initialValues}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <RichTextField
              name="body"
              label="Comment"
              tools={['paragraph', 'delimiter', 'marker', 'list']}
              placeholder={placeholder}
            />
            <Box display="flex" justifyContent="end">
              <SubmitButton
                variant="contained"
                size="small"
                color="secondary"
                fullWidth={false}
              >
                Update
              </SubmitButton>
            </Box>
          </form>
        )}
      </Form>
    </Box>
  );
};
