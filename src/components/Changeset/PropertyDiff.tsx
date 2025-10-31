import { Grid, Typography } from '@mui/material';
import { alpha as fade } from '@mui/material/styles';
import { ReactNode } from 'react';
import { extendSx, Sx } from '~/common';

export const PropertyDiff = <T extends any>({
  previous,
  current,
  labelBy,
  sx,
}: {
  previous: T;
  current: T;
  labelBy?: (item: T) => ReactNode;
  sx?: Sx;
}) => {
  return (
    <Grid
      container
      direction="column"
      alignItems="flex-start"
      sx={[
        {
          mt: 0.5,
        },
        ...extendSx(sx),
      ]}
    >
      <Typography
        gutterBottom
        display="inline"
        sx={(theme) => ({
          padding: theme.spacing(0, 0.5),
          borderRadius: theme.shape.borderRadius,
          textDecoration: 'line-through',
          color: theme.palette.error.main,
          background: fade(theme.palette.error.light, 0.5),
        })}
      >
        {labelBy ? labelBy(previous) : (previous as ReactNode)}
      </Typography>
      <Typography
        sx={(theme) => ({
          padding: theme.spacing(0, 0.5),
          borderRadius: theme.shape.borderRadius,
          color: theme.palette.primary.dark,
          background: fade(theme.palette.primary.main, 0.5),
        })}
        display="inline"
      >
        {labelBy ? labelBy(current) : (current as ReactNode)}
      </Typography>
    </Grid>
  );
};
