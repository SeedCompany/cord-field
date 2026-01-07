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
    update: (cache, res, options) => {
      const thread = res.data!.createComment.commentThread;
      addItemToList({
        listId: [thread.container, 'commentThreads'],
        outputToItem: () => thread,
      })(cache, res, options);
    },
  });

  return (
    <CommentForm
      {...rest}
      onSubmit={async (values, form) => {
        if (!values.body || !resourceId) return;

        await createOrReplyComment({
          variables: {
            input: {
              resource: resourceId,
              thread: threadId,
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
