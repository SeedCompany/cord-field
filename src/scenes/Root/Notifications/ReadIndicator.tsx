import { CheckCircleOutlined, Circle } from '@mui/icons-material';
import { IconButton, IconButtonProps, Tooltip } from '@mui/material';
import { NotificationProp } from './Views';

export const ReadIndicator = ({
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
