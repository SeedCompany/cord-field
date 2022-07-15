import { Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

/**
 * This component requires a parent with a `position` value,
 * since it uses `position: absolute`.
 */

const useStyles = makeStyles()(({ palette, spacing }) => ({
  dropContainer: {
    backgroundColor: palette.grey['600'],
    border: `4px dashed ${palette.grey['300']}`,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
    padding: spacing(3),
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 100,
  },
  instructions: {
    color: palette.grey['300'],
    textAlign: 'center',
  },
}));

export interface DropzoneOverlayClasses {
  root?: string;
  text?: string;
}

interface DropzoneOverlayProps {
  classes?: DropzoneOverlayClasses;
  isDragActive: boolean;
  message?: string;
}

export const DropzoneOverlay = (props: DropzoneOverlayProps) => {
  const { classes, cx } = useStyles();
  const {
    classes: classNames,
    isDragActive,
    message = 'Drop files to start uploading',
  } = props;
  return !isDragActive ? null : (
    <div
      className={cx(classes.dropContainer, classNames?.root && classNames.root)}
    >
      <Typography
        variant="h1"
        className={cx(
          classes.instructions,
          classNames?.text && classNames.text
        )}
      >
        {message}
      </Typography>
    </div>
  );
};
