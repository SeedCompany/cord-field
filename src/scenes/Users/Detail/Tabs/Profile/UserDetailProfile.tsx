import { Box, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { useInterval } from 'ahooks';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { GenderLabels, RoleLabels } from '~/api/schema.graphql';
import { labelFrom, labelsFrom } from '~/common';
import {
  DisplaySimpleProperty,
  DisplaySimplePropertyProps,
} from '~/components/DisplaySimpleProperty';
import { Link } from '~/components/Routing';
import { UserProfileFragment } from './UserDetailProfile.graphql';

interface UserDetailProfileProps {
  user: UserProfileFragment;
}

export const UserDetailProfile = ({ user }: UserDetailProfileProps) => {
  const organization = user.organizations.items[0];
  const partner = organization
    ? user.partners.items.find(
        (item) => item.organization.value?.id === organization.id
      )
    : user.partners.items[0];
  const partnerName =
    organization?.name.value ?? partner?.organization.value?.name.value;

  return (
    <Box
      component={Paper}
      sx={(theme) => ({
        width: theme.breakpoints.values.md,
      })}
    >
      <Stack
        sx={{
          p: 2,
          gap: 2,
        }}
      >
        <DisplayProperty label="Status" value={user.status.value} />
        <DisplayProperty
          label="Gender"
          value={labelFrom(GenderLabels)(user.gender.value)}
        />
        <DisplayProperty label="Email" value={user.email.value} />
        <DisplayProperty label="Title" value={user.title.value} />
        <DisplayProperty
          label="Roles"
          value={labelsFrom(RoleLabels)(user.roles.value)}
        />
        <DisplayProperty
          label="Partner"
          value={
            partner && partnerName ? (
              <Link to={`/partners/${partner.id}`}>{partnerName}</Link>
            ) : null
          }
        />
        <DisplayProperty
          label="Local Time"
          value={
            user.timezone.value?.name ? (
              <LocalTime timezone={user.timezone.value.name} />
            ) : null
          }
        />
        <DisplayProperty label="Phone" value={user.phone.value} />
        <DisplayProperty label="About" value={user.about.value} />
      </Stack>
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
