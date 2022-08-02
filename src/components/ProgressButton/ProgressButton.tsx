import {
  Button,
  ButtonProps,
  CircularProgress,
  CircularProgressProps,
  makeStyles,
  PropTypes,
  useTheme,
} from '@material-ui/core';
import { ErrorButton } from '../ErrorButton';

const useStyles = makeStyles({
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

export interface ProgressButtonProps extends Omit<ButtonProps, 'color'> {
  /** Show progress? */
  progress?: boolean;
  progressProps?: CircularProgressProps;
  color?: PropTypes.Color | 'error';
}

/**
 * A Button with a progress spinner conditionally inside of it.
 * This handles the styles for keeping the button a consistent size
 * while hiding the text and showing a progress spinner.
 */
export const ProgressButton = ({
  progress = false,
  progressProps,
  children,
  color,
  ...rest
}: ProgressButtonProps) => {
  const { progressWrapper, hidden } = useStyles();
  const theme = useTheme();
  const { MuiButton = {} } = theme.props || {};
  const { size = rest.size } = MuiButton;

  const inner = (
    <>
      {progress ? (
        <div className={progressWrapper}>
          <CircularProgress
            size={size === 'large' ? 26 : size === 'small' ? 16 : 20}
            color={!rest.disabled ? 'inherit' : 'primary'}
            {...progressProps}
          />
        </div>
      ) : null}
      <span className={progress ? hidden : undefined}>{children}</span>
    </>
  );

  return color === 'error' ? (
    <ErrorButton {...rest}>{inner}</ErrorButton>
  ) : (
    <Button color={color} {...rest}>
      {inner}
    </Button>
  );
};
