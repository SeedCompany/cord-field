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
import { usePlanChange } from './PlanChangeContext';

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
  showCRMode?: boolean;
}

export const PlanChangeCard: FC<PlanChangeCardProps> = ({
  planChange,
  onEdit,
  className,
  showCRMode,
}) => {
  const classes = useStyles();
  const { setPlanChangeId } = usePlanChange();
  const dateTimeFormatter = useDateTimeFormatter();

  const typesString = displayPlanChangeTypes(planChange?.types.value ?? []);
  const createdAtString = dateTimeFormatter(planChange?.createdAt);

  const handleCRMode = () => {
    if (planChange?.id) {
      setPlanChangeId(planChange.id);
    }
  };

  return (
    <Card className={className}>
      <CardContent className={classes.cardContent}>
        <div className={classes.memberInfo}>
          <Typography>
            {!planChange ? (
              <Skeleton variant="text" width="40%" />
            ) : (
              planChange.summary.value
            )}
          </Typography>
          <Typography variant="body2" color="primary">
            {!planChange ? (
              <Skeleton variant="text" width="33%" />
            ) : (
              planChange.status.value
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
        {showCRMode ? (
          <Button disabled={!planChange} color="primary" onClick={handleCRMode}>
            CR Mode
          </Button>
        ) : null}
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
