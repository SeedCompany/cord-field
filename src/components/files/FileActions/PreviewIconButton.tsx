import { Preview as PreviewIcon } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { NonDirectoryActionItem as File, useFileActions } from '../FileActions';

export const PreviewIconButton = ({ file }: { file: File }) => {
  const { openFilePreview } = useFileActions();
  return (
    <Tooltip title="Preview">
      <IconButton onClick={() => openFilePreview(file)} size="small">
        <PreviewIcon />
      </IconButton>
    </Tooltip>
  );
};
