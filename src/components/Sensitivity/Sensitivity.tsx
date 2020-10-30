import { Chip, colors, makeStyles, Typography } from '@material-ui/core';
import { VerifiedUserOutlined } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import { meanBy } from 'lodash';
import { FC } from 'react';
import * as React from 'react';
import { Sensitivity as SensitivityType } from '../../api';

const possible: SensitivityType[] = ['Low', 'Medium', 'High'];
const avgLength = Math.round(meanBy(possible, (s) => s.length));

const useStyles = makeStyles(({ palette, spacing }) => ({
  flex: {
    display: 'flex',
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: spacing(),
    '&$flexed': {
      marginRight: spacing(0.5),
      marginBottom: 0,
    },
  },
  flexed: {}, // here to pacify TypeScript
  icon: {
    fontSize: 16,
    color: palette.text.secondary,
    marginRight: 2,
  },
  chip: {
    borderRadius: 4,
    color: 'white',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  chipLabel: {
    borderRadius: 'inherit', // so it passes down to skeleton
  },
  skeletonWidth: {
    width: `${avgLength}ch`,
  },
  skeleton: {
    borderRadius: 'inherit',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    width: '100%',
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
  value?: SensitivityType;
  variant?: 'stacked' | 'flex';
  loading?: boolean;
  className?: string;
}

export const Sensitivity: FC<SensitivityProps> = ({
  value,
  variant = 'stacked',
  loading,
  className,
}) => {
  const classes = useStyles();

  const containerClassName = clsx(
    className && className,
    variant === 'flex' && classes.flex
  );
  const iconWrapperClassName = clsx(
    classes.iconWrapper,
    variant === 'flex' && classes.flexed
  );

  return (
    <div className={containerClassName}>
      <div className={iconWrapperClassName}>
        <VerifiedUserOutlined className={classes.icon} />
        <Typography variant="body2">Sensitivity</Typography>
      </div>
      <Chip
        classes={{ label: classes.chipLabel }}
        className={clsx(
          classes.chip,
          !loading && value ? classes[value] : null
        )}
        size="small"
        label={
          loading ? (
            <>
              <div className={classes.skeletonWidth} />
              <Skeleton variant="rect" className={classes.skeleton} />
            </>
          ) : (
            value
          )
        }
      />
    </div>
  );
};
