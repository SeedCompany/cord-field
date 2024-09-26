import { History as HistoryIcon } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { IconButton, IconButtonProps } from '~/components/IconButton';
import { Feature } from '../../../components/Feature';

export const WorkflowEventsIcon = (props: IconButtonProps) => (
  <Feature flag="project-workflow-history" match={true}>
    <Tooltip title="View Status History Log">
      <IconButton {...props}>
        <HistoryIcon />
      </IconButton>
    </Tooltip>
  </Feature>
);
