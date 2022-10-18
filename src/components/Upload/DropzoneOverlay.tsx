import { Box, Typography } from '@mui/material';

/**
 * This component requires a parent with a `position` value,
 * since it uses `position: absolute`.
 */

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
  const {
    classes: classNames,
    isDragActive,
    message = 'Drop files to start uploading',
  } = props;
  return !isDragActive ? null : (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.grey['600'],
        border: `4px dashed ${theme.palette.grey['300']}`,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.8,
        padding: 3,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 100,
      })}
      className={classNames?.root && classNames.root}
    >
      <Typography
        variant="h1"
        className={classNames?.text && classNames.text}
        sx={(theme) => ({
          color: theme.palette.grey['300'],
          textAlign: 'center',
        })}
      >
        {message}
      </Typography>
    </Box>
  );
};
