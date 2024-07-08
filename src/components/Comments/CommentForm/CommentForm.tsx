import { useMutation } from '@apollo/client';
import { Box, Button } from '@mui/material';
import { useMemo } from 'react';
import { addItemToList } from '~/api';
import { RichTextJson, StyleProps } from '~/common';
import { Form, SubmitButton } from '../../form';
import { RichTextField } from '../../RichText';
import { CommentFragment } from '../CommentItem/comment.graphql';
import { CreateCommentDocument } from './CreateComment.graphql';
import { UpdateCommentDocument } from './UpdateComment.graphql';

interface FormShape {
  body: RichTextJson | null;
}

export interface CommentFormProps extends StyleProps {
  threadId?: string;
  resourceId?: string;
  comment?: CommentFragment;
  placeholder?: string;
  onFinish?: () => void;
}

export const CommentForm = ({
  threadId,
  resourceId,
  comment,
  placeholder = 'Write a comment...',
  onFinish,
  sx,
  className,
}: CommentFormProps) => {
  const [updateComment] = useMutation(UpdateCommentDocument);
  const [createOrReplyComment] = useMutation(CreateCommentDocument, {
    update: addItemToList({
      listId: 'commentThreads',
      outputToItem: (data) => data.createComment.commentThread,
    }),
  });

  const initialValues = useMemo(() => {
    if (comment) {
      return { body: comment.body.value ?? null };
    } else {
      return { body: null };
    }
  }, [comment]);

  return (
    <Form<FormShape>
      onSubmit={async (values, form) => {
        if (!values.body) return;

        if (!comment) {
          if (!resourceId) {
            console.error('Resource ID is required for creating a comment');
            return;
          }

          await createOrReplyComment({
            variables: {
              input: {
                threadId,
                resourceId,
                body: values.body,
              },
            },
          });
        } else {
          await updateComment({
            variables: {
              input: {
                body: values.body,
                id: comment.id,
              },
            },
          });
        }

        form.reset({ body: null });
        onFinish?.();
      }}
      initialValues={initialValues}
    >
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
            {!!comment && (
              <Button color="secondary" onClick={onFinish}>
                Cancel
              </Button>
            )}
            <SubmitButton
              variant="contained"
              size="small"
              color="secondary"
              fullWidth={false}
            >
              {comment ? 'Update' : threadId ? 'Reply' : 'Comment'}
            </SubmitButton>
          </Box>
        </Box>
      )}
    </Form>
  );
};
