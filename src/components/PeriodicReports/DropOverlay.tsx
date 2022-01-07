import { makeStyles, Typography } from '@material-ui/core';
import { Cancel, CloudUpload } from '@material-ui/icons';
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: transitions.create('all'),
    pointerEvents: 'none',
  },
  dropActive: {
    opacity: 1,
  },
  icon: {
    margin: '4px 0 8px',
  },
  uploadIcon: {
    animation: '$UpAndDown 1s ease-in-out infinite',
  },
  '@keyframes UpAndDown': {
    '0%, 100%': { transform: 'translateY(-4px)' },
    '50%': { transform: 'translateY(4px)' },
  },
}));

export const DropOverlay = ({
  show,
  report,
}: {
  report?: SecuredPeriodicReportFragment;
  show: boolean;
}) => {
  const classes = useStyles();

  const file = report?.value?.reportFile;
  return (
    <div className={clsx(classes.drop, show && classes.dropActive)}>
      {file?.canEdit ? (
        <CloudUpload
          fontSize="large"
          color="action"
          className={clsx(classes.icon, classes.uploadIcon)}
        />
      ) : (
        <Cancel fontSize="large" color="error" className={classes.icon} />
      )}
      <Typography variant="h4" align="center">
        {file && (!file.canEdit || !file.canRead) ? (
          <>You do not have permission to upload report file</>
        ) : report && file ? (
          <>
            <em>
              <ReportLabel report={report} /> {report.value.type} Report
            </em>
            <br />
            Drop here to upload
            {file.value ? ' an updated version' : ''}
          </>
        ) : (
          <>No report currently due</>
        )}
      </Typography>
    </div>
  );
};
