import { useMutation } from '@apollo/client';
import { Box } from '@mui/material';
import { useState } from 'react';
import { addItemToList } from '~/api';
import { RichTextJson, StyleProps } from '~/common';
import { Form, SubmitButton } from '../../form';
import { RichTextField } from '../../RichText';
import { CreateOrReplyCommentDocument } from './CommentReply.graphql';

interface FormShape {
  body: RichTextJson | null;
}
export interface CommentReplyProps extends StyleProps {
  threadId?: string;
  resourceId: string;
  commentId?: string;
  placeholder?: string;
  onSubmit?: () => void;
  onClose?: () => void;
}

export const CommentReply = ({
  threadId,
  resourceId,
  placeholder = 'Write a comment...',
  onSubmit,
  sx,
}: CommentReplyProps) => {
  const [createOrReplyComment] = useMutation(CreateOrReplyCommentDocument, {
    update: addItemToList({
      listId: 'commentThreads',
      outputToItem: (data) => data.createComment.commentThread,
    }),
  });

  const [initialValues] = useState(() => ({
    body: null,
  }));

  return (
    <Box sx={sx}>
      <Form<FormShape>
        onSubmit={async (values, form) => {
          if (!values.body) return;

          await createOrReplyComment({
            variables: {
              input: {
                threadId,
                resourceId,
                body: values.body,
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
                {threadId ? 'Reply' : 'Comment'}
              </SubmitButton>
            </Box>
          </form>
        )}
      </Form>
    </Box>
  );
};
