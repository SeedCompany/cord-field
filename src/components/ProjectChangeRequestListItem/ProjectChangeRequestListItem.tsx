import {
  Button,
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import * as React from 'react';
import {
  displayProjectChangeRequestTypes,
  useCurrentChangeset,
} from '../../api';
import { FormattedDateTime } from '../Formatters';
import { ProjectChangeRequestListItemFragment as ChangeRequest } from './ProjectChangeRequestListItem.generated';

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

export interface ProjectChangeRequestListItemProps {
  data?: ChangeRequest;
  onEdit?: () => void;
  className?: string;
}

export const ProjectChangeRequestListItem = ({
  data,
  onEdit,
  className,
}: ProjectChangeRequestListItemProps) => {
  const classes = useStyles();
  const [_, setPlanChangeId] = useCurrentChangeset();

  const typesString = displayProjectChangeRequestTypes(data?.types.value ?? []);

  const handleCRMode = () => {
    if (data?.id) {
      setPlanChangeId(data.id);
    }
  };

  return (
    <Card className={className}>
      <CardContent className={classes.cardContent}>
        <div className={classes.memberInfo}>
          <Typography>
            {!data ? (
              <Skeleton variant="text" width="40%" />
            ) : (
              data.summary.value
            )}
          </Typography>
          <Typography variant="body2" color="primary">
            {!data ? (
              <Skeleton variant="text" width="33%" />
            ) : (
              data.status.value
            )}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {!data ? <Skeleton variant="text" width="25%" /> : typesString}
          </Typography>
        </div>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button disabled={!data} color="primary" onClick={onEdit}>
          Edit
        </Button>
        {!data || data.canEdit ? (
          <Button disabled={!data} color="primary" onClick={handleCRMode}>
            CR Mode
          </Button>
        ) : null}
        <Typography variant="subtitle2" color="textSecondary">
          {!data ? (
            <Skeleton variant="text" width="23ch" />
          ) : (
            <>
              Created at <FormattedDateTime date={data.createdAt} />
            </>
          )}
        </Typography>
      </CardActions>
    </Card>
  );
};
