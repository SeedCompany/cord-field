import { CheckCircleOutlined, Circle } from '@mui/icons-material';
import {
  Box,
  IconButton,
  IconButtonProps,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { RelativeDateTime } from '../Formatters';
import { NotificationFragment } from './notification.graphql';

interface NotificationProp {
  notification: NotificationFragment;
}

interface NotificationProps extends NotificationProp {
  onReadToggle?: () => void;
}

export const Notification = ({
  notification,
  onReadToggle,
}: NotificationProps) => (
  <Box sx={(theme) => ({ position: 'relative', '--p': theme.spacing(1) })}>
    <DisplayNotification notification={notification} />
    <Box
      sx={{
        position: 'absolute',
        inset: '50% var(--p) 50% auto',
        display: 'grid',
        placeContent: 'center',
      }}
    >
      <ReadIndicator notification={notification} onClick={onReadToggle} />
    </Box>
  </Box>
);

const DisplayNotification = ({ notification }: NotificationProp) => {
  const { unread } = notification;

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
        p: 'var(--p)',
      }}
    >
      <Stack sx={{ alignItems: 'flex-start', gap: 1 }}>
        <Typography variant="body2">
          {notification.__typename === 'SimpleTextNotification' &&
            notification.content}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          <RelativeDateTime date={notification.createdAt} />
        </Typography>
      </Stack>
      {/* Just to reserve layout */}
      <ReadIndicator disabled sx={{ visibility: 'hidden' }} />
    </Box>
  );
};

const ReadIndicator = ({
  notification,
  ...rest
}: Partial<NotificationProp> & IconButtonProps) => {
  const unread = notification?.unread;
  const Icon = unread ? Circle : CheckCircleOutlined;

  const button = (
    <IconButton size="small" color="primary" {...rest}>
      <Icon fontSize="inherit" />
    </IconButton>
  );
  if (!notification) {
    return button;
  }
  return (
    <Tooltip title={unread ? 'Mark as read' : 'Mark as unread'}>
      {button}
    </Tooltip>
  );
};
