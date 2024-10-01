import { useMutation } from '@apollo/client';
import { ExpandLess, ExpandMore, MoreVert, Reply } from '@mui/icons-material';
import {
  Box,
  Button,
  ButtonProps,
  IconButton,
  MenuProps,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { removeItemFromList } from '~/api';
import { FormattedDateTime } from '../../Formatters';
import { RichTextView } from '../../RichText';
import { CommentForm } from '../CommentForm';
import { useCommentsContext } from '../CommentsContext';
import { CommentThreadFragment } from '../CommentThread/commentThread.graphql';
import { CommentFragment } from './comment.graphql';
import { CommentItemMenu } from './CommentItemMenu';
import { DeleteCommentDocument } from './DeleteComment.graphql';

export interface CommentProps {
  comment: CommentFragment;
  isChild?: boolean;
  resourceId: string;
  parent: CommentThreadFragment;
  onEditComment?: (comment: CommentFragment) => void;
}

export const CommentItem = ({
  comment,
  isChild,
  parent,
  resourceId,
}: CommentProps) => {
  const { expandedThreads } = useCommentsContext();
  const isExpanded = expandedThreads.has(parent.id);

  const [actionsAnchor, setActionsAnchor] = useState<MenuProps['anchorEl']>();
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const [deleteComment] = useMutation(DeleteCommentDocument, {
    variables: {
      id: comment.id,
    },
    update: removeItemFromList({
      listId: [parent, 'comments'],
      item: comment,
    }),
  });

  const repliesCount = parent.comments.total - 1;
  const hasChildren = repliesCount > 0;

  return (
    <Box
      sx={[
        { padding: 2, position: 'relative' },
        Boolean(isChild) &&
          ((theme) => ({
            pl: 6,
            borderBottom: `1px solid ${theme.palette.divider}`,
          })),
        hasChildren && { pb: 1 },
      ]}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
        <Typography variant="body1" color="text.primary">
          {comment.creator.fullName}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          <FormattedDateTime date={comment.modifiedAt} />
        </Typography>
      </Box>

      {isEditing ? (
        <CommentForm comment={comment} onFinish={() => setIsEditing(false)} />
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
          <CommentForm
            resourceId={resourceId}
            threadId={parent.id}
            sx={{ width: 1 }}
            onFinish={() => {
              setIsReplying(false);
              if (!isExpanded) {
                expandedThreads.add(parent.id);
              }
            }}
          />
        )}

        {!isChild && hasChildren && (
          <ExpandThreadLink
            onClick={() => expandedThreads.toggle(parent.id)}
            isExpanded={isExpanded}
            repliesCount={repliesCount}
          />
        )}

        {!isEditing && !isReplying && !isChild && (
          <Button onClick={() => setIsReplying(true)} startIcon={<Reply />}>
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
          void deleteComment();
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
        <MoreVert fontSize="small" />
      </IconButton>
    </Box>
  );
};

const ExpandThreadLink = ({
  isExpanded,
  repliesCount,
  ...rest
}: {
  isExpanded?: boolean;
  repliesCount: number;
} & ButtonProps) => {
  const Icon = isExpanded ? ExpandLess : ExpandMore;

  return (
    <Button variant="text" color="secondary" startIcon={<Icon />} {...rest}>
      {isExpanded ? 'Hide' : 'Show'} {repliesCount} replies
    </Button>
  );
};
