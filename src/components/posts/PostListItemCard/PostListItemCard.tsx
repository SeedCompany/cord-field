import { MoreVert } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  IconButton,
  MenuProps,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { PostShareabilityLabels } from '~/api/schema.graphql';
import { canEditAny, square } from '~/common';
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
}

export const PostListItemCard = ({
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
      <Card
        sx={{
          width: '100%',
          position: 'relative',
        }}
      >
        <CardContent
          sx={(theme) => ({
            flex: 1,
            padding: theme.spacing(2, 3),
            display: 'flex',
            alignItems: 'flex-start',
          })}
        >
          <Box
            sx={{
              mr: 3,
              mt: 6,
            }}
          >
            <Avatar
              sx={(theme) => ({
                ...square(theme.spacing(8)),
                fontSize: theme.typography.h3.fontSize,
              })}
            >
              {post.creator.value?.avatarLetters}
            </Avatar>
          </Box>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
              }}
            >
              <Box
                sx={(theme) => ({
                  height: theme.spacing(6),
                  flex: 1,
                })}
              >
                <Typography variant="body2">
                  {post.creator.value?.fullName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <FormattedDateTime date={post.createdAt} />
                </Typography>
              </Box>
            </div>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography variant="h4">{post.type}</Typography>
              <Box
                sx={{
                  ml: 2,
                }}
              >
                <Typography variant="body2">
                  <Box
                    component="span"
                    sx={(theme) => ({
                      fontWeight: theme.typography.fontWeightBold,
                      pr: 1,
                    })}
                  >
                    {post.shareability.includes('External')
                      ? 'PUBLIC'
                      : 'PRIVATE'}
                  </Box>
                  {PostShareabilityLabels[post.shareability]}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2">{post.body.value}</Typography>
          </div>
        </CardContent>
        {editable && (
          <IconButton
            sx={{
              margin: 1,
              position: 'absolute',
              right: 0,
              top: 0,
            }}
            onClick={(e) => setActionsAnchor(e.currentTarget)}
          >
            <MoreVert />
          </IconButton>
        )}
      </Card>

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
