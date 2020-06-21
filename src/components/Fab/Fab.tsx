import {
  makeStyles,
  Fab as MUIFab,
  FabProps as MUIFabProps,
} from '@material-ui/core';
// eslint-disable-next-line no-restricted-imports
import { PaletteColor } from '@material-ui/core/styles/createPalette';
// eslint-disable-next-line no-restricted-imports
import { CSSProperties } from '@material-ui/styles';
import clsx from 'clsx';
import { forwardRef } from 'react';
import * as React from 'react';
import { Except } from 'type-fest';

const colorStyle = (color: PaletteColor): CSSProperties => ({
  color: color.contrastText,
  backgroundColor: color.main,
  '&:hover': {
    backgroundColor: color.dark,
    // Reset on touch devices, it doesn't add specificity
    '@media (hover: none)': {
      backgroundColor: color.main,
    },
  },
});

const useStyles = makeStyles(({ palette }) => ({
  error: colorStyle(palette.error),
}));

export type FabProps = Except<MUIFabProps, 'color'> & {
  color?: MUIFabProps['color'] | 'error';
};

export const Fab = forwardRef<HTMLButtonElement, FabProps>(function Fab(
  { color, ...props },
  ref
) {
  const classes = useStyles();
  return (
    <MUIFab
      ref={ref}
      {...props}
      color={color !== 'error' ? color : undefined}
      className={clsx(
        color === 'error' ? classes.error : undefined,
        props.className
      )}
    />
  );
});
