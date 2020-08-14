import {
  Avatar,
  Card,
  CardActionArea,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import clsx from 'clsx';
import React, { FC } from 'react';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    flex: 1,
    height: '100%',
  },
  actionArea: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: spacing(3, 4),
  },
  avatar: {
    backgroundColor: '#f3f4f6',
    width: 58,
    height: 58,
  },
  icon: {
    color: 'white',
  },
  text: {
    marginTop: spacing(1),
    textTransform: 'capitalize',
  },
}));

interface AddItemCardProps {
  className?: string;
  itemType: string;
  onClick: () => void;
}

export const AddItemCard: FC<AddItemCardProps> = (props) => {
  const classes = useStyles();
  const { className, itemType, onClick } = props;

  return (
    <Card className={clsx(classes.root, className)}>
      <CardActionArea className={classes.actionArea} onClick={onClick}>
        <Avatar classes={{ root: classes.avatar }}>
          <AddIcon className={classes.icon} fontSize="large" />
        </Avatar>
        <Typography variant="button" className={classes.text}>
          Add {itemType}
        </Typography>
      </CardActionArea>
    </Card>
  );
};
