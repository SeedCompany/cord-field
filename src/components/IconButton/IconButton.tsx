import {
  makeStyles,
  IconButton as MUIIconButton,
  IconButtonProps as MUIIconButtonProps,
  Skeleton,
} from '@mui/material';
import {
  alpha as fade,
  CSSObject as CSSProperties,
  Palette,
  PaletteColor,
} from '@mui/material/styles';
import clsx from 'clsx';
import { forwardRef } from 'react';
import { Except } from 'type-fest';

const colorStyle = (color: PaletteColor, palette: Palette): CSSProperties => ({
  color: color.main,
  // backgroundColor: color.main,
  '&:hover': {
    backgroundColor: fade(color.main, palette.action.hoverOpacity),
    // Reset on touch devices, it doesn't add specificity
    '@media (hover: none)': {
      backgroundColor: 'transparent',
    },
  },
});

const useStyles = makeStyles(({ palette }) => ({
  error: colorStyle(palette.error, palette),
}));

export type IconButtonProps = Except<MUIIconButtonProps, 'color'> & {
  color?: MUIIconButtonProps['color'] | 'error';
  loading?: boolean;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ color, loading, ...props }, ref) {
    const classes = useStyles();
    const fab = (
      <MUIIconButton
        ref={ref}
        {...props}
        color={color !== 'error' ? color : undefined}
        className={clsx(
          color === 'error' ? classes.error : undefined,
          !loading ? props.className : undefined
        )}
      />
    );
    return loading ? (
      <Skeleton variant="circular" className={props.className}>
        {fab}
      </Skeleton>
    ) : (
      fab
    );
  }
);
