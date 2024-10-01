import { useMutation } from '@apollo/client';
import { addItemToList } from '~/api';
import { CommentForm, CommentFormProps } from './CommentForm';
import { CreateCommentDocument } from './CreateComment.graphql';

export interface CreateCommentProps extends Omit<CommentFormProps, 'onSubmit'> {
  resourceId: string;
  threadId?: string;
  onFinish?: () => void;
}

export const CreateComment = ({
  resourceId,
  threadId,
  onFinish,
  ...rest
}: CreateCommentProps) => {
  const [createOrReplyComment] = useMutation(CreateCommentDocument, {
    update: addItemToList({
      listId: 'commentThreads',
      outputToItem: (data) => data.createComment.commentThread,
    }),
  });

  return (
    <CommentForm
      {...rest}
      onSubmit={async (values) => {
        if (!values.body) return;

        await createOrReplyComment({
          variables: {
            input: {
              resourceId,
              threadId,
              body: values.body,
            },
          },
        });

        onFinish?.();
      }}
      onCancel={onFinish}
      submitLabel={threadId ? 'Reply' : 'Comment'}
    />
  );
};
