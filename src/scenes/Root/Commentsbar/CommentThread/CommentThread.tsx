import { useQuery } from '@apollo/client';
import { CommentItem } from '../CommentItem';
import {
  CommentThreadDocument,
  CommentThreadPropsFragment,
} from '../CommentsBar.graphql';

interface CommentThreadProps {
  thread: CommentThreadPropsFragment;
  resourceId: string;
}

export const CommentThread = ({ thread, resourceId }: CommentThreadProps) => {
  const getCommentThread = useQuery(CommentThreadDocument, {
    variables: {
      id: thread.id,
    },
  });

  const handleCreateComment = async () => {
    await getCommentThread.refetch();
  };

  if (thread.comments.total > 1) {
    return (
      <>
        <CommentItem
          comment={thread.firstComment}
          threadId={thread.id}
          hasChildren
          resourceId={resourceId}
          handleCreateComment={handleCreateComment}
        />
        {thread.comments.items.map(
          (comment) =>
            comment.id !== thread.firstComment.id && (
              <CommentItem
                comment={comment}
                isChild
                key={comment.id}
                threadId={thread.id}
                resourceId={resourceId}
              />
            )
        )}
      </>
    );
  }
  return (
    <CommentItem
      comment={thread.firstComment}
      threadId={thread.id}
      resourceId={resourceId}
      handleCreateComment={handleCreateComment}
    />
  );
};
