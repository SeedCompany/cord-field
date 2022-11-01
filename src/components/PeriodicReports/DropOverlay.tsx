import { Cancel, CloudUpload } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { SecuredPeriodicReportFragment } from './PeriodicReport.graphql';
import { ReportLabel } from './ReportLabel';

const upAndDown = keyframes({
  '0%, 100%': { transform: 'translateY(-4px)' },
  '50%': { transform: 'translateY(4px)' },
});

export const DropOverlay = ({
  show,
  report,
}: {
  report?: SecuredPeriodicReportFragment;
  show: boolean;
}) => {
  const file = report?.value?.reportFile;
  return (
    <Box
      sx={[
        (theme) => ({
          position: 'absolute',
          inset: 2,
          borderRadius: theme.shape.borderRadius,
          border: `4px dashed ${theme.palette.action.hover}`,
          background: theme.palette.background.paper,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transition: theme.transitions.create('all'),
          pointerEvents: 'none',
        }),
        show && {
          opacity: 1,
        },
      ]}
    >
      {file?.canEdit ? (
        <CloudUpload
          fontSize="large"
          color="action"
          sx={[
            {
              margin: '4px 0 8px',
            },
            {
              animation: `${upAndDown} 1s ease-in-out infinite`,
            },
          ]}
        />
      ) : (
        <Cancel
          fontSize="large"
          color="error"
          sx={{
            margin: '4px 0 8px',
          }}
        />
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
    </Box>
  );
};
