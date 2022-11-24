import { Skeleton, Typography } from '@mui/material';
import { useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { CalendarDate, Nullable, SecuredProp } from '~/common';
import { useDateFormatter } from '../../../components/Formatters';
import { Redacted } from '../../../components/Redacted';

const useStyles = makeStyles()(({ palette, spacing }) => ({
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
  date?: Nullable<SecuredProp<CalendarDate>>;
  className?: string;
}

export const LargeDate = ({ date, className }: LargeDateProps) => {
  const { classes, cx } = useStyles();
  const formatDate = useDateFormatter();
  const [placeholderNow] = useState(() => CalendarDate.local());

  return (
    <Typography
      color="primary"
      variant="h2"
      className={cx(
        classes.root,
        !date?.canRead ? null : classes.loaded,
        className
      )}
    >
      {date?.value ? (
        formatDate(date.value)
      ) : (
        <>
          <span className={classes.hidden}>{formatDate(placeholderNow)}</span>
          {!date ? (
            <Skeleton variant="rectangular" className={classes.skeleton} />
          ) : !date.canRead ? (
            <Redacted
              info="You don't have permission to view this date"
              SkeletonProps={{
                variant: 'rectangular',
                className: cx(classes.skeleton, classes.redacted),
              }}
            />
          ) : null}
        </>
      )}
    </Typography>
  );
};
