import { Paper } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import {
  FileNodeInfoFragment,
  getDirectoryComponents,
  getFileComponents,
} from '../../../components/files';
import { parseFileNameAndExtension } from '../../../components/Formatters';
import { isDirectory } from './util';

const useStyles = makeStyles()(({ palette, spacing }) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: spacing(1),
  },
  fileIcon: {
    color: palette.action.active,
    marginRight: spacing(0.5),
  },
}));

export const NodeDragPreview = ({ node }: { node: FileNodeInfoFragment }) => {
  const { classes } = useStyles();

  const { Icon } = isDirectory(node)
    ? getDirectoryComponents()
    : getFileComponents(node.mimeType);
  return (
    <Paper elevation={12} className={classes.root}>
      <Icon className={classes.fileIcon} />
      {parseFileNameAndExtension(node.name).displayName}
    </Paper>
  );
};
