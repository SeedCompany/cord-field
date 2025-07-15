import { Edit } from '@mui/icons-material';
import {
  Box,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useInterval } from 'ahooks';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { RoleLabels } from '~/api/schema.graphql';
import { canEditAny, labelsFrom } from '~/common';
import { useDialog } from '~/components/Dialog';
import {
  DisplaySimpleProperty,
  DisplaySimplePropertyProps,
} from '~/components/DisplaySimpleProperty';
import { PartnerListItemCard } from '~/components/PartnerListItemCard';
import { EditUser } from '../../../Edit';
import { UserProfileFragment } from './UserDetailProfile.graphql';

interface UserDetailProfileProps {
  user: UserProfileFragment;
}

export const UserDetailProfile = ({ user }: UserDetailProfileProps) => {
  const [editUserState, editUser] = useDialog();

  const canEditAnyFields = canEditAny(user);

  return (
    <Box
      component={Paper}
      sx={(theme) => ({
        display: 'flex',
        justifyContent: 'space-between',
        width: theme.breakpoints.values.md,
      })}
    >
      <Stack
        sx={{
          p: 2,
          gap: 2,
        }}
      >
        <DisplayProperty
          label="Email"
          value={user.email.value}
          loading={!user}
        />
        <DisplayProperty
          label="Title"
          value={user.title.value}
          loading={!user}
        />
        <DisplayProperty
          label="Roles"
          value={labelsFrom(RoleLabels)(user.roles.value)}
          loading={!user}
        />
        <DisplayProperty
          label="Local Time"
          value={
            user.timezone.value?.name ? (
              <LocalTime timezone={user.timezone.value.name} />
            ) : null
          }
          loading={!user}
        />
        <DisplayProperty
          label="Phone"
          value={user.phone.value}
          loading={!user}
        />
        <DisplayProperty
          label="About"
          value={user.about.value}
          loading={!user}
        />

        {!!user.partners.items.length && (
          <>
            <Typography variant="h3">Partners</Typography>
            <Box sx={{ mt: 1 }}>
              {user.partners.items.map((item) => (
                <Box key={item.id} sx={{ mb: 2 }}>
                  <PartnerListItemCard partner={item} />
                </Box>
              ))}
            </Box>
          </>
        )}
      </Stack>
      <Box sx={{ p: 1 }}>
        {canEditAnyFields ? (
          <Tooltip title="Edit Person">
            <IconButton aria-label="edit person" onClick={editUser}>
              <Edit />
            </IconButton>
          </Tooltip>
        ) : null}
      </Box>
      <EditUser user={user} {...editUserState} />
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
