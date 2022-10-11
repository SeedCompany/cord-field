import { Accordion, AccordionDetails } from '@mui/material';
import { useState } from 'react';
import { CommentItem } from '../CommentItem';
import { CommentReply } from '../CommentReply';
import { CommentThreadPropsFragment } from '../CommentsBar.graphql';

interface CommentThreadProps {
  thread: CommentThreadPropsFragment;
  resourceId: string;
  children?: React.ReactNode | React.ReactNode[];
  handleCommentsChanges?: () => Promise<void> | void;
  handleExtend?: (expanded: string | null) => void;
  forceExpanded?: boolean;
}

export const CommentThreadAccordion = ({
  thread,
  resourceId,
  children,
  handleCommentsChanges,
  handleExtend: handleExpand,
  forceExpanded = false,
}: CommentThreadProps) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      const newValue = newExpanded ? panel : null;
      setExpanded(newValue);
      handleExpand?.(newValue);
    };

  return (
    <Accordion
      expanded={forceExpanded || expanded === thread.id}
      onChange={handleChange(thread.id)}
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
          handleCreateComment={handleCommentsChanges}
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
