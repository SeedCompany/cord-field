import { CommentItem } from '../CommentItem';
import { useCommentsContext } from '../CommentsBarContext';
import { CommentThreadFragment } from './commentThread.graphql';
import { CommentThreadAccordion } from './CommentThreadAccordion';

interface CommentThreadProps {
  thread: CommentThreadFragment;
  resourceId: string;
}

export const CommentThread = ({ thread, resourceId }: CommentThreadProps) => {
  const { expandedThreads, toggleThreadComments } = useCommentsContext();
  const expanded = expandedThreads.includes(thread.id);

  const handleExpandedChanged = (expanded?: boolean) => {
    toggleThreadComments(thread.id, expanded);
  };

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
