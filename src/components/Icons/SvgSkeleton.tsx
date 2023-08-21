import { Skeleton, SvgIconProps } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { forwardRef } from 'react';

/**
 * Add skeleton effect to SVG icons.
 * @example
 * <SvgIcon component={SvgSkeleton} />
 */
export const SvgSkeleton = forwardRef<SVGSVGElement, SvgIconProps>(
  function SvgSkeleton(props, ref) {
    const theme = useTheme();
    return (
      <Skeleton
        component="svg"
        variant="circular"
        {...props}
        ref={ref}
        sx={{
          borderRadius: 'initial',
          // Move background color to foreground color
          backgroundColor: 'transparent',
          color: alpha(
            theme.palette.text.primary,
            theme.palette.mode === 'light' ? 0.11 : 0.13
          ),
          '&>*': { visibility: 'initial' },
        }}
      />
    );
  }
);
