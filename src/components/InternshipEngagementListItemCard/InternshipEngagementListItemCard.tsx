import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import { startCase } from 'lodash';
import { FC } from 'react';
import * as React from 'react';
import { displayEngagementStatus } from '../../api';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { useDateFormatter } from '../Formatters';
import { PencilCircledIcon } from '../Icons';
import { Picture, useRandomPicture } from '../Picture';
import { CardActionAreaLink } from '../Routing';
import { InternshipEngagementListItemFragment } from './InternshipEngagementListItem.generated';

const useStyles = makeStyles(({ spacing }) => {
  const cardWidth = 666;
  return {
    root: {
      width: '100%',
      maxWidth: cardWidth,
      maxHeight: 231,
    },
    card: {
      display: 'flex',
      alignItems: 'initial',
    },
    media: {
      width: cardWidth / 3,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
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
  };
});

export type InternshipEngagementListItemCardProps = InternshipEngagementListItemFragment & {
  projectId: string;
  className?: string;
};

export const InternshipEngagementListItemCard: FC<InternshipEngagementListItemCardProps> = (
  props
) => {
  const dateFormatter = useDateFormatter();
  const classes = useStyles();
  const pic = useRandomPicture({ seed: props.id, width: 300, height: 200 });

  const fullName = props.intern.value?.fullName;
  const endDate = getEndDate(props);
  const position = props.position.value;
  const country = props.countryOfOrigin.value?.name.value;

  return (
    <Card className={clsx(classes.root, props.className)}>
      <CardActionAreaLink
        to={`/projects/${props.projectId}/engagements/${props.id}`}
        className={classes.card}
      >
        <div className={classes.media}>
          <Picture fit="cover" {...pic} />
        </div>
        <CardContent className={classes.cardContent}>
          <Grid
            container
            direction="column"
            justify="space-between"
            spacing={1}
            className={classes.leftContent}
          >
            <Grid item>
              <Typography variant="h4">{fullName}</Typography>
            </Grid>
            {(country || position) && (
              <Grid item>
                {position && (
                  <Typography variant="body2">{startCase(position)}</Typography>
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
                value={displayEngagementStatus(props.status)}
              />
            </Grid>
            <Grid item>
              <Typography
                variant="body2"
                color="primary"
                className={classes.centerItems}
              >
                <PencilCircledIcon className={classes.iconSpacing} />
                Edit Info
              </Typography>
            </Grid>
          </Grid>
          <div className={classes.rightContent}>
            <DisplaySimpleProperty aria-hidden="true" />
            {endDate ? (
              <DisplaySimpleProperty
                label={endDate.label}
                value={dateFormatter(endDate.value)}
                ValueProps={{ color: 'primary' }}
              />
            ) : null}
          </div>
        </CardContent>
      </CardActionAreaLink>
    </Card>
  );
};

const getEndDate = (eng: InternshipEngagementListItemFragment) => {
  const terminal = eng.status !== 'InDevelopment' && eng.status !== 'Active';
  if (terminal && eng.completeDate.value) {
    return {
      label: displayEngagementStatus(eng.status) + ' Date',
      value: eng.completeDate.value,
    };
  }
  const endDate = eng.endDate.value;
  if (!endDate) {
    return null;
  }
  if (eng.status === 'InDevelopment') {
    return { label: 'End Date', value: endDate };
  }
  const revised = endDate !== eng.initialEndDate.value;
  return {
    label: `${revised ? 'Revised' : 'Initial'} End Date`,
    value: endDate,
  };
};
