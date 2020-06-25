import { Box, LinearProgress, makeStyles, Typography } from '@material-ui/core';
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
    maxWidth: '18ch',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  progressBarBox: {
    marginTop: spacing(0.5),
  },
}));

interface UploadItemProps {
  file: UploadFile;
}

export const UploadItem: FC<UploadItemProps> = (props) => {
  const { file } = props;
  const { error, fileName, percentCompleted } = file;
  const classes = useStyles();
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
      {!error ? (
        <>
          <Box flex={1} mr={2} className={classes.progressBarBox}>
            <LinearProgress variant="determinate" value={percentCompleted} />
          </Box>
          <Box>
            <Typography variant="body2" color="textSecondary">{`${Math.round(
              percentCompleted
            )}%`}</Typography>
          </Box>
        </>
      ) : (
        <Box flex={1}>
          <Typography variant="body2" color="error">
            {error.message}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
