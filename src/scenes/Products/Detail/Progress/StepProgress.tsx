import {
  Card,
  CardActionArea,
  Grid,
  LinearProgress,
  makeStyles,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { displayProductStep } from '../../../../api';
import { StepProgressFragment } from './ProductProgress.generated';
import { ProgressIcon } from './ProgressIcon';

const useStyles = makeStyles(({ spacing }) => ({
  infoArea: {
    padding: spacing(1),
  },
}));

export const StepProgress = ({
  progress: { step, percentDone },
  onClick,
}: {
  progress: StepProgressFragment;
  onClick?: () => void;
}) => {
  const classes = useStyles();
  return (
    <Grid container wrap="nowrap" alignItems="center" spacing={2}>
      <Grid item>
        <ProgressIcon percent={percentDone} />
      </Grid>

      <Grid item xs>
        <Card variant="outlined">
          <CardActionArea onClick={onClick}>
            <Grid
              item
              container
              alignItems="center"
              justify="space-between"
              spacing={1}
              className={classes.infoArea}
            >
              <Grid item component={Typography} variant="h4">
                {displayProductStep(step)}
              </Grid>
              <Grid item component={Typography} variant="body2">
                {!percentDone.canRead
                  ? 'No Permission'
                  : percentDone.value
                  ? `${percentDone.value}% Completed`
                  : 'Not Yet Reported'}
              </Grid>
            </Grid>
          </CardActionArea>
          <LinearProgress
            color={percentDone.canRead ? 'primary' : 'secondary'}
            variant="determinate"
            value={percentDone.value || 0}
          />
        </Card>
      </Grid>
    </Grid>
  );
};
