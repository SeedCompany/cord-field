import { Cancel, CloudUpload } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';
import { SecuredPeriodicReportFragment } from '../PeriodicReport.graphql';
import { ReportLabel } from '../ReportLabel';

const upAndDown = keyframes({
  '0%, 100%': { transform: 'translateY(-4px)' },
  '50%': { transform: 'translateY(4px)' },
});

const useStyles = makeStyles()(({ palette, shape, transitions }) => ({
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
    animation: `${upAndDown} 1s ease-in-out infinite`,
  },
}));

export const DropOverlay = ({
  show,
  report,
}: {
  report?: SecuredPeriodicReportFragment;
  show: boolean;
}) => {
  const { classes, cx } = useStyles();

  const file = report?.value?.reportFile;
  return (
    <div className={cx(classes.drop, show && classes.dropActive)}>
      {file?.canEdit ? (
        <CloudUpload
          fontSize="large"
          color="action"
          className={cx(classes.icon, classes.uploadIcon)}
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
