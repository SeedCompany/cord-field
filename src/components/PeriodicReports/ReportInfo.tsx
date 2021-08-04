import { makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { ReactNode } from 'react';
import { SecuredPeriodicReportFragment } from './PeriodicReport.generated';
import { ReportLabel } from './ReportLabel';

const useStyles = makeStyles(() => ({
  label: {
    whiteSpace: 'nowrap',
  },
}));

export const ReportInfo = ({
  title,
  report,
  className,
}: {
  title: ReactNode;
  report?: SecuredPeriodicReportFragment;
  className?: string;
}) => {
  const classes = useStyles();

  return (
    <div className={className}>
      <Typography
        variant="body2"
        display="inline"
        color="textSecondary"
        gutterBottom
      >
        {title}
      </Typography>
      <Typography
        variant="h4"
        display="inline"
        gutterBottom
        className={classes.label}
      >
        {!report ? (
          <Skeleton />
        ) : report.canRead && !report.value ? (
          'None'
        ) : (
          <ReportLabel report={report} />
        )}
      </Typography>
    </div>
  );
};
