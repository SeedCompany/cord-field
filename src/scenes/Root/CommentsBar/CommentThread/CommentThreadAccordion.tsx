import { Accordion, AccordionDetails } from '@mui/material';
import { CommentItem } from '../CommentItem';
import { useCommentsContext } from '../CommentsBarContext';
import { CommentThreadPropsFragment } from '../CommentsThreadList.graphql';

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
          padding: 0,
          margin: 0,
        }}
      >
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
