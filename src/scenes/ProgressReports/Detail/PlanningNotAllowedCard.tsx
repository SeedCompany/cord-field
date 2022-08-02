import {
  Avatar,
  Card,
  CardActionArea,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { NotInterested } from '@material-ui/icons';
import React from 'react';

const useStyles = makeStyles(({ spacing }) => ({
  card: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    alignItems: 'center',
    padding: spacing(3, 4),
  },
  root: {
    flex: 1,
    position: 'relative',
  },
  avatar: {
    width: 58,
    height: 58,
  },
  addIcon: {
    color: 'white',
  },
  text: {
    marginTop: spacing(1),
    textTransform: 'none',
  },
}));

export const PlanningNotAllowedCard = () => {
  const classes = useStyles();
  return (
    <Tooltip title="This holds the planning info of PnP files" placement="top">
      <Card className={classes.root}>
        <CardActionArea disabled className={classes.card}>
          <Avatar classes={{ root: classes.avatar }}>
            <NotInterested className={classes.addIcon} fontSize="large" />
          </Avatar>
          <Typography variant="button" align="center" className={classes.text}>
            Not allowed to upload a planning info file until at least one
            product is added.
          </Typography>
        </CardActionArea>
      </Card>
    </Tooltip>
  );
};
