import { fade, Grid, makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { identity } from 'lodash';
import * as React from 'react';
import { ReactNode } from 'react';
import { UnsecuredProp, unwrapSecured } from '../../api';
import { ChangesetBadge } from './ChangesetBadge';

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

interface Props<
  Obj,
  Key extends keyof Obj,
  Item extends UnsecuredProp<Obj[Key]>
> {
  previous?: Obj | null;
  current?: Obj;
  prop: Key;
  /**
   * How should this item be labeled in UI
   * @default identity
   */
  labelBy?: (item: Item) => string | number | boolean;
  /**
   * How should this item be identified to test if it has changed?
   * @default identity
   */
  identifyBy?: (item: Item) => any;
  /**
   * Customize the rendering of the property change.
   * This is only called if there is a change.
   */
  renderChange?: (props: { previous: Item; current: Item }) => ReactNode;
  children: ReactNode;
}

export const ChangesetPropertyBadge = <
  Obj,
  Key extends keyof Obj,
  Item extends UnsecuredProp<Obj[Key]>
>(
  props: Props<Obj, Key, Item>
) => {
  const {
    current,
    previous,
    prop,
    labelBy,
    identifyBy,
    renderChange,
    children,
  } = props;
  if (!current || !previous) {
    return <>{children}</>;
  }
  const currentProp = unwrapSecured(current[prop]) as Item;
  const originalProp = unwrapSecured(previous[prop]) as Item;
  const isDiff =
    (identifyBy ?? identity)(currentProp) !==
    (identifyBy ?? identity)(originalProp);
  return (
    <ChangesetBadge
      mode={isDiff ? 'changed' : undefined}
      moreInfo={
        isDiff ? (
          renderChange ? (
            renderChange({
              previous: originalProp,
              current: currentProp,
            }) ?? ''
          ) : (
            <ChangedContent
              previous={originalProp}
              current={currentProp}
              labelBy={labelBy}
            />
          )
        ) : null
      }
    >
      {children}
    </ChangesetBadge>
  );
};

const ChangedContent = <T extends any>({
  previous,
  current,
  labelBy,
}: {
  previous: T;
  current: T;
  labelBy?: (item: T) => string | number | boolean;
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
