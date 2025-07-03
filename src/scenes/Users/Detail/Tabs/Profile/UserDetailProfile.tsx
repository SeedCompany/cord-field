import { Box, Skeleton, Typography } from '@mui/material';
import { useInterval } from 'ahooks';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { RoleLabels } from '~/api/schema.graphql';
import { labelsFrom } from '~/common';
import {
  DisplaySimpleProperty,
  DisplaySimplePropertyProps,
} from '~/components/DisplaySimpleProperty';
import { PartnerListItemCard } from '~/components/PartnerListItemCard';
import { UserQuery } from '../../UserDetail.graphql';

interface UserDetailProfileProps {
  user: UserQuery['user'] | undefined;
}

export const UserDetailProfile = ({ user }: UserDetailProfileProps) => {
  return (
    <Box
      sx={{
        overflowY: 'auto',
        padding: 4,
        maxWidth: 'md',
        '& > *:not(:last-child)': {
          marginBottom: 3,
        },
      }}
    >
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

      {!!user?.partners.items.length && (
        <>
          <Typography variant="h3">Partners</Typography>
          <Box sx={{ marginTop: 1 }}>
            {user.partners.items.map((item) => (
              <Box key={item.id} sx={{ marginBottom: 2 }}>
                <PartnerListItemCard partner={item} />
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
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
