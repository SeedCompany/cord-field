import { useMutation } from '@apollo/client';
import { useMemo } from 'react';
import { CommentFragment } from '../CommentItem/comment.graphql';
import { CommentForm, CommentFormProps } from './CommentForm';
import { UpdateCommentDocument } from './UpdateComment.graphql';

export interface UpdateCommentProps
  extends Omit<CommentFormProps, 'onSubmit' | 'initialValues'> {
  comment: CommentFragment;
  onFinish?: () => void;
}

export const UpdateComment = ({
  comment,
  onFinish,
  ...rest
}: UpdateCommentProps) => {
  const [updateComment] = useMutation(UpdateCommentDocument);

  const initialValues = useMemo(
    () => ({ body: comment.body.value ?? null }),
    [comment]
  );

  return (
    <CommentForm
      {...rest}
      onSubmit={async (values) => {
        if (!values.body) return;

        await updateComment({
          variables: {
            input: {
              id: comment.id,
              body: values.body,
            },
          },
        });

        onFinish?.();
      }}
      initialValues={initialValues}
      submitLabel="Update"
      onCancel={onFinish}
    />
  );
};
