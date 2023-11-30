import { MoreVert } from '@mui/icons-material';
import { IconButton, MenuProps, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { canEditAny, StyleProps } from '~/common';
import { useDialog } from '../../Dialog';
import { FormattedDateTime } from '../../Formatters';
import { DeletePost } from '../DeletePost';
import { EditPost } from '../EditPost';
import { PostableIdFragment } from '../PostableId.graphql';
import { PostListItemCardFragment } from './PostListItemCard.graphql';
import { PostListItemMenu } from './PostListItemMenu';

interface PostListItemCardProps extends StyleProps {
  parent: PostableIdFragment;
  post: PostListItemCardFragment;
  includeMembership?: boolean;
}

export const PostListItem = ({
  parent,
  post,
  includeMembership = false,
  ...rest
}: PostListItemCardProps) => {
  const [actionsAnchor, setActionsAnchor] = useState<MenuProps['anchorEl']>();
  const [editState, editPost] = useDialog();
  const [deleteState, deletePost] = useDialog();
  const editable = canEditAny(post);

  return (
    <Stack direction="column" spacing={1} {...rest}>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Stack
          direction="column"
          justifyContent="center"
          spacing={0.5}
          flex={1}
        >
          <Typography variant="body2" color="textSecondary">
            {post.creator.value?.fullName}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <FormattedDateTime date={post.createdAt} />
          </Typography>
        </Stack>
        {editable && (
          <IconButton onClick={(e) => setActionsAnchor(e.currentTarget)}>
            <MoreVert />
          </IconButton>
        )}
      </Stack>
      <Typography variant="h4">{post.body.value}</Typography>

      <PostListItemMenu
        anchorEl={actionsAnchor}
        open={Boolean(actionsAnchor)}
        onClose={() => setActionsAnchor(null)}
        onEdit={() => {
          editPost();
          setActionsAnchor(null);
        }}
        onDelete={() => {
          deletePost();
          setActionsAnchor(null);
        }}
      />
      <EditPost
        includeMembership={includeMembership}
        post={post}
        {...editState}
      />
      <DeletePost parent={parent} post={post} {...deleteState} />
    </Stack>
  );
};
