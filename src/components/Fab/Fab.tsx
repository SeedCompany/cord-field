import {
  makeStyles,
  Fab as MUIFab,
  FabProps as MUIFabProps,
  Skeleton,
} from '@mui/material';
import { CSSObject as CSSProperties, PaletteColor } from '@mui/material/styles';
import clsx from 'clsx';
import { forwardRef } from 'react';
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
  loading?: boolean;
};

export const Fab = forwardRef<HTMLButtonElement, FabProps>(function Fab(
  { color, loading, ...props },
  ref
) {
  const classes = useStyles();
  const fab = (
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
  return loading ? <Skeleton variant="circle">{fab}</Skeleton> : fab;
});
