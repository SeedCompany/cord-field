import { CommentItem } from '../CommentItem';
import { useCommentsContext } from '../CommentsBarContext';
import { CommentThreadPropsFragment } from '../CommentsThreadList.graphql';
import { CommentThreadAccordion } from './CommentThreadAccordion';

interface CommentThreadProps {
  thread: CommentThreadPropsFragment;
  resourceId: string;
}

export const CommentThread = ({ thread, resourceId }: CommentThreadProps) => {
  const { expandedThreads, toggleThreadComments } = useCommentsContext();
  const totalComments = thread.comments.total;
  const expanded = expandedThreads.includes(thread.id);

  const handleExpandedChanged = (expanded?: boolean) => {
    toggleThreadComments(thread.id, expanded);
  };

  if (totalComments > 1) {
    return (
      <CommentThreadAccordion
        thread={thread}
        resourceId={resourceId}
        handleExpandedChanged={handleExpandedChanged}
      >
        <CommentItem
          comment={thread.firstComment}
          parent={thread}
          resourceId={resourceId}
          isExpanded={expanded}
          handleExpandedChanged={handleExpandedChanged}
        />
      </CommentThreadAccordion>
    );
  }
  return (
    <CommentThreadAccordion
      thread={thread}
      resourceId={resourceId}
      handleExpandedChanged={handleExpandedChanged}
    >
      <CommentItem
        comment={thread.firstComment}
        parent={thread}
        resourceId={resourceId}
        isExpanded={expanded}
        handleExpandedChanged={handleExpandedChanged}
      />
    </CommentThreadAccordion>
  );
};
