import { useMutation, useSubscription } from '@apollo/client';
import { useFeatureEnabled } from '~/components/Feature';
import { useListQuery } from '~/components/List';
import { NotificationAddedDocument } from './NotificationAdded.graphql';
import { NotificationListDocument } from './NotificationList.graphql';
import { ReadNotificationDocument } from './ReadNotification.graphql';
import { NotificationFragment } from './Views';

/**
 * Notifications data + actions, shared by the desktop bell ({@link Notifications})
 * and the mobile profile menu. Owns the live subscription, so it should be mounted
 * once at a time per surface.
 */
export const useNotifications = () => {
  const enabled = useFeatureEnabled('notifications');

  const { data, loadMore, loading } = useListQuery(NotificationListDocument, {
    listAt: (data) => data.notifications,
    skip: !enabled,
  });

  useSubscription(NotificationAddedDocument, {
    skip: !enabled,
    onData: ({ data, client }) => {
      const added = data.data?.notificationAdded;
      if (!added) {
        return;
      }
      client.cache.updateQuery({ query: NotificationListDocument }, (prev) => {
        if (!prev) {
          return;
        }
        // Idempotent: ignore a notification we've already inserted (a duplicate
        // subscription event, or a second mounted surface) so counts don't double.
        if (
          prev.notifications.items.some((n) => n.id === added.notification.id)
        ) {
          return prev;
        }
        return {
          notifications: {
            ...prev.notifications,
            total: prev.notifications.total + 1,
            totalUnread: prev.notifications.totalUnread + 1,
            items: [added.notification, ...prev.notifications.items],
          },
        };
      });
    },
  });

  const [markAsRead] = useMutation(ReadNotificationDocument, {
    update: (cache, { data: updated }) => {
      cache.updateQuery({ query: NotificationListDocument }, (prev) => ({
        notifications: {
          ...prev!.notifications,
          totalUnread:
            prev!.notifications.totalUnread +
            (updated!.readNotification.unread ? 1 : -1),
        },
      }));
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

  return {
    enabled,
    data,
    loading,
    loadMore,
    onReadToggle,
    totalUnread: data?.totalUnread ?? 0,
  };
};

export type UseNotifications = ReturnType<typeof useNotifications>;
