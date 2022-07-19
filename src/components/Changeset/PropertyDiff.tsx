import { fade, Grid, makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { ReactNode } from 'react';

const useStyles = makeStyles(({ palette, shape, spacing }) => ({
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
    background: fade(palette.primary.light, 0.5),
  },
}));

export const PropertyDiff = <T extends any>({
  previous,
  current,
  labelBy,
}: {
  previous: T;
  current: T;
  labelBy?: (item: T) => ReactNode;
}) => {
  const classes = useStyles();
  return (
    <Grid
      container
      direction="column"
      alignItems="flex-start"
      className={classes.diff}
    >
      <Typography
        className={clsx(classes.diffItem, classes.previous)}
        gutterBottom
        display="inline"
      >
        {labelBy ? labelBy(previous) : (previous as ReactNode)}
      </Typography>
      <Typography
        className={clsx(classes.diffItem, classes.current)}
        display="inline"
      >
        {labelBy ? labelBy(current) : (current as ReactNode)}
      </Typography>
    </Grid>
  );
};
