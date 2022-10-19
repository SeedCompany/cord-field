import { useMutation } from '@apollo/client';
import { MoreVert, Reply } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  MenuProps,
  Paper,
  Typography,
} from '@mui/material';
import EditorJsRenderer from 'editorjs-blocks-react-renderer';
import { useState } from 'react';
import { removeItemFromList } from '~/api';
import { useDateTimeFormatter } from '~/components/Formatters';
import { CommentItemMenu } from '../CommentItemMenu';
import { CommentReply } from '../CommentReply';
import { useCommentsContext } from '../CommentsBarContext';
import {
  CommentPropsFragment,
  CommentThreadPropsFragment,
} from '../CommentsThreadList.graphql';
import { EditComment } from '../EditComment';
import { DeleteCommentDocument } from './CommentItem.graphql';

export interface CommentProps {
  comment: CommentPropsFragment;
  repliesCount?: number;
  isChild?: boolean;
  resourceId: string;
  isExpanded?: boolean;
  parent: CommentThreadPropsFragment;
  onEditComment?: (comment: CommentPropsFragment) => void;
}

export const CommentItem = ({
  comment,
  repliesCount = 0,
  isChild,
  isExpanded,
  parent,
  resourceId,
}: CommentProps) => {
  const { toggleThreadComments } = useCommentsContext();
  const [actionsAnchor, setActionsAnchor] = useState<MenuProps['anchorEl']>();
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const [deleteCommentMutation] = useMutation(DeleteCommentDocument, {});

  const dateTimeFormatter = useDateTimeFormatter();
  const formattedDateString = dateTimeFormatter(comment.modifiedAt);

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
          <EditorJsRenderer data={comment.body.value} />
        )}

        {!!isEditing && (
          <EditComment
            commentId={comment.id}
            onClose={() => setIsEditing(false)}
            blocks={comment.body.value}
          />
        )}

        <Box>
          {!isEditing && !isReplying && !isChild && (
            <Button onClick={() => setIsReplying(true)}>
              <Reply
                sx={{
                  fontSize: '1.25rem',
                  mr: 0.75,
                }}
              />
              Reply
            </Button>
          )}

          {isReplying && (
            <CommentReply
              resourceId={resourceId}
              threadId={parent.id}
              commentId={comment.id}
              sx={(theme) => ({
                padding: theme.spacing(1, 2),
                mt: 1,
              })}
              onClose={() => setIsReplying(false)}
            />
          )}
        </Box>

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
            sx={{
              margin: 1,
              position: 'absolute',
              right: 0,
              top: 0,
            }}
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
