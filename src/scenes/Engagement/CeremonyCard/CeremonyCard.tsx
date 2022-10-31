import { useMutation } from '@apollo/client';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';
import { UpdateCeremonyInput } from '~/api/schema.graphql';
import { canEditAny } from '~/common';
import { useDialog } from '../../../components/Dialog';
import { DialogForm } from '../../../components/Dialog/DialogForm';
import { DateField, FieldGroup, SubmitError } from '../../../components/form';
import { useDateFormatter } from '../../../components/Formatters';
import { Redacted } from '../../../components/Redacted';
import {
  CeremonyCardFragment,
  UpdateCeremonyDocument,
} from './CeremonyCard.graphql';
import { CeremonyPlanned } from './CeremonyPlanned';
import { LargeDate } from './LargeDate';

const halfWidth = {
  width: '40%',
};

type CeremonyCardProps = Partial<CeremonyCardFragment>;

export const CeremonyCard = ({
  canRead,
  value: ceremony,
}: CeremonyCardProps) => {
  const { id, type, planned, estimatedDate, actualDate } = ceremony || {};
  const loading = canRead == null;
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

  const loadingOrCanRead =
    loading || !canRead || !ceremony?.estimatedDate.canRead;

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CeremonyPlanned canRead={canRead} value={ceremony} sx={{ mb: 1 }} />
      <Card
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Grid
          component={CardContent}
          container
          direction="column"
          alignItems="center"
          justifyContent="space-evenly"
          spacing={2}
          sx={{ flex: 1 }}
        >
          <Grid item container direction="column" alignItems="center">
            <Typography
              variant="body2"
              sx={loading ? halfWidth : undefined}
              gutterBottom
            >
              {!loading ? `Actual Date` : <Skeleton width="100%" />}
            </Typography>
            <LargeDate date={actualDate} />
          </Grid>
          <Grid item container direction="column" alignItems="center">
            <Typography
              variant="body2"
              sx={loading ? halfWidth : undefined}
              gutterBottom
            >
              {!loading ? 'Estimated Date' : <Skeleton width="100%" />}
            </Typography>
            <Typography
              variant="body2"
              sx={[
                {
                  fontWeight: 'light',
                },
                loadingOrCanRead && halfWidth,
              ]}
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
    </Box>
  );
};
