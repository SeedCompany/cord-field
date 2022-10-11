// import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { CommentItem } from '../CommentItem';
import { CommentThreadPropsFragment } from '../CommentsBar.graphql';
import { CommentThreadAccordion } from './CommentThreadAccordion';

interface CommentThreadProps {
  thread: CommentThreadPropsFragment;
  resourceId: string;
}

export const CommentThread = ({ thread, resourceId }: CommentThreadProps) => {
  const totalComments = thread.comments.total;

  const [expanded, setExpanded] = useState<string | null>(null);

  const handleCommentsChanges = async () => {
    // await getCommentThread.refetch();
  };

  if (totalComments > 1) {
    return (
      <CommentThreadAccordion
        handleCommentsChanges={handleCommentsChanges}
        thread={thread}
        resourceId={resourceId}
        handleExtend={setExpanded}
        forceExpanded={expanded === thread.id}
      >
        <CommentItem
          comment={thread.firstComment}
          parent={thread}
          repliesCount={totalComments - 1}
          resourceId={resourceId}
          handleDeleteComment={handleCommentsChanges}
          handleEditComment={handleCommentsChanges}
          isExpanded={expanded === thread.id}
          handleExpand={setExpanded}
        />
      </CommentThreadAccordion>
    );
  }
  return (
    <CommentThreadAccordion
      handleCommentsChanges={handleCommentsChanges}
      thread={thread}
      resourceId={resourceId}
      handleExtend={setExpanded}
      forceExpanded={totalComments === 1 || expanded === thread.id}
    >
      <CommentItem
        comment={thread.firstComment}
        parent={thread}
        resourceId={resourceId}
        handleDeleteComment={handleCommentsChanges}
        handleEditComment={handleCommentsChanges}
        isExpanded={totalComments === 1 || expanded === thread.id}
        handleExpand={setExpanded}
      />
    </CommentThreadAccordion>
  );
};
