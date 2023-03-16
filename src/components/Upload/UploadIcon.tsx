import { css, keyframes } from '@emotion/react';
import { Cancel, CloudUpload } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';
import { forwardRef } from 'react';

interface UploadIconProps extends SvgIconProps {
  variant?: 'accept' | 'reject';
  disableAnimation?: boolean;
}

export const UploadIcon = forwardRef<SVGSVGElement, UploadIconProps>(
  function UploadIcon({ variant = 'accept', disableAnimation, ...rest }, ref) {
    const isAccept = variant === 'accept';
    const Icon = isAccept ? CloudUpload : Cancel;
    return (
      <Icon
        fontSize="large"
        color={isAccept ? 'action' : 'error'}
        css={[icon, isAccept && !disableAnimation && animateUpAndDown]}
        {...rest}
        ref={ref}
      />
    );
  }
);

const icon = css({
  margin: '4px 0 8px',
});

const upAndDown = keyframes`
  0%, 100% { transform: translateY(-4px); }
  50% { transform: translateY(4px); }
`;

const animateUpAndDown = css({
  animation: `${upAndDown} 1s ease infinite`,
});
