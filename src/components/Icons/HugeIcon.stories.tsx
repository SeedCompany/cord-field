import { makeStyles } from '@material-ui/core';
import { Home } from '@material-ui/icons';
import * as React from 'react';
import { CordIcon } from './CordIcon';
import { HugeIcon } from './HugeIcon';

export default {
  title: 'Components/Huge Icon',
};

export const IconProperty = () => <HugeIcon icon={Home} />;

const useStyles = makeStyles(() => ({
  cordIcon: {
    // shift cord icon so circle is even. Human eyes are tricky lol
    marginLeft: -4,
  },
}));

export const CustomChildren = () => {
  const classes = useStyles();
  return (
    <HugeIcon>
      <CordIcon className={classes.cordIcon} />
    </HugeIcon>
  );
};
