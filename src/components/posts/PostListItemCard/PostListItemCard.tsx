import {
  Avatar,
  Card,
  CardContent,
  IconButton,
  makeStyles,
  MenuProps,
  Typography,
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import clsx from 'clsx';
import { useState } from 'react';
import * as React from 'react';
import { PostShareabilityLabels } from '~/api/schema';
import { canEditAny } from '~/common';
import { square } from '../../../util';
import { useDialog } from '../../Dialog';
import { FormattedDateTime } from '../../Formatters';
import { DeletePost } from '../DeletePost';
import { EditPost } from '../EditPost';
import { PostableIdFragment } from '../PostableId.graphql';
import { PostListItemCardFragment } from './PostListItemCard.graphql';
import { PostListItemMenu } from './PostListItemMenu';

const useStyles = makeStyles(({ spacing, typography }) => {
  return {
    root: {
      width: '100%',
      position: 'relative',
    },
    card: {
      display: 'flex',
      alignItems: 'initial',
    },
    cardContent: {
      flex: 1,
      padding: spacing(2, 3),
      display: 'flex',
      alignItems: 'flex-start',
    },
    leftContent: {
      marginRight: spacing(3),
      marginTop: spacing(6),
    },
    rightContent: { flex: 1 },
    topRightContent: {
      display: 'flex',
      alignItems: 'flex-start',
    },
    nameAndDate: {
      height: spacing(6),
      flex: 1,
    },
    typeShareabilityRow: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: spacing(1),
    },
    shareability: {
      marginLeft: spacing(2),
    },
    shareabilityLabel: {
      fontWeight: typography.fontWeightBold,
      paddingRight: spacing(1),
    },
    avatar: {
      ...square(spacing(8)),
      fontSize: typography.h3.fontSize,
    },
    actionsMenu: {
      margin: spacing(1),
      position: 'absolute',
      right: 0,
      top: 0,
    },
  };
});

interface PostListItemCardProps {
  parent: PostableIdFragment;
  post: PostListItemCardFragment;
  includeMembership: boolean;
  className?: string;
}

export const PostListItemCard = ({
  parent,
  post,
  includeMembership = false,
  className,
}: PostListItemCardProps) => {
  const classes = useStyles();
  const [actionsAnchor, setActionsAnchor] = useState<MenuProps['anchorEl']>();
  const [editState, editPost] = useDialog();
  const [deleteState, deletePost] = useDialog();
  const editable = canEditAny(post);

  return (
    <>
      <Card className={clsx(classes.root, className)}>
        <CardContent className={classes.cardContent}>
          <div className={classes.leftContent}>
            <Avatar className={classes.avatar}>
              {post.creator.value?.avatarLetters}
            </Avatar>
          </div>
          <div className={classes.rightContent}>
            <div className={classes.topRightContent}>
              <div className={classes.nameAndDate}>
                <Typography variant="body2">
                  {post.creator.value?.fullName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <FormattedDateTime date={post.createdAt} />
                </Typography>
              </div>
            </div>
            <div className={classes.typeShareabilityRow}>
              <Typography variant="h4">{post.type}</Typography>
              <div className={classes.shareability}>
                <Typography variant="body2">
                  <span className={classes.shareabilityLabel}>
                    {post.shareability.includes('External')
                      ? 'PUBLIC'
                      : 'PRIVATE'}
                  </span>
                  {PostShareabilityLabels[post.shareability]}
                </Typography>
              </div>
            </div>
            <Typography variant="body2">{post.body.value}</Typography>
          </div>
        </CardContent>
        {editable && (
          <IconButton
            className={classes.actionsMenu}
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
