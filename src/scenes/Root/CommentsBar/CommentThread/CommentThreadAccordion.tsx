import { Accordion, AccordionDetails } from '@mui/material';
import { CommentItem } from '../CommentItem';
import { CommentReply } from '../CommentReply';
import { CommentThreadPropsFragment } from '../CommentsBar.graphql';
import { useCommentsContext } from '../CommentsBarContext';

interface CommentThreadProps {
  thread: CommentThreadPropsFragment;
  resourceId: string;
  children?: React.ReactNode | React.ReactNode[];
}

export const CommentThreadAccordion = ({
  thread,
  resourceId,
  children,
}: CommentThreadProps) => {
  const { expandedThreads, toggleThreadComments } = useCommentsContext();

  return (
    <Accordion
      expanded={expandedThreads.includes(thread.id)}
      onChange={() => toggleThreadComments(thread.id)}
      square
      sx={{
        '&.Mui-expanded': {
          margin: 0,
        },
        padding: 0,
      }}
      elevation={0}
    >
      {children}
      <AccordionDetails
        sx={{
          '&': {
            padding: 0,
            margin: 0,
          },
        }}
      >
        <CommentReply
          resourceId={resourceId}
          threadId={thread.id}
          commentId={thread.firstComment.id}
          sx={(theme) => ({
            padding: theme.spacing(1, 2),
            mt: 1,
          })}
        />
        {thread.comments.items.map(
          (comment) =>
            comment.id !== thread.firstComment.id && (
              <CommentItem
                comment={comment}
                isChild
                key={comment.id}
                parent={thread}
                resourceId={resourceId}
              />
            )
        )}
      </AccordionDetails>
    </Accordion>
  );
};
