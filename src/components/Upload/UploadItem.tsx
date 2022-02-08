import {
  CircularProgress,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import {
  Cancel as CancelIcon,
  CheckCircle as CheckIcon,
} from '@material-ui/icons';
import React, { FC } from 'react';
import { UploadFile } from './Reducer';

const useStyles = makeStyles(({ palette, spacing }) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing(1),
    '&:not(:last-of-type)': {
      borderBottom: `1px solid ${palette.divider}`,
    },
    width: '100%',
  },
  text: {
    marginRight: spacing(2),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  fileName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  statusText: {
    fontSize: '0.65rem',
    verticalAlign: 'middle',
  },
  percentCompleted: {
    verticalAlign: 'middle',
  },
  progressContainer: {
    padding: '12px',
  },
  postUploadButton: {
    color: palette.error.main,
  },
  completedIcon: {
    color: palette.primary.main,
  },
}));

interface UploadItemProps {
  file: UploadFile;
  onClear: () => void;
}

export const UploadItem: FC<UploadItemProps> = (props) => {
  const { file, onClear } = props;
  const { error, fileName, percentCompleted, uploadId, completedAt } = file;
  const classes = useStyles();

  const progressLabel = error
    ? error.message
    : !uploadId
    ? 'Initializing'
    : completedAt
    ? 'Completed'
    : 'Uploading';

  return (
    <div className={classes.container}>
      <div className={classes.text}>
        <Typography variant="body2" className={classes.fileName}>
          {fileName}
        </Typography>
        <Typography
          variant="caption"
          className={classes.statusText}
          color={error ? 'error' : 'textSecondary'}
        >
          {progressLabel}
        </Typography>
        {!error && !completedAt && uploadId && (
          <Typography
            className={classes.percentCompleted}
            variant="caption"
            color="primary"
          >
            &nbsp;– {Math.min(99, Math.round(percentCompleted))}%
          </Typography>
        )}
      </div>
      {error ? (
        <IconButton
          aria-label="clear"
          onClick={onClear}
          className={classes.postUploadButton}
        >
          <CancelIcon />
        </IconButton>
      ) : completedAt ? (
        <IconButton
          aria-label="completed"
          onClick={() => console.log('TODO: Add onCompleted click handler')}
          className={classes.postUploadButton}
        >
          <CheckIcon className={classes.completedIcon} />
        </IconButton>
      ) : (
        <div className={classes.progressContainer}>
          <CircularProgress
            variant="determinate"
            size="1.5em"
            thickness={4.6}
            value={percentCompleted}
          />
        </div>
      )}
    </div>
  );
};
