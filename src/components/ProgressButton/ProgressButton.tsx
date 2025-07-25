import {
  Button,
  ButtonProps,
  CircularProgress,
  CircularProgressProps,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { forwardRef } from 'react';

export interface ProgressButtonProps extends ButtonProps {
  /** Show progress? */
  progress?: boolean;
  progressProps?: CircularProgressProps;
}

/**
 * A Button with a progress spinner conditionally inside of it.
 * This handles the styles for keeping the button a consistent size
 * while hiding the text and showing a progress spinner.
 */
export const ProgressButton = forwardRef<
  HTMLButtonElement,
  ProgressButtonProps
>(function ProgressButton(
  { progress = false, progressProps, children, ...rest },
  ref
) {
  const theme = useTheme();
  const size = theme.components?.MuiButton?.defaultProps?.size ?? rest.size;

  const inner = (
    <>
      {progress ? (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress
            size={size === 'large' ? 26 : size === 'small' ? 16 : 20}
            color={!rest.disabled ? 'inherit' : 'primary'}
            {...progressProps}
          />
        </div>
      ) : null}
      <span style={{ visibility: progress ? 'hidden' : undefined }}>
        {children}
      </span>
    </>
  );

  return (
    <Button ref={ref} {...rest}>
      {inner}
    </Button>
  );
});
