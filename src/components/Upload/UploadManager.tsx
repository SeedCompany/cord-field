import {
  Close as CloseIcon,
  Maximize as MaximizeIcon,
  Minimize as MinimizeIcon,
} from '@mui/icons-material';
import {
  Dialog,
  DialogContent,
  IconButton,
  DialogTitle as MuiDialogTitle,
  Typography,
} from '@mui/material';
import { memo, ReactNode, useState } from 'react';
import { useMountedState } from 'react-use';
import { makeStyles } from 'tss-react/mui';
import { ChildrenProp } from '~/common';
import { useSession } from '../Session';
import { DraggablePaper } from './DraggablePaper';

const PAPER_WIDTH = 360;

const useStyles = makeStyles<void, 'collapsed'>()(
  ({ spacing }, _props, classes) => ({
    root: {
      pointerEvents: 'none',
    },
    paper: {
      margin: 0,
      pointerEvents: 'auto',
      position: 'absolute',
      top: 0,
      left: 0,
      width: PAPER_WIDTH,
    },
    titleContainer: {
      cursor: 'move',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing(1),
      [`&.${classes.collapsed}`]: {
        cursor: 'default',
      },
    },
    title: {
      cursor: 'move',
      paddingLeft: spacing(1),
      [`&.${classes.collapsed}`]: {
        cursor: 'default',
      },
    },
    titleButtons: {
      marginLeft: 'auto',
    },
    titleButton: {},
    contentContainer: {
      padding: spacing(1),
      [`&.${classes.collapsed}`]: {
        display: 'none',
      },
    },
    collapsed: {}, // here to pacify TypeScript
  })
);

interface DialogTitleProps extends ChildrenProp {
  id: string;
  isCollapsed: boolean;
  onClose: () => void;
  onCollapseClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const UploadManagerDialogTitle = (props: DialogTitleProps) => {
  const { children, id, isCollapsed, onClose, onCollapseClick } = props;
  const { classes, cx } = useStyles();
  const IconComponent = isCollapsed ? MaximizeIcon : MinimizeIcon;
  return (
    <MuiDialogTitle
      id={id}
      className={cx(classes.titleContainer, isCollapsed && classes.collapsed)}
    >
      <Typography
        variant="body1"
        component="h6"
        className={cx(classes.title, isCollapsed && classes.collapsed)}
      >
        {children}
      </Typography>
      <div className={classes.titleButtons}>
        <IconButton
          aria-label="minimize"
          className={classes.titleButton}
          id="upload-manager-collapse-button"
          onClick={onCollapseClick}
          size="small"
        >
          <IconComponent fontSize="small" />
        </IconButton>
        <IconButton
          aria-label="close"
          className={classes.titleButton}
          id="upload-manager-close-button"
          onClick={onClose}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
    </MuiDialogTitle>
  );
};

interface UploadManagerProps {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
}

const UploadManagerImpl = (props: UploadManagerProps) => {
  const { children, open, onClose } = props;
  const { session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { classes, cx } = useStyles();
  const isMounted = useMountedState();

  function handleCollapse(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (isMounted()) {
      setIsCollapsed((isCollapsed) => !isCollapsed);
    }
  }

  return (
    <Dialog
      classes={{ root: classes.root, paper: classes.paper }}
      disableEnforceFocus
      disableAutoFocus
      hideBackdrop
      open={!!session && open}
      PaperComponent={(props) => (
        <DraggablePaper {...props} isCollapsed={isCollapsed} />
      )}
      aria-labelledby="draggable-dialog-title"
    >
      <UploadManagerDialogTitle
        id="draggable-dialog-title"
        isCollapsed={isCollapsed}
        onClose={onClose}
        onCollapseClick={handleCollapse}
      >
        Upload Manager
      </UploadManagerDialogTitle>
      <DialogContent
        className={cx(
          classes.contentContainer,
          isCollapsed && classes.collapsed
        )}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

UploadManagerImpl.displayName = 'UploadManager';
export const UploadManager = memo(UploadManagerImpl);
