import { colors, makeStyles, SvgIconProps } from '@material-ui/core';
import { VerifiedUserOutlined } from '@material-ui/icons';
import clsx from 'clsx';
import { FC } from 'react';
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
}

export const SensitivityIcon: FC<SensitivityIconProps> = ({
  value,
  loading,
  className,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <VerifiedUserOutlined
      className={clsx(!loading && value ? classes[value] : null, className)}
      {...rest}
    />
  );
};
