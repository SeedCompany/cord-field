import { useMutation } from '@apollo/client';
import { ExpandLess, ExpandMore, MoreVert, Reply } from '@mui/icons-material';
import { Box, Button, IconButton, MenuProps, Typography } from '@mui/material';
import { useState } from 'react';
import { removeItemFromList } from '~/api';
import { useDateTimeFormatter } from '../../Formatters';
import { RichTextView } from '../../RichText';
import { CommentEdit } from '../CommentEdit';
import { CommentReply } from '../CommentReply';
import { useCommentsContext } from '../CommentsBarContext';
import {
  CommentPropsFragment,
  CommentThreadPropsFragment,
} from '../CommentsThreadList.graphql';
import { CommentItemMenu } from './CommentItemMenu';
import { DeleteCommentDocument } from './DeleteComment.graphql';

export interface CommentProps {
  comment: CommentPropsFragment;
  isChild?: boolean;
  resourceId: string;
  isExpanded?: boolean;
  parent: CommentThreadPropsFragment;
  onEditComment?: (comment: CommentPropsFragment) => void;
  handleExpandedChanged?: (expanded?: boolean) => void;
}

export const CommentItem = ({
  comment,
  isChild,
  isExpanded,
  parent,
  resourceId,
  handleExpandedChanged,
}: CommentProps) => {
  const { toggleThreadComments } = useCommentsContext();
  const [actionsAnchor, setActionsAnchor] = useState<MenuProps['anchorEl']>();
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const [deleteCommentMutation] = useMutation(DeleteCommentDocument, {});

  const dateTimeFormatter = useDateTimeFormatter();
  const formattedDateString = dateTimeFormatter(comment.modifiedAt);
  const repliesCount = parent.comments.total - 1;
  const hasChildren = repliesCount > 0;

  const deleteComment = async (commentId: string) => {
    await deleteCommentMutation({
      variables: {
        id: commentId,
      },
      update: removeItemFromList({
        listId: [parent, 'comments'],
        item: comment,
      }),
    });
  };

  return (
    <Box
      sx={[
        { padding: 2 },
        Boolean(isChild) &&
          ((theme) => ({
            pl: 6,
            borderBottom: `1px solid ${theme.palette.divider}`,
          })),
        hasChildren && { pb: 1 },
      ]}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="body1" color="text.primary">
          {comment.creator.fullName}
        </Typography>
        <Typography variant="body2" sx={{ ml: 1, color: 'grey.500' }}>
          {formattedDateString}
        </Typography>
      </Box>

      {isEditing ? (
        <CommentEdit comment={comment} onFinish={() => setIsEditing(false)} />
      ) : (
        comment.body.value && <RichTextView data={comment.body.value} />
      )}
      <Box
        sx={[
          {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
          isReplying && { flexDirection: 'column', alignItems: 'flex-start' },
          !repliesCount && { justifyContent: 'flex-end' },
        ]}
      >
        {isReplying && (
          <CommentReply
            resourceId={resourceId}
            threadId={parent.id}
            commentId={comment.id}
            sx={{ width: 1 }}
            onSubmit={() => {
              setIsReplying(false);
              if (!isExpanded) {
                handleExpandedChanged?.(true);
              }
            }}
          />
        )}

        {!isChild && hasChildren && (
          <ExpandThreadLink
            toggleThreadComments={toggleThreadComments}
            parentId={parent.id}
            isExpanded={isExpanded}
            repliesCount={repliesCount}
          />
        )}

        {!isEditing && !isReplying && !isChild && (
          <Button onClick={() => setIsReplying(true)}>
            <Reply sx={{ fontSize: '1.25rem', mr: 0.75 }} />
            Reply
          </Button>
        )}
      </Box>
      <CommentItemMenu
        comment={comment}
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
        sx={{ margin: 1, position: 'absolute', right: 0, top: 0 }}
        data-testid="comment-menu-button"
      >
        <MoreVert sx={{ fontSize: '1.25rem' }} />
      </IconButton>
    </Box>
  );
};

const ExpandThreadLink = ({
  toggleThreadComments,
  parentId,
  isExpanded,
  repliesCount,
}: {
  toggleThreadComments: (id: string) => void;
  parentId: string;
  isExpanded?: boolean;
  repliesCount: number;
}) => {
  const Icon = isExpanded ? ExpandLess : ExpandMore;

  return (
    <Typography
      variant="body2"
      color="text.secondary"
      component="div"
      display="flex"
      sx={{
        '&:hover': {
          cursor: 'pointer',
          textDecoration: 'underline',
        },
        userSelect: 'none',
        alignContent: 'center',
        alignItems: 'center',
      }}
      onClick={() => {
        toggleThreadComments(parentId);
      }}
    >
      <Icon />
      {isExpanded ? 'Hide' : 'Show'} {repliesCount} replies
    </Typography>
  );
};
