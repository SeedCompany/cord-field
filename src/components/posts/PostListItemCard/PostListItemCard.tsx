import {
  Avatar,
  Card,
  CardContent,
  makeStyles,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import { FC } from 'react';
import * as React from 'react';
import { displayPostShareability } from '../../../api';
import { square } from '../../../util';
import { useDateTimeFormatter } from '../../Formatters';
import { PostListItemCardFragment } from './PostListItemCard.generated';

const useStyles = makeStyles(({ spacing, typography }) => {
  return {
    root: {
      width: '100%',
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
    rightContent: {},
    topInfo: {
      height: spacing(6),
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
  };
});

type PostListItemCardProps = PostListItemCardFragment & {
  className?: string;
};

export const PostListItemCard: FC<PostListItemCardProps> = (props) => {
  const classes = useStyles();
  const formatDate = useDateTimeFormatter();

  return (
    <Card className={clsx(classes.root, props.className)}>
      <CardContent className={classes.cardContent}>
        <div className={classes.leftContent}>
          <Avatar className={classes.avatar}>
            {props.creator.value?.avatarLetters}
          </Avatar>
        </div>
        <div className={classes.rightContent}>
          <div className={classes.topInfo}>
            <Typography variant="body2">
              {`${props.creator.value?.displayFirstName.value} ${props.creator.value?.displayLastName.value}`}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {formatDate(props.createdAt)}
            </Typography>
          </div>
          <div className={classes.typeShareabilityRow}>
            <Typography variant="h4">{props.type}</Typography>
            <div className={classes.shareability}>
              <Typography variant="body2">
                <span className={classes.shareabilityLabel}>
                  {props.shareability.includes('External')
                    ? 'PUBLIC'
                    : 'PRIVATE'}
                </span>
                {displayPostShareability(props.shareability)}
              </Typography>
            </div>
          </div>
          <Typography variant="body2">{props.body.value}</Typography>
        </div>
      </CardContent>
    </Card>
  );
};
