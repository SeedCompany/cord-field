import { CommentItem } from '../CommentItem';
import { CommentThreadFragment } from './commentThread.graphql';
import { CommentThreadAccordion } from './CommentThreadAccordion';

interface CommentThreadProps {
  thread: CommentThreadFragment;
  resourceId: string;
}

export const CommentThread = ({ thread, resourceId }: CommentThreadProps) => {
  return (
    <CommentThreadAccordion thread={thread} resourceId={resourceId}>
      <CommentItem
        comment={thread.firstComment}
        parent={thread}
        resourceId={resourceId}
      />
    </CommentThreadAccordion>
  );
};
