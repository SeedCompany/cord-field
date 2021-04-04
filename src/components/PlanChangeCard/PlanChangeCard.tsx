import {
  Button,
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { FC } from 'react';
import * as React from 'react';
import { displayPlanChangeTypes } from '../../api';
import { useDateTimeFormatter } from '../Formatters';
import { PlanChangeCardFragment } from './PlanChange.generated';

const useStyles = makeStyles(({ spacing }) => ({
  cardContent: {
    display: 'flex',
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: spacing(1, 2, 1, 1),
  },
  avatar: {
    width: spacing(7),
    height: spacing(7),
    marginRight: spacing(2),
  },
  memberInfo: {
    flexGrow: 1,
  },
}));

export interface PlanChangeCardProps {
  planChange?: PlanChangeCardFragment;
  onEdit?: () => void;
  className?: string;
}

export const PlanChangeCard: FC<PlanChangeCardProps> = ({
  planChange,
  onEdit,
  className,
}) => {
  const classes = useStyles();
  const dateTimeFormatter = useDateTimeFormatter();

  const typesString = displayPlanChangeTypes(planChange?.types ?? []);
  const createdAtString = dateTimeFormatter(planChange?.createdAt);

  return (
    <Card className={className}>
      <CardContent className={classes.cardContent}>
        <div className={classes.memberInfo}>
          <Typography>
            {!planChange ? (
              <Skeleton variant="text" width="40%" />
            ) : (
              planChange.summary
            )}
          </Typography>
          <Typography variant="body2" color="primary">
            {!planChange ? (
              <Skeleton variant="text" width="33%" />
            ) : (
              planChange.status
            )}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {!planChange ? (
              <Skeleton variant="text" width="25%" />
            ) : (
              typesString
            )}
          </Typography>
        </div>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button disabled={!planChange} color="primary" onClick={onEdit}>
          Edit
        </Button>
        <Typography variant="subtitle2" color="textSecondary">
          {!planChange ? (
            <Skeleton variant="text" width="23ch" />
          ) : (
            `Created at ${createdAtString}`
          )}
        </Typography>
      </CardActions>
    </Card>
  );
};
