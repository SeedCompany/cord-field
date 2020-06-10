import {
  Breadcrumbs,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import React from 'react';
import { useParams } from 'react-router';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { DisplaySimpleProperty } from '../../../components/DisplaySimpleProperty';
import { useDateFormatter } from '../../../components/Formatters';
import { PencilCircledIcon } from '../../../components/Icons';
import { useUserQuery } from './UserDetail.generated';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    overflowY: 'scroll',
    padding: spacing(4),
    '& > *': {
      marginBottom: spacing(3),
    },
  },
  name: {
    marginRight: spacing(2),
  },
  nameLoading: {
    flex: 1,
  },
  header: {
    flex: 1,
    display: 'flex',
  },
  bio: {
    marginBottom: 0,
  },
}));

export const UserDetail = () => {
  const classes = useStyles();
  const { userId } = useParams();
  const { data, error } = useUserQuery({
    variables: {
      input: userId,
    },
  });

  const user = data?.user;

  const formatDateTime = useDateFormatter();

  return (
    <main className={classes.root}>
      {error ? (
        <Typography variant="h4">Error fetching Project</Typography>
      ) : (
        <>
          <Breadcrumbs>
            <Breadcrumb to="/users">Users</Breadcrumb>
          </Breadcrumbs>
          <div className={classes.header}>
            <Typography
              variant="h2"
              className={clsx(classes.name, user ? null : classes.nameLoading)}
            >
              {user ? user.fullName : <Skeleton width="75%" />}
            </Typography>
            {user ? (
              <IconButton
                color="primary"
                aria-label="edit user"
                // onClick={editOrg}
              >
                <PencilCircledIcon />
              </IconButton>
            ) : null}
          </div>
          {user ? (
            <>
              <Typography>Email: {user.email.value}</Typography>
              <Typography>Phone: {user.phone.value}</Typography>
              <Typography variant="h4" className={classes.bio}>
                Bio
              </Typography>
              <Typography>{user.bio.value}</Typography>
              <DisplaySimpleProperty
                label="Created At"
                value={formatDateTime(user.createdAt)}
                ValueProps={{ color: 'textSecondary' }}
              />
            </>
          ) : null}
        </>
      )}
    </main>
  );
};
