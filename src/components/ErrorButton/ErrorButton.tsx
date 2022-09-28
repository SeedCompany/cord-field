import { Button, ButtonProps } from '@mui/material';
import { alpha as fade } from '@mui/material/styles';
import { Except } from 'type-fest';

export type ErrorButtonProps = Except<ButtonProps, 'color'>;

export const ErrorButton = ({ ...rest }: ErrorButtonProps) => {
  return (
    <Button
      {...rest}
      sx={(theme) => ({
        '&.MuiButton-text': {
          color: theme.palette.error.main,
          '&:hover': {
            backgroundColor: fade(
              theme.palette.error.main,
              theme.palette.action.hoverOpacity
            ),
          },
        },
        '&.MuiButton-contained': {
          color: theme.palette.error.contrastText,
          backgroundColor: theme.palette.error.main,
          '&:hover': {
            backgroundColor: theme.palette.error.dark,
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
              backgroundColor: theme.palette.error.main,
            },
          },
        },
      })}
    />
  );
};
