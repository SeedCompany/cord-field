import {
  Cancel as CancelIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { Box, CircularProgress, IconButton, Typography } from '@mui/material';
import { UploadFile } from './Reducer';

interface UploadItemProps {
  file: UploadFile;
  onClear: () => void;
}

export const UploadItem = (props: UploadItemProps) => {
  const { file, onClear } = props;
  const { error, fileName, percentCompleted, uploadId, completedAt } = file;

  const progressLabel = error
    ? error.message
    : !uploadId
    ? 'Initializing'
    : completedAt
    ? 'Completed'
    : 'Uploading';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 1,
        '&:not(:last-of-type)': {
          borderBottom: `1px solid`,
          borderColor: 'divider',
        },
        width: '100%',
      }}
    >
      <Box
        sx={{
          marginRight: 2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {fileName}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.65rem',
            verticalAlign: 'middle',
          }}
          color={error ? 'error' : 'textSecondary'}
        >
          {progressLabel}
        </Typography>
        {!error && !completedAt && uploadId && (
          <Typography
            sx={{
              verticalAlign: 'middle',
            }}
            variant="caption"
            color="primary"
          >
            &nbsp;– {Math.min(99, Math.round(percentCompleted))}%
          </Typography>
        )}
      </Box>
      {error ? (
        <IconButton
          aria-label="clear"
          onClick={onClear}
          sx={{ color: 'error.main' }}
        >
          <CancelIcon />
        </IconButton>
      ) : completedAt ? (
        <IconButton
          aria-label="completed"
          onClick={() => console.log('TODO: Add onCompleted click handler')}
          sx={{ color: 'error.main' }}
        >
          <CheckIcon sx={{ color: 'primary.main' }} />
        </IconButton>
      ) : (
        <Box sx={{ padding: '12px' }}>
          <CircularProgress
            variant="determinate"
            size="1.5em"
            thickness={4.6}
            value={percentCompleted}
          />
        </Box>
      )}
    </Box>
  );
};
