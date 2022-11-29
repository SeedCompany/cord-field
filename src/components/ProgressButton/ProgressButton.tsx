import {
  Button,
  ButtonProps,
  CircularProgress,
  CircularProgressProps,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { forwardRef } from 'react';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()({
  // This is to center spinner within button, while maintaining consistent button width.
  // If we were to replace the button text, the button size could change which we want to
  // avoid because the buttons shifting around is jarring for the user. Esp since the
  // spinner is only shown for a short time.
  progressWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hidden: {
    visibility: 'hidden',
  },
});

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
  const { classes } = useStyles();
  const theme = useTheme();
  const size = theme.components?.MuiButton?.defaultProps?.size ?? rest.size;

  const inner = (
    <>
      {progress ? (
        <div className={classes.progressWrapper}>
          <CircularProgress
            size={size === 'large' ? 26 : size === 'small' ? 16 : 20}
            color={!rest.disabled ? 'inherit' : 'primary'}
            {...progressProps}
          />
        </div>
      ) : null}
      <span className={progress ? classes.hidden : undefined}>{children}</span>
    </>
  );

  return (
    <Button ref={ref} {...rest}>
      {inner}
    </Button>
  );
});
