import { makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import { SecuredPeriodicReportFragment } from './PeriodicReport.generated';
import { ReportLabel } from './ReportLabel';

const useStyles = makeStyles(({ palette, shape, transitions }) => ({
  drop: {
    position: 'absolute',
    inset: 2,
    borderRadius: shape.borderRadius,
    border: `4px dashed ${palette.action.hover}`,
    background: palette.background.paper,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: transitions.create('all'),
    pointerEvents: 'none',
  },
  dropActive: {
    opacity: 1,
  },
}));

export const DropOverlay = ({
  show,
  report,
}: {
  report: SecuredPeriodicReportFragment;
  show: boolean;
}) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.drop, show && classes.dropActive)}>
      <Typography variant="h4" align="center">
        Drop{' '}
        <em>
          <ReportLabel report={report} /> {report.value?.type} Report
        </em>{' '}
        here to upload
        {report.value?.reportFile.value ? ' an updated version' : ''}
      </Typography>
    </div>
  );
};
