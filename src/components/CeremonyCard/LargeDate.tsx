import { makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import * as React from 'react';
import { Secured } from '../../api';
import { CalendarDate, Nullable } from '../../util';
import { useDateFormatter } from '../Formatters';
import { Redacted } from '../Redacted';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    padding: spacing(2),
    borderRadius: 100,
    position: 'relative',
  },
  loaded: {
    backgroundColor: palette.grey[300],
  },
  hidden: {
    visibility: 'hidden',
  },
  skeleton: {
    borderRadius: 'inherit',
    height: 'initial',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  redacted: {
    backgroundColor: palette.grey[700],
  },
}));

interface LargeDateProps {
  date?: Nullable<Secured<CalendarDate>>;
  className?: string;
}

const placeholderNow = CalendarDate.local();

export const LargeDate = ({ date, className }: LargeDateProps) => {
  const classes = useStyles();
  const formatDate = useDateFormatter();

  return (
    <Typography
      color="primary"
      variant="h2"
      className={clsx(
        classes.root,
        !date || !date.canRead ? null : classes.loaded,
        className
      )}
    >
      {date?.value ? (
        formatDate(date?.value)
      ) : (
        <>
          <span className={classes.hidden}>{formatDate(placeholderNow)}</span>
          {!date ? (
            <Skeleton variant="rect" className={classes.skeleton} />
          ) : !date.canRead ? (
            <Redacted
              info="You don't have permission to view this date"
              SkeletonProps={{
                variant: 'rect',
                className: clsx(classes.skeleton, classes.redacted),
              }}
            />
          ) : null}
        </>
      )}
    </Typography>
  );
};
