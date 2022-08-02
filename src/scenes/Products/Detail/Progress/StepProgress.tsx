import {
  Card,
  CardActionArea,
  Grid,
  LinearProgress,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { ProductStepLabels, ProgressMeasurement } from '~/api/schema.graphql';
import { StepProgressFragment } from './ProductProgress.graphql';
import { ProgressIcon } from './ProgressIcon';

const useStyles = makeStyles(({ spacing }) => ({
  infoArea: {
    padding: spacing(1),
  },
}));

export const StepProgress = ({
  measurement,
  target,
  progress: { step, completed },
  onClick,
}: {
  measurement?: ProgressMeasurement | null;
  target?: number | null;
  progress: StepProgressFragment;
  onClick?: () => void;
}) => {
  const classes = useStyles();
  const progressValue = completed.value || 0;
  return (
    <Grid container wrap="nowrap" alignItems="center" spacing={2}>
      <Grid item>
        <ProgressIcon complete={target === progressValue} />
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
                {ProductStepLabels[step]}
              </Grid>
              <Grid item component={Typography} variant="body2">
                {!completed.canRead
                  ? 'No Permission'
                  : completed.value
                  ? `${
                      measurement === 'Boolean'
                        ? ''
                        : `${completed.value}${
                            measurement === 'Percent' ? '%' : `/${target}`
                          } `
                    }Completed`
                  : 'Not Yet Reported'}
              </Grid>
            </Grid>
          </CardActionArea>
          <LinearProgress
            color={completed.canRead ? 'primary' : 'secondary'}
            variant="determinate"
            value={target ? (progressValue / target) * 100 : progressValue}
          />
        </Card>
      </Grid>
    </Grid>
  );
};
