import {
  fade,
  makeStyles,
  IconButton as MUIIconButton,
  IconButtonProps as MUIIconButtonProps,
} from '@material-ui/core';
// eslint-disable-next-line no-restricted-imports
import { Palette, PaletteColor } from '@material-ui/core/styles/createPalette';
import { Skeleton } from '@material-ui/lab';
// eslint-disable-next-line no-restricted-imports
import { CSSProperties } from '@material-ui/styles';
import clsx from 'clsx';
import * as React from 'react';
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
      <Skeleton variant="circle" className={props.className}>
        {fab}
      </Skeleton>
    ) : (
      fab
    );
  }
);
