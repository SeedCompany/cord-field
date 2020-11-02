import { useQuery } from '@apollo/client';
import { makeStyles, Tooltip, Typography } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useInterval } from 'react-use';
import { canEditAny, displayRoles } from '../../../api';
import { useDialog } from '../../../components/Dialog';
import {
  DisplaySimpleProperty,
  DisplaySimplePropertyProps,
} from '../../../components/DisplaySimpleProperty';
import { Fab } from '../../../components/Fab';
import { PartnerListItemCard } from '../../../components/PartnerListItemCard';
import { Redacted } from '../../../components/Redacted';
import { EditUser } from '../Edit';
import { UserDocument } from './UserDetail.generated';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    overflowY: 'auto',
    padding: spacing(4),
    '& > *:not(:last-child)': {
      marginBottom: spacing(3),
    },
    maxWidth: breakpoints.values.md,
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
  partnersContainer: {
    marginTop: spacing(1),
  },
  partner: {
    marginBottom: spacing(2),
  },
}));

export const UserDetail = () => {
  const classes = useStyles();
  const { userId } = useParams();
  const { data, error } = useQuery(UserDocument, {
    variables: { userId },
  });

  const [editUserState, editUser] = useDialog();

  const user = data?.user;

  const canEditAnyFields = canEditAny(user);

  return (
    <main className={classes.root}>
      {error ? (
        <Typography variant="h4">Error loading person</Typography>
      ) : (
        <>
          <div className={classes.header}>
            <Typography
              variant="h2"
              className={clsx(
                classes.name,
                user?.fullName ? null : classes.nameLoading
              )}
            >
              {!user ? (
                <Skeleton width="100%" />
              ) : (
                user.fullName ?? (
                  <Redacted
                    info="You don't have permission to view this person's name"
                    width="100%"
                  />
                )
              )}
            </Typography>
            {canEditAnyFields ? (
              <Tooltip title="Edit Person">
                <Fab
                  color="primary"
                  aria-label="edit person"
                  onClick={editUser}
                >
                  <Edit />
                </Fab>
              </Tooltip>
            ) : null}
          </div>
          <DisplayProperty
            label="Email"
            value={user?.email.value}
            loading={!user}
          />
          <DisplayProperty
            label="Title"
            value={user?.title.value}
            loading={!user}
          />
          <DisplayProperty
            label="Roles"
            value={user?.roles.value && displayRoles(user.roles.value)}
            loading={!user}
          />
          <DisplayProperty
            label="Local Time"
            value={
              user?.timezone.value?.name ? (
                <LocalTime timezone={user.timezone.value.name} />
              ) : null
            }
            loading={!user}
          />
          <DisplayProperty
            label="Phone"
            value={user?.phone.value}
            loading={!user}
          />
          <DisplayProperty
            label="About"
            value={user?.about.value}
            loading={!user}
          />
          {user ? <EditUser user={user} {...editUserState} /> : null}

          {!!user?.partners.items.length && (
            <>
              <Typography variant="h3">Partners</Typography>
              <div className={classes.partnersContainer}>
                {user.partners.items.map((item) => (
                  <PartnerListItemCard
                    key={item.id}
                    partner={item}
                    className={classes.partner}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
};

const LocalTime = ({ timezone }: { timezone?: string }) => {
  const now = useNow();
  const formatted = now.toLocaleString({
    timeZone: timezone,
    ...DateTime.TIME_SIMPLE,
    timeZoneName: 'short',
  });
  return <>{formatted}</>;
};

const useNow = (updateInterval = 1_000) => {
  const [now, setNow] = useState(() => DateTime.local());
  useInterval(() => {
    setNow(DateTime.local());
  }, updateInterval);
  return now;
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
