import {
  Box,
  IconButton,
  LinearProgress,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Cancel as CancelIcon } from '@material-ui/icons';
import React, { FC } from 'react';
import { UploadFile } from './Reducer';

const useStyles = makeStyles(({ palette, spacing }) => ({
  container: {
    padding: spacing(1),
    '&:not(:last-of-type)': {
      borderBottom: `1px solid ${palette.divider}`,
    },
  },
  fileName: {
    width: '18ch',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  progressBarBox: {
    marginTop: spacing(2.5),
  },
  percentage: {
    minWidth: '2ch',
  },
  statusText: {
    fontSize: '0.65rem',
  },
  clearButton: {
    color: palette.error.main,
  },
}));

interface UploadItemProps {
  file: UploadFile;
  onClear: () => void;
}

export const UploadItem: FC<UploadItemProps> = (props) => {
  const { file, onClear } = props;
  const { error, fileName, percentCompleted, uploadId } = file;
  const classes = useStyles();

  const progressLabel = error
    ? error.message
    : !uploadId
    ? 'Initializing'
    : percentCompleted === 100
    ? 'Completed'
    : 'Uploading';

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      className={classes.container}
    >
      <Box mr={2}>
        <Typography variant="body2" className={classes.fileName}>
          {fileName}
        </Typography>
      </Box>
      <Box flex={1} mr={2} className={classes.progressBarBox}>
        <LinearProgress
          variant="determinate"
          value={!error ? percentCompleted : 0}
        />
        <Typography
          variant="caption"
          className={classes.statusText}
          color={error ? 'error' : undefined}
        >
          {progressLabel}
        </Typography>
      </Box>
      <Box>
        {!error ? (
          <Typography
            variant="body2"
            color="textSecondary"
            className={classes.percentage}
          >
            {!uploadId ? null : `${Math.round(percentCompleted)}%`}
          </Typography>
        ) : (
          <IconButton
            aria-label="clear"
            onClick={onClear}
            size="small"
            className={classes.clearButton}
          >
            <CancelIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};
