import { useQuery } from '@apollo/client';
import { Edit } from '@mui/icons-material';
import { Skeleton, Tooltip, Typography } from '@mui/material';
import { useInterval } from 'ahooks';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
import { PartialDeep } from 'type-fest';
import { RoleLabels } from '~/api/schema.graphql';
import { canEditAny, labelsFrom } from '~/common';
import { useDialog } from '../../../components/Dialog';
import {
  DisplaySimpleProperty,
  DisplaySimplePropertyProps,
} from '../../../components/DisplaySimpleProperty';
import { IconButton } from '../../../components/IconButton';
import { PartnerListItemCard } from '../../../components/PartnerListItemCard';
import { Redacted } from '../../../components/Redacted';
import { TogglePinButton } from '../../../components/TogglePinButton';
import { EditUser } from '../Edit';
import { UsersQueryVariables } from '../List/users.graphql';
import { ImpersonationToggle } from './ImpersonationToggle';
import { UserDocument } from './UserDetail.graphql';

const useStyles = makeStyles()(({ spacing, breakpoints }) => ({
  root: {
    overflowY: 'auto',
    padding: spacing(4),
    '& > *:not(:last-child)': {
      marginBottom: spacing(3),
    },
    maxWidth: breakpoints.values.md,
  },
  header: {
    flex: 1,
    display: 'flex',
    gap: spacing(1),
  },
  name: {
    marginRight: spacing(2), // a little extra between text and buttons
    lineHeight: 'inherit', // centers text with buttons better
  },
  partnersContainer: {
    marginTop: spacing(1),
  },
  partner: {
    marginBottom: spacing(2),
  },
}));

export const UserDetail = () => {
  const { classes } = useStyles();
  const { userId = '' } = useParams();
  const { data, error } = useQuery(UserDocument, {
    variables: { userId },
  });

  const [editUserState, editUser] = useDialog();

  const user = data?.user;

  const canEditAnyFields = canEditAny(user);

  return (
    <main className={classes.root}>
      <Helmet title={user?.fullName ?? undefined} />
      {error ? (
        <Typography variant="h4">Error loading person</Typography>
      ) : (
        <>
          <div className={classes.header}>
            <Typography variant="h2" className={classes.name}>
              {!user ? (
                <Skeleton width="20ch" />
              ) : (
                user.fullName ?? (
                  <Redacted
                    info="You don't have permission to view this person's name"
                    width="20ch"
                  />
                )
              )}
            </Typography>
            {canEditAnyFields ? (
              <Tooltip title="Edit Person">
                <IconButton aria-label="edit person" onClick={editUser}>
                  <Edit />
                </IconButton>
              </Tooltip>
            ) : null}
            <TogglePinButton
              object={user}
              label="Person"
              listId="users"
              listFilter={(args: PartialDeep<UsersQueryVariables>) =>
                args.input?.filter?.pinned ?? false
              }
            />
            <ImpersonationToggle user={user} />
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
            value={labelsFrom(RoleLabels)(user?.roles.value)}
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
