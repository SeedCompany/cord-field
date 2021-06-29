import {
  Button,
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import * as React from 'react';
import {
  displayProjectChangeRequestTypes,
  useCurrentChangeset,
} from '../../api';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { FormattedDateTime } from '../Formatters';
import { ProjectChangeRequestListItemFragment as ChangeRequest } from './ProjectChangeRequestListItem.generated';

const useStyles = makeStyles(({ palette, spacing }) => ({
  titleLoading: {
    display: 'flex',
  },
  dash: {
    color: palette.text.secondary,
    margin: spacing(0, 1),
  },
  cardActions: {
    display: 'flex',
    padding: spacing(1, 2, 1, 1),
  },
  spacer: {
    flex: 1,
  },
}));

export interface ProjectChangeRequestListItemProps {
  data?: ChangeRequest;
  className?: string;
}

export const ProjectChangeRequestListItem = ({
  data,
  className,
}: ProjectChangeRequestListItemProps) => {
  const classes = useStyles();
  const [currentlyViewing, setChangeset] = useCurrentChangeset();

  return (
    <Card className={className}>
      <CardContent>
        <Typography
          variant="body1"
          className={data ? undefined : classes.titleLoading}
        >
          <Typography
            variant="inherit"
            color="primary"
            display="inline"
            style={data ? undefined : { width: '10%' }}
          >
            {!data ? <Skeleton width="100%" /> : data.status.value}
          </Typography>
          <span className={classes.dash}>—</span>
          <Typography
            variant="inherit"
            display="inline"
            style={data ? undefined : { width: '40%' }}
          >
            {!data ? (
              <Skeleton width="100%" />
            ) : (
              displayProjectChangeRequestTypes(data.types.value)
            )}
          </Typography>
        </Typography>
        <DisplaySimpleProperty
          label="ID"
          value={data?.id}
          loading={!data}
          loadingWidth="25%"
          paragraph
        />
        <Typography>
          {!data ? <Skeleton width="40%" /> : data.summary.value}
        </Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        {!data || data.canEdit ? (
          <Button
            disabled={!data || currentlyViewing === data.id}
            color="primary"
            onClick={() => data?.id && setChangeset(data.id)}
          >
            {currentlyViewing === data?.id ? 'Viewing' : 'View'}
          </Button>
        ) : null}
        <Tooltip title={data ? 'Not implemented yet' : ''}>
          <Button disabled={!data} color="primary">
            Review
          </Button>
        </Tooltip>
        <div className={classes.spacer} />
        <Typography variant="subtitle2" color="textSecondary">
          {!data ? (
            <Skeleton width="23ch" />
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
