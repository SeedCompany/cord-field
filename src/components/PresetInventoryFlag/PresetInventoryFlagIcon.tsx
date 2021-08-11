import { makeStyles, SvgIconProps, Tooltip } from '@material-ui/core';
import { VerifiedUser } from '@material-ui/icons';
import clsx from 'clsx';
import { FC } from 'react';
import * as React from 'react';
import { PresetInventoryFlag as PresetInventoryFlagType } from '../../api';

const useStyles = makeStyles(({ palette }) => ({
  PresetInventory: {
    backgroundColor: palette.error.main,
  },
}));

export interface PresetInventoryIconProps extends SvgIconProps {
  value?: PresetInventoryFlagType;
  loading?: boolean;
  disableTooltip?: boolean;
}

export const SensitivityIcon: FC<PresetInventoryIconProps> = ({
  value,
  loading,
  className,
  disableTooltip,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Tooltip title={`${value} PresetInventory`}>
      <VerifiedUser
        className={clsx(!loading && value ? classes[value] : null, className)}
        {...rest}
      />
    </Tooltip>
  );
};
