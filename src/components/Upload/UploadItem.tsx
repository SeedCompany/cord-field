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
  file?: UploadFile;
}

export const UploadItem: FC<UploadItemProps> = (props) => {
  const { file } = props;
  console.log('file', file);
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
          File name goes here and lots of other things go here too
        </Typography>
      </Box>
      <Box flex={1} mr={2} className={classes.progressBarBox}>
        <LinearProgress variant="determinate" value={50} />
      </Box>
      <Box>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          50
        )}%`}</Typography>
      </Box>
    </Box>
  );
};
