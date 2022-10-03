import { MoreVert } from '@mui/icons-material';
import { Box, IconButton, MenuProps, Paper, Typography } from '@mui/material';
import Blocks from 'editorjs-blocks-react-renderer';
import { useState } from 'react';
import { CommentItemMenu } from '../CommentItemMenu';
import { CommentReply } from '../CommentReply/CommentReply';
import { CommentPropsFragment } from '../CommentsBar.graphql';

export interface CommentProps {
  comment: CommentPropsFragment;
  hasChildren?: boolean;
  isChild?: boolean;
  resourceId: string;
  threadId?: string;
  handleCreateComment?: (comment: CommentPropsFragment) => Promise<void> | void;
}

export const CommentItem = ({
  comment,
  hasChildren,
  isChild,
  resourceId,
  threadId,
  handleCreateComment,
}: CommentProps) => {
  const [actionsAnchor, setActionsAnchor] = useState<MenuProps['anchorEl']>();

  return (
    <Paper
      elevation={hasChildren ? 4 : isChild ? 1 : 3}
      sx={[
        { padding: 2, width: '100%', position: 'relative' },
        { zIndex: 11 },
        !!isChild && { pl: 6, zIndex: 10 },
      ]}
      square
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Typography variant="body1" color="text.primary">
          {comment.creator.fullName}
        </Typography>
        <Typography
          variant="body2"
          color={(theme) => theme.palette.grey[500]}
          sx={{ ml: 1 }}
        >
          {comment.createdAt.toRelative()}
        </Typography>
      </Box>
      <Box
        sx={{
          '& p': {
            fontSize: '0.875rem',
          },
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            marginTop: '0',
          },
          '& .cdx-marker': {
            backgroundColor: 'rgba(245,235,111,0.5)',
            padding: '0',
          },
        }}
      >
        {comment.body.value && <Blocks data={comment.body.value} />}
      </Box>

      {!isChild && (
        <CommentReply
          resourceId={resourceId}
          threadId={threadId}
          commentId={comment.id}
          handleCreateComment={handleCreateComment}
        />
      )}
      <CommentItemMenu
        commentId={comment.id}
        anchorEl={actionsAnchor}
        onClose={() => setActionsAnchor(null)}
        open={Boolean(actionsAnchor)}
      />

      <IconButton
        onClick={(e) => setActionsAnchor(e.currentTarget)}
        sx={(theme) => ({
          margin: theme.spacing(1),
          position: 'absolute',
          right: 0,
          top: 0,
        })}
      >
        <MoreVert
          sx={{
            fontSize: '1.25rem',
          }}
        />
      </IconButton>
    </Paper>
  );
};
