import { Grid, Typography } from '@mui/material';
import { alpha as fade } from '@mui/material/styles';
import { ReactNode } from 'react';
import { extendSx, Sx } from '~/common';

const diffItem: Sx = {
  px: 0.5,
  borderRadius: 1,
};

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
        {
          marginTop: 0.5,
        },
        ...extendSx(sx),
      ]}
    >
      <Typography
        sx={[
          diffItem,
          {
            textDecoration: 'line-through',
            color: 'error.main',
            background: fade('error.light', 0.5),
          },
        ]}
        gutterBottom
        display="inline"
      >
        {labelBy ? labelBy(previous) : (previous as ReactNode)}
      </Typography>
      <Typography
        sx={[
          diffItem,
          {
            color: 'primary.dark',
            background: fade('primary.light', 0.5),
          },
        ]}
        display="inline"
      >
        {labelBy ? labelBy(current) : (current as ReactNode)}
      </Typography>
    </Grid>
  );
};
