import { Grid, Typography } from '@mui/material';
import { alpha as fade } from '@mui/material/styles';
import { ReactNode } from 'react';
import { extendSx, Sx } from '~/common';

export const PropertyDiff = <T extends any>({
  previous,
  current,
  labelBy,
  sx,
  className,
}: {
  previous: T;
  current: T;
  labelBy?: (item: T) => ReactNode;
  sx?: Sx;
  className?: string;
}) => {
  return (
    <Grid
      container
      direction="column"
      alignItems="flex-start"
      className={className}
      sx={[
        (theme) => ({
          marginTop: theme.spacing(0.5),
        }),
        ...extendSx(sx),
      ]}
    >
      <Typography
        sx={[
          (theme) => ({
            padding: theme.spacing(0, 0.5),
            borderRadius: theme.shape.borderRadius,
          }),
          (theme) => ({
            textDecoration: 'line-through',
            color: theme.palette.error.main,
            background: fade(theme.palette.error.light, 0.5),
          }),
        ]}
        gutterBottom
        display="inline"
      >
        {labelBy ? labelBy(previous) : (previous as ReactNode)}
      </Typography>
      <Typography
        sx={[
          (theme) => ({
            padding: theme.spacing(0, 0.5),
            borderRadius: theme.shape.borderRadius,
          }),
          (theme) => ({
            color: theme.palette.primary.dark,
            background: fade(theme.palette.primary.light, 0.5),
          }),
        ]}
        display="inline"
      >
        {labelBy ? labelBy(current) : (current as ReactNode)}
      </Typography>
    </Grid>
  );
};
