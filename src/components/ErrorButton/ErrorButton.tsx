import { Button, ButtonProps, makeStyles } from '@mui/material';
import { alpha as fade } from '@mui/material/styles';
import clsx from 'clsx';
import { Except } from 'type-fest';

const useStyles = makeStyles(({ palette }) => ({
  text: {
    color: palette.error.main,
    '&:hover': {
      backgroundColor: fade(palette.error.main, palette.action.hoverOpacity),
    },
  },
  contained: {
    color: palette.error.contrastText,
    backgroundColor: palette.error.main,
    '&:hover': {
      backgroundColor: palette.error.dark,
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: palette.error.main,
      },
    },
  },
}));

export type ErrorButtonProps = Except<ButtonProps, 'color'>;

export const ErrorButton = ({
  classes: classesProp = {},
  ...rest
}: ErrorButtonProps) => {
  const classes = useStyles();
  return (
    <Button
      {...rest}
      classes={{
        ...classes,
        text: clsx(classes.text, classesProp.text),
        contained: clsx(classes.contained, classesProp.contained),
      }}
    />
  );
};
