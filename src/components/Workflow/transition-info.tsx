import {
  Check as CheckIcon,
  Circle as CircleIcon,
  Notifications as NotificationIcon,
  Security as SecurityIcon,
  Close as XIcon,
} from '@mui/icons-material';
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { forwardRef, ReactElement } from 'react';
import { RoleLabels } from '~/api/schema/enumLists';
import { PaperTooltip } from '../PaperTooltip';
import { WorkflowTransitionFragment as Transition } from './workflow.graphql';

import 'reactflow/dist/style.css';

interface TransitionProp {
  transition: Transition;
}

export const TransitionNodeExtra = ({
  transition,
  children,
}: TransitionProp & {
  children: ReactElement;
}) => (
  <Tooltip
    slots={{
      tooltip: TransitionNodeExtraMenu,
    }}
    title={' '}
    slotProps={{
      tooltip: { transition } as any,
      popper: {
        modifiers: [
          {
            name: 'offset',
            options: { offset: [0, 8] },
          },
        ],
      },
    }}
    placement="bottom-start"
    leaveDelay={400}
  >
    {children}
  </Tooltip>
);

const TransitionNodeExtraMenu = forwardRef<any, any>(
  function TransitionNodeExtraMenu({ ownerState, transition, ...props }, ref) {
    return (
      <Stack direction="row" gap={1} {...props} ref={ref}>
        {transition.notifiers.length > 0 && (
          <NotifiersInfo transition={transition} />
        )}
        <PermissionInfo transition={transition} />
      </Stack>
    );
  }
);

const NotifiersInfo = ({ transition }: TransitionProp) => (
  <PaperTooltip
    title={<NotifierList transition={transition} />}
    sx={{
      '& .MuiTooltip-tooltip': {
        padding: 0,
      },
    }}
  >
    <NotificationIcon color="action" />
  </PaperTooltip>
);

const NotifierList = ({ transition }: TransitionProp) => (
  <>
    <Typography variant="h4" sx={{ pt: 1, px: 1 }}>
      Notifiers
    </Typography>
    <MenuList dense>
      {transition.notifiers.map((notifier) => (
        <MenuItem key={notifier.label}>
          <ListItemText>{notifier.label}</ListItemText>
        </MenuItem>
      ))}
    </MenuList>
  </>
);

const PermissionInfo = ({ transition }: TransitionProp) => (
  <PaperTooltip
    title={<PermissionPopup transition={transition} />}
    sx={{
      '& .MuiTooltip-tooltip': {
        padding: 0,
      },
    }}
  >
    <SecurityIcon color="action" />
  </PaperTooltip>
);

const PermissionPopup = ({ transition }: TransitionProp) => (
  <>
    <Typography variant="h4" sx={{ pt: 1, px: 1 }}>
      Permissions
    </Typography>
    <MenuList dense>
      {transition.permissions
        .filter((p) => p.execute != null)
        .map((p) => (
          <MenuItem key={p.role}>
            <ListItemIcon>
              {!p.execute ? (
                <XIcon color="error" fontSize="small" />
              ) : p.condition ? (
                <CircleIcon color="warning" fontSize="small" />
              ) : (
                <CheckIcon color="primary" fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={RoleLabels[p.role]}
              secondary={p.condition}
            />
          </MenuItem>
        ))}
    </MenuList>
  </>
);
