import { useMutation } from '@apollo/client';
import { CheckCircleOutlined, Circle } from '@mui/icons-material';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { RelativeDateTime } from '../Formatters';
import { NotificationFragment } from './notification.graphql';
import { ReadNotificationDocument } from './ReadNotification.graphql';

interface NotificationProps {
  notification: NotificationFragment;
}

export function Notification({ notification }: NotificationProps) {
  const [markAsRead] = useMutation(ReadNotificationDocument);
  const { id, unread, createdAt } = notification;

  return (
    <Box
      sx={{
        backgroundColor: unread ? 'grey.200' : 'inherit',
        '&:hover': { backgroundColor: 'grey.300' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 1,
        gap: 1,
        p: 1,
      }}
    >
      <Stack sx={{ alignItems: 'flex-start', gap: 1 }}>
        <Typography variant="body2">
          {notification.__typename === 'SimpleTextNotification' &&
            notification.content}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          <RelativeDateTime date={createdAt} />
        </Typography>
      </Stack>
      <Tooltip title={unread ? 'Mark as read' : 'Mark as unread'}>
        <IconButton
          sx={{ cursor: 'pointer', p: 0.5 }}
          color="primary"
          onClick={() => {
            void markAsRead({ variables: { id, unread: !unread } });
          }}
        >
          <Box
            sx={{ height: 20, width: 20 }}
            component={unread ? Circle : CheckCircleOutlined}
          />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
