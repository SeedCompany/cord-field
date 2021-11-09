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
import parse from 'html-react-parser';
import { FC, useMemo, useState } from 'react';
import * as React from 'react';
import { canEditAny, displayPostShareability } from '../../../api';
import { square } from '../../../util';
import { useDialog } from '../../Dialog';
import { FormattedDateTime } from '../../Formatters';
import { DeletePost } from '../DeletePost';
import { EditPost } from '../EditPost';
import { PostableIdFragment } from '../PostableId.generated';
import { PostListItemCardFragment } from './PostListItemCard.generated';
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
    postBody: {
      marginRight: spacing(2),
    },
  };
});

interface PostListItemCardProps {
  post: PostListItemCardFragment;
  className?: string;
  parent: PostableIdFragment;
}

export const PostListItemCard: FC<PostListItemCardProps> = ({
  post,
  ...props
}) => {
  const classes = useStyles();
  const [actionsAnchor, setActionsAnchor] = useState<MenuProps['anchorEl']>();
  const [editState, editPost] = useDialog();
  const [deleteState, deletePost] = useDialog();
  const editable = canEditAny(post);

  const postBody = useMemo(() => parse(post.body.value || ''), [post]);

  return (
    <>
      <Card className={clsx(classes.root, props.className)}>
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
                  {displayPostShareability(post.shareability)}
                </Typography>
              </div>
            </div>
            <div className={classes.postBody}>{postBody}</div>
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
      <EditPost post={post} {...editState} />
      <DeletePost parent={props.parent} post={post} {...deleteState} />
    </>
  );
};
