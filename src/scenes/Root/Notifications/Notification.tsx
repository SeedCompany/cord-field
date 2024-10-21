import { Box } from '@mui/material';
import { NotificationViewer } from './NotificationViewer';
import { ReadIndicator } from './ReadIndicator';
import { NotificationProp, views } from './Views';

interface NotificationProps extends NotificationProp {
  onReadToggle?: () => void;
}

export const Notification = ({
  notification,
  onReadToggle,
}: NotificationProps) => (
  <Box sx={(theme) => ({ position: 'relative', '--p': theme.spacing(1) })}>
    <NotificationViewer views={views} notification={notification} />
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
