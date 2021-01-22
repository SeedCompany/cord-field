import { useQuery } from '@apollo/client';
import { Fab, Grid, makeStyles, Typography } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import React from 'react';
import { useParams } from 'react-router';
import { displayLocationType } from '../../../api';
import { useDialog } from '../../../components/Dialog';
import {
  DisplaySimpleProperty,
  DisplaySimplePropertyProps,
} from '../../../components/DisplaySimpleProperty';
import { useDateFormatter } from '../../../components/Formatters';
import { FundingAccountCard } from '../../../components/FundingAccountCard';
import { Redacted } from '../../../components/Redacted';
import { Sensitivity } from '../../../components/Sensitivity';
import { EditLocation } from '../Edit';
import { LocationDocument } from './LocationDetail.generated';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    overflowY: 'auto',
    padding: spacing(4),
    '& > *:not(:last-child)': {
      marginBottom: spacing(3),
    },
  },
  name: {
    marginRight: spacing(4),
  },
  nameLoading: {
    width: '60%',
  },
  header: {
    flex: 1,
    display: 'flex',
  },
}));

export const LocationDetail = () => {
  const classes = useStyles();
  const { locationId } = useParams();
  const dateFormatter = useDateFormatter();

  const [editLocationState, editLocation] = useDialog();

  const { data, error } = useQuery(LocationDocument, {
    variables: { locationId },
  });

  const location = data?.location;

  return (
    <main className={classes.root}>
      {error ? (
        <Typography variant="h4">Error loading Location</Typography>
      ) : (
        <>
          <div className={classes.header}>
            <Typography
              variant="h2"
              className={clsx(
                classes.name,
                location?.name ? null : classes.nameLoading
              )}
            >
              {!location ? (
                <Skeleton width="100%" />
              ) : (
                location.name.value ?? (
                  <Redacted
                    info="You don't have permission to view this language's name"
                    width="100%"
                  />
                )
              )}
            </Typography>
            <Fab
              color="primary"
              aria-label="edit language"
              onClick={editLocation}
            >
              <Edit />
            </Fab>
          </div>
          <Typography variant="body2" color="textSecondary">
            Created {dateFormatter(location?.createdAt)}
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Sensitivity value={location?.sensitivity} loading={!location} />
            </Grid>
          </Grid>
          <DisplayProperty
            label="ISO Alpha-3 Code"
            value={location?.isoAlpha3.value}
            loading={!location}
          />
          <DisplayProperty
            label="Type"
            value={displayLocationType(location?.type.value)}
            loading={!location}
          />
          <FundingAccountCard fundingAccount={location?.fundingAccount.value} />
        </>
      )}
      <EditLocation location={location} {...editLocationState} />
    </main>
  );
};

const DisplayProperty = (props: DisplaySimplePropertyProps) =>
  !props.value && !props.loading ? null : (
    <DisplaySimpleProperty
      variant="body1"
      {...{ component: 'div' }}
      {...props}
      loading={
        props.loading ? (
          <>
            <Typography variant="body2">
              <Skeleton width="10%" />
            </Typography>
            <Typography variant="body1">
              <Skeleton width="40%" />
            </Typography>
          </>
        ) : null
      }
      LabelProps={{
        color: 'textSecondary',
        variant: 'body2',
        ...props.LabelProps,
      }}
      ValueProps={{
        color: 'textPrimary',
        ...props.ValueProps,
      }}
    />
  );
