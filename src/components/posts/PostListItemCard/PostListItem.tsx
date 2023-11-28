import { MoreVert } from '@mui/icons-material';
import {
  Container,
  IconButton,
  MenuProps,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { canEditAny } from '~/common';
import { useDialog } from '../../Dialog';
import { FormattedDateTime } from '../../Formatters';
import { DeletePost } from '../DeletePost';
import { EditPost } from '../EditPost';
import { PostableIdFragment } from '../PostableId.graphql';
import { PostListItemCardFragment } from './PostListItemCard.graphql';
import { PostListItemMenu } from './PostListItemMenu';

interface PostListItemCardProps {
  parent: PostableIdFragment;
  post: PostListItemCardFragment;
  includeMembership: boolean;
  className?: string;
}

export const PostListItem = ({
  parent,
  post,
  includeMembership = false,
}: PostListItemCardProps) => {
  const [actionsAnchor, setActionsAnchor] = useState<MenuProps['anchorEl']>();
  const [editState, editPost] = useDialog();
  const [deleteState, deletePost] = useDialog();
  const editable = canEditAny(post);

  return (
    <>
      <Container maxWidth={false}>
        <Stack
          direction="column"
          spacing={1}
          sx={{ pr: 3.5, pl: 1, pt: 1, pb: 3 }}
        >
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
        </Stack>
      </Container>

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
    </>
  );
};
