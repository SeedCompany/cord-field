import { Close } from '@mui/icons-material';
import { Box, Divider, Drawer, DrawerProps, Typography } from '@mui/material';
import { IconButton } from '~/components/IconButton';
import { WorkflowEvents } from '~/components/WorkflowEvents/WorkflowEvents';
import { ProjectWorkflowEventFragment as WorkflowEvent } from './WorkflowEvent.graphql';

type StatusHistoryDrawerProps = DrawerProps & {
  workflowEvents: readonly WorkflowEvent[];
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const StatusHistoryDrawer = ({
  workflowEvents,
  open,
  setOpen,
}: StatusHistoryDrawerProps) => {
  return (
    <Drawer
      open={open}
      variant="temporary"
      anchor="right"
      onClose={() => setOpen(false)}
      PaperProps={{
        elevation: 4,
        sx: { p: 2, left: { md: 248, sm: 'unset', lg: 'unset' } },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography component="h3" variant="h3">
          Status History Log
        </Typography>
        <IconButton onClick={() => setOpen(!open)}>
          <Close />
        </IconButton>
      </Box>
      <Divider sx={{ pt: 1 }} />
      <WorkflowEvents events={workflowEvents} />
    </Drawer>
  );
};
