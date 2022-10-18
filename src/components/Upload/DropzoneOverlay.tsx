import { Box, Typography, TypographyProps } from '@mui/material';
import { extendSx, StyleProps } from '~/common';

/**
 * This component requires a parent with a `position` value,
 * since it uses `position: absolute`.
 */

interface DropzoneOverlayProps extends StyleProps {
  isDragActive: boolean;
  message?: string;
  TypographyProps?: TypographyProps;
}

export const DropzoneOverlay = (props: DropzoneOverlayProps) => {
  const {
    isDragActive,
    message = 'Drop files to start uploading',
    TypographyProps,
    sx,
  } = props;
  return !isDragActive ? null : (
    <Box
      sx={[
        (theme) => ({
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
        }),
        ...extendSx(sx),
      ]}
    >
      <Typography
        variant="h1"
        {...TypographyProps}
        sx={[
          (theme) => ({
            color: theme.palette.grey['300'],
            textAlign: 'center',
          }),
          ...extendSx(TypographyProps?.sx),
        ]}
      >
        {message}
      </Typography>
    </Box>
  );
};
