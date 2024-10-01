import { Grid, Typography } from '@mui/material';
import { alpha as fade } from '@mui/material/styles';
import { ReactNode } from 'react';
import { makeStyles } from 'tss-react/mui';
import { Sx } from '~/common';

const useStyles = makeStyles()(({ palette, shape, spacing }) => ({
  diff: {
    marginTop: spacing(0.5),
  },
  diffItem: {
    padding: spacing(0, 0.5),
    borderRadius: shape.borderRadius,
  },
  previous: {
    textDecoration: 'line-through',
    color: palette.error.main,
    background: fade(palette.error.light, 0.5),
  },
  current: {
    color: palette.primary.dark,
    background: fade(palette.primary.main, 0.5),
  },
}));

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
  const { classes, cx } = useStyles();
  return (
    <Grid
      container
      direction="column"
      alignItems="flex-start"
      className={cx(classes.diff, className)}
      sx={sx}
    >
      <Typography
        className={cx(classes.diffItem, classes.previous)}
        gutterBottom
        display="inline"
      >
        {labelBy ? labelBy(previous) : (previous as ReactNode)}
      </Typography>
      <Typography
        className={cx(classes.diffItem, classes.current)}
        display="inline"
      >
        {labelBy ? labelBy(current) : (current as ReactNode)}
      </Typography>
    </Grid>
  );
};
