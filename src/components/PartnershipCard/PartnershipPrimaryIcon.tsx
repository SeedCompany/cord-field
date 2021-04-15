import { makeStyles, SvgIconProps, Tooltip } from '@material-ui/core';
import { Star } from '@material-ui/icons';
import clsx from 'clsx';
import { FC } from 'react';
import * as React from 'react';

const useStyles = makeStyles(({ palette }) => ({
  primary: {
    color: palette.primary.main,
  },
}));

export interface PartnershipPrimaryIconProps extends SvgIconProps {
  loading?: boolean;
}

export const PartnershipPrimaryIcon: FC<PartnershipPrimaryIconProps> = ({
  loading,
  className,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Tooltip title="Primary">
      <Star className={clsx(classes.primary, className)} {...rest} />
    </Tooltip>
  );
};
