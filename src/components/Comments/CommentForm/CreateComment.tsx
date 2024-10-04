import { useMutation } from '@apollo/client';
import { addItemToList } from '~/api';
import { useCommentsContext } from '../CommentsContext';
import { CommentForm, CommentFormProps } from './CommentForm';
import { CreateCommentDocument } from './CreateComment.graphql';

export interface CreateCommentProps extends Omit<CommentFormProps, 'onSubmit'> {
  threadId?: string;
  onFinish?: () => void;
}

export const CreateComment = ({
  threadId,
  onFinish,
  ...rest
}: CreateCommentProps) => {
  const { resourceId } = useCommentsContext();

  const [createOrReplyComment] = useMutation(CreateCommentDocument, {
    update: addItemToList({
      listId: 'commentThreads',
      outputToItem: (data) => data.createComment.commentThread,
    }),
  });

  return (
    <CommentForm
      {...rest}
      onSubmit={async (values, form) => {
        if (!values.body || !resourceId) return;

        await createOrReplyComment({
          variables: {
            input: {
              resourceId,
              threadId,
              body: values.body,
            },
          },
        });

        form.reset();
        onFinish?.();
      }}
      submitLabel={threadId ? 'Reply' : 'Comment'}
    />
  );
};
