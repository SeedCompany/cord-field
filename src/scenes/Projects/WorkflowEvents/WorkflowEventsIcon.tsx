import { History as HistoryIcon } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { IconButton, IconButtonProps } from '~/components/IconButton';

export const WorkflowEventsIcon = (props: IconButtonProps) => (
  <Tooltip title="View Status History Log">
    <IconButton {...props}>
      <HistoryIcon />
    </IconButton>
  </Tooltip>
);
