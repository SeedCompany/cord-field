import { Paper } from '@mui/material';
import { FileNodeInfoFragment } from '../../../components/files/files.graphql';
import { fileIcon } from '../../../components/files/fileTypes';
import { parseFileNameAndExtension } from '../../../components/Formatters';
import { isDirectory } from './util';

export const NodeDragPreview = ({ node }: { node: FileNodeInfoFragment }) => {
  const Icon = fileIcon(isDirectory(node) ? 'directory' : node.mimeType);
  return (
    <Paper
      elevation={12}
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1,
      }}
    >
      <Icon
        sx={(theme) => ({
          color: theme.palette.action.active,
          mr: 0.5,
        })}
      />
      {parseFileNameAndExtension(node.name).displayName}
    </Paper>
  );
};
