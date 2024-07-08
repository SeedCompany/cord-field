import { Accordion, AccordionDetails } from '@mui/material';
import { ReactNode } from 'react';
import { CommentItem } from '../CommentItem';
import { useCommentsContext } from '../CommentsBarContext';
import { CommentThreadFragment } from './commentThread.graphql';

interface CommentThreadProps {
  thread: CommentThreadFragment;
  resourceId: string;
  children?: ReactNode | ReactNode[];
  handleExpandedChanged: (expanded?: boolean) => void;
}

export const CommentThreadAccordion = ({
  thread,
  children,
  ...rest
}: CommentThreadProps) => {
  const { expandedThreads } = useCommentsContext();

  return (
    <Accordion
      expanded={expandedThreads.includes(thread.id)}
      onChange={() => rest.handleExpandedChanged()}
      elevation={0}
      square
      sx={{ p: 0, '&.Mui-expanded': { m: 0 } }}
    >
      {children}
      <AccordionDetails sx={{ p: 0, m: 0 }}>
        {thread.comments.items.map(
          (comment) =>
            comment.id !== thread.firstComment.id && (
              <CommentItem
                comment={comment}
                isChild
                key={comment.id}
                parent={thread}
                {...rest}
              />
            )
        )}
      </AccordionDetails>
    </Accordion>
  );
};
