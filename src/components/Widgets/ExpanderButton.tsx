import { CloseFullscreen, OpenInFull } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { Link, LinkProps } from '../Routing';

export const ExpanderButton = ({
  expanded,
  to,
}: {
  expanded: boolean;
  to: LinkProps['to'];
}) => (
  <Tooltip title={expanded ? 'Collapse Widget' : 'Expand Widget'}>
    <IconButton color="primary" component={Link} to={to}>
      {expanded ? <CloseFullscreen /> : <OpenInFull />}
    </IconButton>
  </Tooltip>
);
