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
    fontSize: 16,
    color: palette.text.secondary,
    marginRight: spacing(1),
  },
  chip: {
    borderRadius: 4,
    color: 'white',
  },
  Low: {
    backgroundColor: colors.grey[400],
  },
  Medium: {
    backgroundColor: palette.warning.main,
  },
  High: {
    backgroundColor: palette.error.main,
  },
}));

export interface SensitivityProps {
  value: SensitivityType;
}

export const Sensitivity: FC<SensitivityProps> = ({ value }) => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.iconWrapper}>
        <VerifiedUserOutlined className={classes.icon} />
        <Typography variant="body2">Sensitivity</Typography>
      </div>
      <Chip
        className={clsx(classes.chip, classes[value])}
        size="small"
        label={value}
      />
    </div>
  );
};
