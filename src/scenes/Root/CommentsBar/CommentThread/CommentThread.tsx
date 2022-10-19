import { CommentItem } from '../CommentItem';
import { useCommentsContext } from '../CommentsBarContext';
import { CommentThreadPropsFragment } from '../CommentsThreadList.graphql';
import { CommentThreadAccordion } from './CommentThreadAccordion';

interface CommentThreadProps {
  thread: CommentThreadPropsFragment;
  resourceId: string;
}

export const CommentThread = ({ thread, resourceId }: CommentThreadProps) => {
  const { expandedThreads } = useCommentsContext();
  const totalComments = thread.comments.total;
  const expanded = expandedThreads.includes(thread.id);

  if (totalComments > 1) {
    return (
      <CommentThreadAccordion thread={thread} resourceId={resourceId}>
        <CommentItem
          comment={thread.firstComment}
          parent={thread}
          repliesCount={totalComments - 1}
          resourceId={resourceId}
          isExpanded={expanded}
        />
      </CommentThreadAccordion>
    );
  }
  return (
    <CommentThreadAccordion thread={thread} resourceId={resourceId}>
      <CommentItem
        comment={thread.firstComment}
        parent={thread}
        resourceId={resourceId}
        isExpanded={expanded}
      />
    </CommentThreadAccordion>
  );
};
