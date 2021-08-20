import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { useDialog } from '../../../../components/Dialog';
import {
  ProductProgressFragment as ProductProgress,
  StepProgressFragment as StepProgress,
} from './ProductProgress.generated';
import { StepEditDialog } from './StepEditDialog';
import { StepProgress as StepProgressCard } from './StepProgress';

interface StepsListProps {
  progress?: ProductProgress;
}

export const StepsList = ({ progress }: StepsListProps) => {
  const [dialog, edit, editing] = useDialog<StepProgress>();

  return (
    <Grid container direction="column" spacing={1}>
      {progress?.steps.map((sp) => (
        <Grid item key={sp.step}>
          <StepProgressCard progress={sp} onClick={() => edit(sp)} />
        </Grid>
      ))}
      {progress && progress.steps.length === 0 && (
        <Grid item component={Typography} color="textSecondary">
          Product does not have any steps
        </Grid>
      )}
      {editing && progress && (
        <StepEditDialog progress={progress} step={editing} {...dialog} />
      )}
    </Grid>
  );
};
