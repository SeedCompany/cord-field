import { makeStyles, SvgIconProps } from '@material-ui/core';
import { FC } from 'react';
import * as React from 'react';

const useStyles = makeStyles(({ palette }) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: 64,
    backgroundColor: palette.grey[200],
  },
  icon: {
    color: palette.info.main,
  },
}));

export interface HugeIconProps {
  icon: React.ComponentType<SvgIconProps>;
}

export const HugeIcon: FC<HugeIconProps> = ({ icon: Icon }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Icon fontSize="large" className={classes.icon} />
    </div>
  );
};
