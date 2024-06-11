import { Notifications as NotificationIcon } from '@mui/icons-material';
import {
  ListItemText,
  MenuItem,
  MenuList,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { forwardRef, ReactElement } from 'react';
import { PaperTooltip } from '../../../../components/PaperTooltip';
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
        <NotifiersInfo transition={transition} />
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
