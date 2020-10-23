import { useMutation } from '@apollo/client';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import React, { FC, useMemo } from 'react';
import { canEditAny, UpdateCeremonyInput } from '../../../api';
import { useDialog } from '../../../components/Dialog';
import { DialogForm } from '../../../components/Dialog/DialogForm';
import { DateField, FieldGroup, SubmitError } from '../../../components/form';
import { useDateFormatter } from '../../../components/Formatters';
import { Redacted } from '../../../components/Redacted';
import {
  CeremonyCardFragment,
  UpdateCeremonyDocument,
} from './CeremonyCard.generated';
import { CeremonyPlanned } from './CeremonyPlanned';
import { LargeDate } from './LargeDate';

const useStyles = makeStyles(({ spacing, typography }) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    marginBottom: spacing(1),
  },
  card: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    flex: 1,
  },
  halfWidth: {
    width: '40%',
  },
  estimatedDate: {
    fontWeight: typography.weight.light,
  },
}));

type CeremonyCardProps = Partial<CeremonyCardFragment>;

export const CeremonyCard: FC<CeremonyCardProps> = ({
  canRead,
  value: ceremony,
}) => {
  const { id, type, planned, estimatedDate, actualDate } = ceremony || {};
  const loading = canRead == null;

  const classes = useStyles();
  const formatDate = useDateFormatter();
  const [updateCeremony] = useMutation(UpdateCeremonyDocument);
  const [dialogState, openDialog] = useDialog();

  const canEditDates = canEditAny(
    ceremony,
    false,
    'actualDate',
    'estimatedDate'
  );
  const editButton = (
    <Button
      color="primary"
      onClick={openDialog}
      disabled={!canEditDates || !planned?.value}
    >
      Edit dates
    </Button>
  );

  const initialValues = useMemo(
    () => ({
      ceremony: {
        id: id || '',
        estimatedDate: estimatedDate?.value,
        actualDate: actualDate?.value,
      },
    }),
    [actualDate?.value, estimatedDate?.value, id]
  );

  return (
    <div className={classes.root}>
      <CeremonyPlanned
        canRead={canRead}
        value={ceremony}
        className={classes.header}
      />
      <Card className={classes.card}>
        <Grid
          component={CardContent}
          container
          direction="column"
          alignItems="center"
          justify="space-evenly"
          spacing={2}
          className={classes.cardContent}
        >
          <Grid item container direction="column" alignItems="center">
            <Typography
              variant="body2"
              className={loading ? classes.halfWidth : undefined}
              gutterBottom
            >
              {!loading ? `Actual Date` : <Skeleton width="100%" />}
            </Typography>
            <LargeDate date={actualDate} />
          </Grid>
          <Grid item container direction="column" alignItems="center">
            <Typography
              variant="body2"
              className={loading ? classes.halfWidth : undefined}
              gutterBottom
            >
              {!loading ? 'Estimated Date' : <Skeleton width="100%" />}
            </Typography>
            <Typography
              variant="body2"
              className={clsx(
                classes.estimatedDate,
                loading || !canRead || !ceremony?.estimatedDate.canRead
                  ? classes.halfWidth
                  : undefined
              )}
            >
              {!loading ? (
                canRead && ceremony?.estimatedDate.canRead ? (
                  formatDate(estimatedDate?.value) || <>&nbsp;</>
                ) : (
                  <Redacted
                    info="You don't have permission to view the estimated date"
                    width="100%"
                  />
                )
              ) : (
                <Skeleton width="100%" />
              )}
            </Typography>
          </Grid>
        </Grid>
        <CardActions>
          {!loading ? (
            !planned?.value ? (
              <Tooltip
                title={`Mark the ${type?.toLowerCase()} as planned before adding dates`}
              >
                <span>{editButton}</span>
              </Tooltip>
            ) : (
              editButton
            )
          ) : (
            <Skeleton>{editButton}</Skeleton>
          )}
        </CardActions>
      </Card>
      <DialogForm<UpdateCeremonyInput>
        title={`Update ${type}`}
        closeLabel="Close"
        submitLabel="Save"
        {...dialogState}
        initialValues={initialValues}
        onSubmit={async (input) => {
          await updateCeremony({ variables: { input } });
        }}
        errorHandlers={{
          Default: `Failed to update ${type?.toLowerCase()}`,
        }}
      >
        <SubmitError />
        <FieldGroup prefix="ceremony">
          <DateField name="estimatedDate" label="Estimated Date" />
          <DateField name="actualDate" label="Actual Date" />
        </FieldGroup>
      </DialogForm>
    </div>
  );
};
