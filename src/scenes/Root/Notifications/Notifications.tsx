import { useMutation } from '@apollo/client';
import { NotificationsNone } from '@mui/icons-material';
import {
  Badge,
  Box,
  Divider,
  FormControlLabel,
  IconButton,
  Popover,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { uniqBy } from 'lodash';
import { useState } from 'react';
import {
  useFeatureEnabled,
  VisibilityAndClickTracker,
} from '~/components/Feature';
import { useListQuery } from '~/components/List';
import { ProgressButton } from '~/components/ProgressButton';
import { Notification } from './Notification';
import { NotificationListDocument } from './NotificationList.graphql';
import { ReadNotificationDocument } from './ReadNotification.graphql';
import { NotificationFragment } from './Views';
import { BaseView } from './Views/Base';

export const Notifications = () => {
  const enabled = useFeatureEnabled('notifications');
  const [unreadOnly, setUnreadOnly] = useState(true);

  const { spacing } = useTheme();

  const { data, loadMore, loading } = useListQuery(NotificationListDocument, {
    listAt: (data) => data.notifications,
    skip: !enabled,
    pollInterval: 60_000,
    variables: {
      input: {
        filter: {
          unread: unreadOnly ? true : undefined,
        },
      },
    },
  });
  const [markAsRead] = useMutation(ReadNotificationDocument, {
    update: (cache, { data }) => {
      const updated = data!.readNotification;
      for (const unreadOnly of [true, undefined]) {
        cache.updateQuery(
          {
            query: NotificationListDocument,
            variables: {
              input: {
                filter: {
                  unread: unreadOnly,
                },
              },
            },
          },
          (prevData) => {
            const prev = prevData!.notifications;
            // const filtered = prev.items.filter(
            //   (item) => item.id !== updated.id
            // );
            const finalItems = !unreadOnly
              ? prev.items
              : !updated.unread
              ? prev.items.filter((item) => item.id !== updated.id)
              : uniqBy([...prev.items, updated], (item) => item.id).sort(
                  (a, b) => +b.createdAt - +a.createdAt
                );
            return {
              notifications: {
                ...prevData!.notifications,
                items: finalItems,
                totalUnread: prev.totalUnread + (updated.unread ? 1 : -1),
              },
            };
          }
        );
      }
    },
  });
  const onReadToggle = (notification: NotificationFragment) => () => {
    const next = !notification.unread;
    void markAsRead({
      variables: { id: notification.id, unread: next },
      optimisticResponse: {
        readNotification: { ...notification, unread: next },
      },
    });
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <VisibilityAndClickTracker flag="notifications" trackInteraction>
        <IconButton
          aria-label="notifications"
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <Badge color="primary" badgeContent={data?.totalUnread ?? 0}>
            <NotificationsNone />
          </Badge>
        </IconButton>
      </VisibilityAndClickTracker>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{
          vertical: parseInt(spacing(-2)),
          horizontal: 'center',
        }}
        slotProps={{
          paper: {
            sx: {
              maxHeight: 400,
              width: 'min(450px, 100%)',
              mt: 1,
            },
            elevation: 4,
          },
        }}
      >
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            bgcolor: 'background.paper',
            zIndex: 1,
          }}
        >
          <Typography variant="h6" textAlign="center" py={1} lineHeight={1}>
            Notifications
          </Typography>
          <Box
            sx={{
              mx: 1,
              display: 'flex',
              justifyContent: 'end',
              width: '100%',
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={unreadOnly}
                  name="planned"
                  color="primary"
                  onChange={(_) => {
                    setUnreadOnly(!unreadOnly);
                  }}
                />
              }
              label="Unread only"
            />
          </Box>
          <Divider sx={{ mx: 1 }} />
        </Box>
        <Stack divider={<Divider />} sx={{ p: 1, pt: 0.5, gap: 0.5 }}>
          {loading && !data
            ? Array.from({ length: 5 }).map((_, i) => (
                <BaseView key={i} notification="loading" />
              ))
            : null}
          {data?.items.map((notification) => (
            <Notification
              key={notification.id}
              notification={notification}
              onReadToggle={onReadToggle(notification)}
            />
          ))}
          {data && data.items.length === 0 && (
            <Typography align="center" color="text.secondary" my={3}>
              None yet!
            </Typography>
          )}
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
