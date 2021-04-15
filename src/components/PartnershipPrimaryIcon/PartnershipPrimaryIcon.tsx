import { makeStyles, SvgIconProps, Tooltip } from '@material-ui/core';
import { Check } from '@material-ui/icons';
import clsx from 'clsx';
import { FC } from 'react';
import * as React from 'react';

const useStyles = makeStyles(({ palette }) => ({
  primary: {
    color: palette.primary.main,
  },
  grey: {
    color: palette.grey[400],
  },
}));

export interface PartnershipPrimaryIconProps extends SvgIconProps {
  value?: boolean;
  loading?: boolean;
}

export const PartnershipPrimaryIcon: FC<PartnershipPrimaryIconProps> = ({
  value,
  loading,
  className,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Tooltip title={!loading && value ? 'Primary' : 'Not Primary'}>
      <Check
        className={clsx(
          !loading && value ? classes.primary : classes.grey,
          className
        )}
        {...rest}
      />
    </Tooltip>
  );
};
