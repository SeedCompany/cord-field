import { CheckCircleOutlined, Circle } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { IconButton, IconButtonProps } from '~/components/IconButton';
import { NotificationProp } from './Views';

export const ReadIndicator = ({
  notification,
  ...rest
}: Partial<NotificationProp> & IconButtonProps) => {
  const unread = notification?.unread;
  const Icon = unread ? Circle : CheckCircleOutlined;

  const button = (
    <IconButton size="small" color={unread ? 'primary' : undefined} {...rest}>
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
