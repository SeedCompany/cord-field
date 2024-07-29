import { ChevronRight, Close } from '@mui/icons-material';
import {
  Box,
  Divider,
  Drawer,
  DrawerProps,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { ProjectStepLabels, ProjectStepList } from '~/api/schema/enumLists';
import { FormattedDateTime } from '~/components/Formatters';
import { IconButton } from '~/components/IconButton';
import { ProjectStatusChip } from './ProjectStatusChip';
import {
  BasicUserFragment,
  StatusWorkflowEventFragment as WorkflowEvent,
} from './StatusWorkflowEvent.graphql';

type StatusHistoryDrawerProps = DrawerProps & {
  workflowEvents: readonly WorkflowEvent[];
  open: boolean;
  setOpen: (open: boolean) => void;
};

function isUser(who: any): who is BasicUserFragment {
  return 'fullName' in who;
}

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
      sx={{
        overflowY: 'auto',
        display: 'flex',
        width: 'clamp(50dvw, 400px, 100dvw)',
        flexShrink: 0,
      }}
      PaperProps={{
        sx: {
          width: 'min(800px, 100dvw)',
          top: 65,
          height: 'calc(100vh - 65px)',
          p: 2,
        },
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
      <List>
        {workflowEvents.map((event: WorkflowEvent, index, array) => {
          const prev = index > 1 ? array[index - 1] : null;
          const prevStatus = prev ? prev.to : ProjectStepList[0]!;

          return (
            <ListItem key={event.id} sx={{ gap: 2, width: 1, py: 0.5 }}>
              <Stack width={1}>
                <Stack direction="row" width={1} gap={2}>
                  <div>
                    <ListItemText>
                      {event.who.value &&
                        (isUser(event.who.value)
                          ? event.who.value.fullName
                          : event.who.value.name)}
                    </ListItemText>
                    <Typography variant="subtitle2" noWrap>
                      <FormattedDateTime date={event.at} />
                    </Typography>
                  </div>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-around"
                    width={1}
                  >
                    <ProjectStatusChip status={ProjectStepLabels[prevStatus]} />
                    <ChevronRight sx={{ flexGrow: 0 }} />
                    <ProjectStatusChip status={ProjectStepLabels[event.to]} />
                  </Box>
                </Stack>
                <Divider />
              </Stack>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};
