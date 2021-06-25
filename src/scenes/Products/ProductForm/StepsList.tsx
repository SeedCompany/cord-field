import {
  Box,
  Card,
  CardActionArea,
  Grid,
  LinearProgress,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDialog } from '../../../components/Dialog';
import { StepEditDialog, StepFormState } from './StepEditDialog';

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    flex: 1,
  },
  title: {
    marginBottom: spacing(3),
  },
  bullet: {
    width: spacing(3),
    height: spacing(3),
    backgroundColor: palette.grey[300],
    borderRadius: '100%',
    marginRight: spacing(2),
  },
  card: {
    flex: '1 1 auto',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  stepItem: {
    flex: '1 1',
  },
  stepItemTitle: {
    padding: spacing(1.5, 0, 1.3, 2),
    background: 'white',
    boxShadow: '0px 4px 12px rgba(209, 218, 223, 0.43)',
    borderRadius: '6px 6px 0px 0px',
  },
  progressValue: {
    fontSize: 12,
    color: palette.grey[600],
    marginRight: spacing(0.5),
    whiteSpace: 'nowrap',
  },
  actions: {
    width: 'auto',
  },
}));

interface StepsListProps {
  steps: StepFormState[];
  onSubmit: (newSteps: StepFormState[]) => void;
}

export const StepsList: FC<StepsListProps> = ({ steps, onSubmit }) => {
  const classes = useStyles();

  const [stepEditForm, openStepEditForm, stepEditInitialValues] =
    useDialog<StepFormState>();

  const editStepItem = (step: StepFormState) => {
    openStepEditForm({
      id: step.id,
      name: step.name,
      percentDone: step.percentDone,
      description: step.description,
    });
  };

  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant="h3">
        Steps
      </Typography>

      <Grid container direction="column" spacing={1}>
        {steps.map((step, index) => (
          <Grid
            key={index}
            item
            container
            wrap="nowrap"
            justify="space-between"
            alignItems="center"
          >
            <div className={classes.bullet} />

            <Card className={classes.card} variant="outlined">
              <CardActionArea onClick={() => editStepItem(step)}>
                <Grid container direction="column" className={classes.stepItem}>
                  <Grid
                    item
                    container
                    className={classes.stepItemTitle}
                    justify="space-between"
                    alignItems="center"
                    wrap="nowrap"
                  >
                    <Grid item>
                      <Typography variant="h4">{step.name}</Typography>
                    </Grid>
                    <Grid
                      item
                      container
                      alignItems="center"
                      justify="flex-end"
                      className={classes.actions}
                      wrap="nowrap"
                    >
                      <Typography className={classes.progressValue}>
                        {step.percentDone
                          ? `${step.percentDone}% Completed`
                          : 'Not Yet Started'}
                      </Typography>

                      <MoreVert />
                    </Grid>
                  </Grid>

                  <Grid item>
                    <Box width="100%">
                      <LinearProgress
                        color="primary"
                        variant="determinate"
                        value={step.percentDone || 0}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {stepEditInitialValues && (
        <StepEditDialog
          {...stepEditInitialValues}
          {...stepEditForm}
          onSubmit={(values) => {
            onSubmit(
              steps.map((step) =>
                step.name === values.name
                  ? {
                      id: values.id,
                      name: values.name,
                      description: values.description,
                      percentDone: values.newValue
                        ? Number(values.newValue)
                        : values.newValue,
                    }
                  : step
              )
            );
          }}
        />
      )}
    </div>
  );
};
