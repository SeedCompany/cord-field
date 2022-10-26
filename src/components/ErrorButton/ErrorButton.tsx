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
          color: 'error.main',
          '&:hover': {
            bgcolor: fade(
              theme.palette.error.main,
              theme.palette.action.hoverOpacity
            ),
          },
        },
        '&.MuiButton-contained': {
          color: 'error.contrastText',
          bgcolor: 'error.main',
          '&:hover': {
            bgcolor: 'error.dark',
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
              bgcolor: 'error.main',
            },
          },
        },
      })}
    />
  );
};
