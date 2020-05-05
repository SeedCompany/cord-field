import { makeStyles, Typography } from '@material-ui/core';
import { FC } from 'react';
import * as React from 'react';
import { CordIcon } from '../../../components/Icons';
import { SwooshBackground } from './SwooshBackground';

const useStyles = makeStyles(({ spacing, typography }) => ({
  root: {
    position: 'relative',
  },
  floating: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '15%',
    padding: spacing(0, 4, 0, 4),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  cordIcon: {
    fontSize: 40,
    color: 'inherit',
  },
  copyright: {
    fontWeight: typography.fontWeightLight,
  },
}));

export const SidebarHeader: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <SwooshBackground />
      <div className={classes.floating}>
        <CordIcon className={classes.cordIcon} />
        <Typography
          className={classes.copyright}
          display="block"
          variant="caption"
        >
          © Cord Field 2020
        </Typography>
      </div>
    </div>
  );
};
