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
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(1),
      })}
    >
      <Icon
        sx={(theme) => ({
          color: theme.palette.action.active,
          marginRight: theme.spacing(0.5),
        })}
      />
      {parseFileNameAndExtension(node.name).displayName}
    </Paper>
  );
};
