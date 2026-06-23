import { NotificationsNone } from '@mui/icons-material';
import {
  Badge,
  Box,
  Divider,
  IconButton,
  Popover,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { VisibilityAndClickTracker } from '~/components/Feature';
import { NotificationList } from './NotificationList';
import { useNotifications } from './useNotifications';

export const Notifications = () => {
  const { spacing } = useTheme();
  const notifications = useNotifications();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!notifications.enabled) {
    return null;
  }

  return (
    <>
      <VisibilityAndClickTracker flag="notifications" trackInteraction>
        <IconButton
          aria-label="notifications"
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <Badge color="primary" badgeContent={notifications.totalUnread}>
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
          <Divider sx={{ mx: 1 }} />
        </Box>
        <NotificationList notifications={notifications} />
      </Popover>
    </>
  );
};
