import { colors, makeStyles, SvgIconProps, Tooltip } from '@material-ui/core';
import { VerifiedUser } from '@material-ui/icons';
import clsx from 'clsx';
import * as React from 'react';
import { Sensitivity as SensitivityType } from '../../api';

const useStyles = makeStyles(({ palette }) => ({
  Low: {
    color: colors.grey[400],
  },
  Medium: {
    color: palette.warning.main,
  },
  High: {
    color: palette.error.main,
  },
}));

export interface SensitivityIconProps extends SvgIconProps {
  value?: SensitivityType;
  loading?: boolean;
  disableTooltip?: boolean;
}

export const SensitivityIcon = ({
  value,
  loading,
  className,
  disableTooltip,
  ...rest
}: SensitivityIconProps) => {
  const classes = useStyles();

  return (
    <Tooltip title={!loading && !disableTooltip ? `${value} Sensitivity` : ''}>
      <VerifiedUser
        className={clsx(!loading && value ? classes[value] : null, className)}
        {...rest}
      />
    </Tooltip>
  );
};
