import { Chip, colors, makeStyles, Typography } from '@material-ui/core';
import { VerifiedUserOutlined } from '@material-ui/icons';
import clsx from 'clsx';
import { FC } from 'react';
import * as React from 'react';
import { Sensitivity as SensitivityType } from '../../api';

const useStyles = makeStyles(({ palette, spacing }) => ({
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: spacing(),
  },
  icon: {
    height: spacing(2),
    width: spacing(2),
    color: palette.text.secondary,
    marginRight: spacing(1),
  },
  chip: {
    borderRadius: 4,
    color: 'white',
  },
  chipLow: {
    backgroundColor: colors.grey[400],
  },
  chipMedium: {
    backgroundColor: palette.warning.main,
  },
  chipHigh: {
    backgroundColor: palette.error.main,
  },
}));

export interface SensitivityProps {
  value: SensitivityType;
}

export const Sensitivity: FC<SensitivityProps> = ({ value }) => {
  const classes = useStyles();

  const chipClass = clsx({
    [classes.chip]: true,
    [classes.chipHigh]: value === 'High',
    [classes.chipMedium]: value === 'Medium',
    [classes.chipLow]: value === 'Low',
  });

  return (
    <div>
      <div className={classes.iconWrapper}>
        <VerifiedUserOutlined className={classes.icon} />
        <Typography variant="body2">Sensitivity</Typography>
      </div>
      <Chip className={chipClass} size="small" label={value} />
    </div>
  );
};
