import { useMutation } from '@apollo/client';
import { MoreVert } from '@mui/icons-material';
import { Box, IconButton, MenuProps, Paper, Typography } from '@mui/material';
import Blocks from 'editorjs-blocks-react-renderer';
import { useState } from 'react';
import { removeItemFromList } from '~/api';
import { useDateTimeFormatter } from '~/components/Formatters';
import { CommentItemMenu } from '../CommentItemMenu';
import { CommentReply } from '../CommentReply';
import {
  CommentPropsFragment,
  CommentThreadPropsFragment,
  DeleteCommentDocument,
} from '../CommentsBar.graphql';
import { useCommentsContext } from '../CommentsBarContext';

export interface CommentProps {
  comment: CommentPropsFragment;
  repliesCount?: number;
  isChild?: boolean;
  resourceId: string;
  isExpanded?: boolean;
  parent: CommentThreadPropsFragment;
  handleDeleteComment?: (comment: CommentPropsFragment) => Promise<void> | void;
  handleEditComment?: (comment: CommentPropsFragment) => Promise<void> | void;
}

export const CommentItem = ({
  comment,
  repliesCount = 0,
  isChild,
  handleDeleteComment,
  isExpanded,
  parent,
  resourceId,
}: CommentProps) => {
  const { toggleThreadComments } = useCommentsContext();
  const [actionsAnchor, setActionsAnchor] = useState<MenuProps['anchorEl']>();
  const [isEditing, setIsEditing] = useState(false);

  const [deleteCommentMutation] = useMutation(DeleteCommentDocument, {});

  const dateTimeFormatter = useDateTimeFormatter();
  const formattedDateString = dateTimeFormatter(comment.modifiedAt);

  const deleteComment = async (commentId: string) => {
    const { data } = await deleteCommentMutation({
      variables: {
        id: commentId,
      },
      update: removeItemFromList({
        listId: [parent, 'comments'],
        item: comment,
      }),
    });

    if (data?.deleteComment) {
      setActionsAnchor(null);
      void handleDeleteComment?.(comment);
    }
  };

  return (
    <Paper
      elevation={repliesCount ? 4 : isChild ? 1 : 3}
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
          sx={{
            ml: 1,
          }}
        >
          {formattedDateString}
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
          '& > *': {
            padding: '0',
            margin: '0',
          },
        }}
      >
        {!isEditing && comment.body.value && (
          <Blocks data={comment.body.value} />
        )}

        {!!isEditing && (
          <CommentReply
            blocks={comment.body.value}
            commentId={comment.id}
            resourceId={resourceId}
            handleClose={() => setIsEditing(false)}
            isEditing
          />
        )}

        {repliesCount > 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            component="span"
            sx={{
              '&:hover': {
                cursor: 'pointer',
                textDecoration: 'underline',
              },
            }}
            onClick={() => {
              toggleThreadComments(parent.id);
            }}
          >
            {isExpanded ? 'Hide' : 'View'} Replies ({repliesCount})
          </Typography>
        )}
      </Box>
      {comment.canDelete && (
        <>
          <CommentItemMenu
            commentId={comment.id}
            anchorEl={actionsAnchor}
            onClose={() => setActionsAnchor(null)}
            open={Boolean(actionsAnchor)}
            onDelete={() => {
              void deleteComment(comment.id);
            }}
            onEdit={() => {
              setIsEditing(true);
              setActionsAnchor(null);
            }}
          />
          <IconButton
            onClick={(e) => setActionsAnchor(e.currentTarget)}
            sx={(theme) => ({
              margin: theme.spacing(1),
              position: 'absolute',
              right: 0,
              top: 0,
            })}
            data-testid="comment-menu-button"
          >
            <MoreVert
              sx={{
                fontSize: '1.25rem',
              }}
            />
          </IconButton>
        </>
      )}
    </Paper>
  );
};
