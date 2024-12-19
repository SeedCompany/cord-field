import { Refresh as Icon } from '@mui/icons-material';
import { IconButton, IconButtonProps, Tooltip } from '@mui/material';

export const PnPReextractIconButton = (props: IconButtonProps) => (
  <Tooltip title="Re-extract the progress sheet from PnP file">
    <IconButton {...props}>
      <Icon />
    </IconButton>
  </Tooltip>
);
