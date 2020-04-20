import { makeStyles, SvgIcon, SvgIconProps } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(() => ({
  root: {
    color: '#409E04',
  },
}));

export const CordIcon = ({ classes: classesProp, ...rest }: SvgIconProps) => {
  const classes = useStyles();
  return (
    <SvgIcon
      classes={{ root: classes.root, ...classesProp }}
      {...rest}
      viewBox="0 0 21 24"
    >
      <path
        d="M12.3243243 16.8648649c-2.865883 0-5.1891892-2.1779794-5.1891892-4.8648649s2.3233062-4.8648649 5.1891892-4.8648649v9.7297298zM0 12C0 5.3831111 5.4544946 0 12.1591277 0c3.2476129 0 6.3006798 1.2482222 8.5976291 3.5146667l-2.516264 2.4835555c-1.6245945-1.6031111-3.7844159-2.486-6.0813651-2.486-4.7425102 0-8.6003312 3.8075556-8.6003312 8.4877778 0 4.6802222 3.857821 8.4877778 8.6003312 8.4877778 2.2971744 0 4.4567706-.8828889 6.0813651-2.486l2.516264 2.4835555C18.4600326 22.7517778 15.4069658 24 12.1591277 24 5.4544946 24 0 18.6166667 0 12z"
        fillRule="evenodd"
      />
    </SvgIcon>
  );
};
