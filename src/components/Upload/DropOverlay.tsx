import { css } from '@emotion/react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ComponentProps } from 'react';
import { UploadIcon } from './UploadIcon';

interface DropOverlayProps extends ComponentProps<typeof DropOverlayRoot> {
  isDragActive: boolean;
  isDragReject?: boolean;
  disableIcon?: boolean;
}

/**
 * This component requires a parent with a `position` value,
 * since it uses `position: absolute`.
 */
export const DropOverlay = ({
  isDragActive,
  isDragReject,
  disableIcon,
  children,
  ...rest
}: DropOverlayProps) => (
  <DropOverlayRoot css={isDragActive && show} {...rest}>
    {!disableIcon && (
      <UploadIcon variant={isDragReject ? 'reject' : 'accept'} />
    )}
    {typeof children === 'string' ? (
      <Typography variant="h4">{children}</Typography>
    ) : (
      children
    )}
  </DropOverlayRoot>
);

const DropOverlayRoot = styled('div')(({ theme }) => ({
  position: 'absolute',
  inset: 2,
  zIndex: 100,
  borderRadius: theme.shape.borderRadius,
  border: `4px dashed ${theme.palette.action.hover}`,
  background: theme.palette.background.paper,
  opacity: 0,
  transition: theme.transitions.create('all'),
  pointerEvents: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center', // opinionated, but matches flex centering above...
}));

const show = css({ opacity: 1 });
