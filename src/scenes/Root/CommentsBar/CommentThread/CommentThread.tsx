// import { useQuery } from '@apollo/client';

import { useEffect } from 'react';
import { CommentItem } from '../CommentItem';
import { CommentThreadPropsFragment } from '../CommentsBar.graphql';
import { useCommentsContext } from '../CommentsBarContext';
import { CommentThreadAccordion } from './CommentThreadAccordion';

interface CommentThreadProps {
  thread: CommentThreadPropsFragment;
  resourceId: string;
}

export const CommentThread = ({ thread, resourceId }: CommentThreadProps) => {
  const { expandedThreads, toggleThreadComments } = useCommentsContext();
  const totalComments = thread.comments.total;
  const expanded = expandedThreads.includes(thread.id);

  useEffect(() => {
    if (thread.comments.total === 1 && !expanded) {
      toggleThreadComments(thread.id);
    }
  }, [thread, toggleThreadComments, expanded]);

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
