import { Chip, makeStyles } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import { meanBy } from 'lodash';
import { FC } from 'react';
import * as React from 'react';

const possible = 'PresetInventory';
const avgLength = Math.round(meanBy(possible, (s) => s.length));

const useStyles = makeStyles(({ palette, spacing }) => ({
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: spacing(),
  },
  margin: {
    marginTop: 25,
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
  Medium: {
    backgroundColor: palette.warning.main,
  },
  PresetInventory: {
    backgroundColor: palette.error.main,
  },
}));

export interface PresetInventoryProps {
  value?: 'PresetInventory';
  loading?: boolean;
  className?: string;
}

export const PresetInventoryFlag: FC<PresetInventoryProps> = ({
  value,
  loading,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.margin}>
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
            'Preset Inventory'
          )
        }
      />
    </div>
  );
};
