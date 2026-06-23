import { Divider, Stack, Typography } from '@mui/material';
import { extendSx, StyleProps } from '~/common';
import { ProgressButton } from '~/components/ProgressButton';
import { Notification } from './Notification';
import { UseNotifications } from './useNotifications';
import { BaseView } from './Views/Base';

export interface NotificationListProps extends StyleProps {
  notifications: UseNotifications;
}

/** The notification rows (skeletons, items, empty state, load more). */
export const NotificationList = ({
  notifications,
  sx,
}: NotificationListProps) => {
  const { data, loading, loadMore, onReadToggle } = notifications;
  return (
    <Stack
      divider={<Divider />}
      sx={[{ p: 1, pt: 0.5, gap: 0.5 }, ...extendSx(sx)]}
    >
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
  );
};
