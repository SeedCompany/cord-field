import { Grid, Typography } from '@mui/material';
import { ProgressMeasurement } from '~/api/schema.graphql';
import { useDialog } from '../../../../components/Dialog';
import {
  ProductProgressFragment as ProductProgress,
  StepProgressFragment as StepProgress,
} from './ProductProgress.graphql';
import { StepEditDialog } from './StepEditDialog';
import { StepProgress as StepProgressCard } from './StepProgress';

interface StepsListProps {
  progress?: ProductProgress;
  measurement?: ProgressMeasurement | null;
  target?: number | null;
}

export const StepsList = ({
  progress,
  measurement,
  target,
}: StepsListProps) => {
  const [dialog, edit, editing] = useDialog<StepProgress>();

  return (
    <Grid container direction="column" spacing={1}>
      {progress?.steps.map((sp) => (
        <Grid item key={sp.step}>
          <StepProgressCard
            progress={sp}
            onClick={() => edit(sp)}
            measurement={measurement}
            target={target}
          />
        </Grid>
      ))}
      {progress && progress.steps.length === 0 && (
        <Grid item component={Typography} color="textSecondary">
          Product does not have any steps
        </Grid>
      )}
      {editing && progress && measurement && target && (
        <StepEditDialog
          progress={progress}
          measurement={measurement}
          target={target}
          step={editing}
          {...dialog}
        />
      )}
    </Grid>
  );
};
