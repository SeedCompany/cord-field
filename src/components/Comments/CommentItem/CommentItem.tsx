import { useMutation } from '@apollo/client';
import { MoreVert } from '@mui/icons-material';
import { Box, IconButton, MenuProps, Stack, Typography } from '@mui/material';
import { useControllableValue } from 'ahooks';
import { useState } from 'react';
import { removeItemFromList } from '~/api';
import { RelativeDateTime } from '../../Formatters';
import { RichTextView } from '../../RichText';
import { Link } from '../../Routing';
import { UpdateComment } from '../CommentForm/UpdateComment';
import { CommentThreadFragment } from '../CommentThread/commentThread.graphql';
import { CommentFragment } from './comment.graphql';
import { CommentItemMenu } from './CommentItemMenu';
import { DeleteCommentDocument } from './DeleteComment.graphql';

export interface CommentProps {
  comment: CommentFragment;
  thread: CommentThreadFragment;
  isEditing?: boolean;
  onEditChange?: (state: boolean) => void;
}

export const CommentItem = ({ comment, thread, ...props }: CommentProps) => {
  const [actionsAnchor, setActionsAnchor] = useState<MenuProps['anchorEl']>();
  const [isEditing, onEditChange] = useControllableValue<boolean>({
    ...(props.isEditing != null && { value: props.isEditing }),
    onChange: props.onEditChange,
  });

  const [deleteComment] = useMutation(DeleteCommentDocument, {
    variables: {
      id: comment.id,
    },
    update: removeItemFromList({
      listId: [thread, 'comments'],
      item: comment,
    }),
  });

  return (
    <Stack gap="var(--gap)" role="listitem">
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="start"
      >
        <Box>
          <Link to={`/users/${comment.creator.id}`}>
            {comment.creator.fullName}
          </Link>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            <RelativeDateTime date={comment.modifiedAt} />
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={(e) => setActionsAnchor(e.currentTarget)}
        >
          <MoreVert fontSize="inherit" />
        </IconButton>
      </Stack>

      {isEditing ? (
        <UpdateComment
          comment={comment}
          onFinish={() => onEditChange(false)}
          onCancel={() => onEditChange(false)}
        />
      ) : (
        <Box sx={{ '> :last-child': { mb: 0 } }}>
          <RichTextView data={comment.body.value} />
        </Box>
      )}

      <CommentItemMenu
        comment={comment}
        anchorEl={actionsAnchor}
        onClose={() => setActionsAnchor(null)}
        open={Boolean(actionsAnchor)}
        onDelete={() => {
          void deleteComment();
        }}
        onEdit={() => {
          onEditChange(true);
          setActionsAnchor(null);
        }}
      />
    </Stack>
  );
};
