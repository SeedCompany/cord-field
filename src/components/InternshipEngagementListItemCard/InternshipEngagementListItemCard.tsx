import {
  Card,
  CardActions,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import * as React from 'react';
import { EngagementStatusLabels, InternshipPositionLabels } from '~/api/schema';
import { labelFrom } from '~/common';
import { idForUrl } from '../Changeset';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { FormattedDate } from '../Formatters';
import { ButtonLink, CardActionAreaLink } from '../Routing';
import { InternshipEngagementListItemFragment } from './InternshipEngagementListItem.graphql';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    width: '100%',
  },
  card: {
    display: 'flex',
    alignItems: 'initial',
  },
  cardContent: {
    flex: 1,
    padding: spacing(2, 3),
    display: 'flex',
    justifyContent: 'space-between',
  },
  leftContent: {
    flex: 1,
  },
  rightContent: {
    flex: 1,
    textAlign: 'right',
    marginLeft: spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  centerItems: {
    display: 'flex',
    alignItems: 'center',
    marginTop: spacing(2),
  },
  iconSpacing: {
    marginRight: spacing(1),
  },
}));

export type InternshipEngagementListItemCardProps =
  InternshipEngagementListItemFragment & {
    className?: string;
  };

export const InternshipEngagementListItemCard = (
  props: InternshipEngagementListItemCardProps
) => {
  const classes = useStyles();

  const fullName = props.intern.value?.fullName;
  const endDate = getEndDate(props);
  const position = props.position.value;
  const country = props.countryOfOrigin.value?.name.value;

  return (
    <Card className={clsx(classes.root, props.className)}>
      <CardActionAreaLink
        to={`/engagements/${idForUrl(props)}`}
        className={classes.card}
      >
        <Grid
          component={CardContent}
          container
          direction="column"
          justify="space-between"
          spacing={1}
          className={classes.cardContent}
        >
          <Grid item>
            <Typography variant="h4">{fullName}</Typography>
          </Grid>
          {(country || position) && (
            <Grid item>
              {position && (
                <Typography variant="body2">
                  {InternshipPositionLabels[position]}
                </Typography>
              )}
              {country && (
                <Typography variant="body2" color="primary">
                  {country}
                </Typography>
              )}
            </Grid>
          )}
          <Grid item>
            <DisplaySimpleProperty
              label="Status"
              value={labelFrom(EngagementStatusLabels)(props.status.value)}
            />
          </Grid>
          {endDate ? (
            <Grid item>
              <DisplaySimpleProperty
                label={endDate.label}
                value={<FormattedDate date={endDate.value} />}
                ValueProps={{ color: 'primary' }}
              />
            </Grid>
          ) : null}
        </Grid>
      </CardActionAreaLink>
      <CardActions>
        <ButtonLink to={`/engagements/${idForUrl(props)}`} color="primary">
          View Details
        </ButtonLink>
      </CardActions>
    </Card>
  );
};

const getEndDate = (eng: InternshipEngagementListItemFragment) => {
  const status = eng.status.value;
  const terminal = status !== 'InDevelopment' && status !== 'Active';
  if (terminal && eng.completeDate.value) {
    return {
      label: `${labelFrom(EngagementStatusLabels)(status)} Date`,
      value: eng.completeDate.value,
    };
  }
  const endDate = eng.dateRange.value.end;
  if (!endDate) {
    return null;
  }
  if (status === 'InDevelopment') {
    return { label: 'End Date', value: endDate };
  }
  const revised = endDate !== eng.initialEndDate.value;
  return {
    label: `${revised ? 'Revised' : 'Initial'} End Date`,
    value: endDate,
  };
};
