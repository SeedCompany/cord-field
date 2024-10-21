import { NotificationsNone } from '@mui/icons-material';
import {
  Badge,
  Divider,
  IconButton,
  Popover,
  Stack,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import {
  useFeatureEnabled,
  VisibilityAndClickTracker,
} from '~/components/Feature';
import { useListQuery } from '~/components/List';
import { ProgressButton } from '~/components/ProgressButton';
import { Notification } from './Notification';
import { NotificationListDocument } from './NotificationList.graphql';

export const Notifications = () => {
  const enabled = useFeatureEnabled('notifications');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isPopoverOpen = Boolean(anchorEl);

  const { data, loadMore, loading } = useListQuery(NotificationListDocument, {
    pollInterval: 60_000,
    listAt: (data) => data.notifications,
    skip: !enabled,
  });

  const notifications = useMemo(() => (data ? data.items : []), [data]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <VisibilityAndClickTracker flag="notifications" trackInteraction>
        <IconButton
          aria-label="notification"
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <Badge color="primary" badgeContent={data?.totalUnread ?? 0}>
            <NotificationsNone />
          </Badge>
        </IconButton>
      </VisibilityAndClickTracker>

      <Popover
        open={isPopoverOpen}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        slotProps={{
          paper: {
            sx: { width: 'min(450px, 100%)', p: 1, mt: 1 },
            elevation: 4,
            square: true,
          },
        }}
      >
        <Typography variant="h6" textAlign="center">
          Notifications
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <Stack
          divider={<Divider />}
          sx={{
            height: 1,
            maxHeight: { xs: 0.9, md: 400 },
            overflowY: 'scroll',
            gap: 0.25,
          }}
        >
          {notifications.map((notification) => (
            <Notification key={notification.id} notification={notification} />
          ))}
          {data?.hasMore && (
            <ProgressButton progress={loading} onClick={() => loadMore()}>
              Load more
            </ProgressButton>
          )}
        </Stack>
      </Popover>
    </>
  );
};
