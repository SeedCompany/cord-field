import { fade, Grid, makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { identity } from 'lodash';
import * as React from 'react';
import { ReactNode } from 'react';
import { UnsecuredProp, unwrapSecured } from '../../api';
import { has } from '../../util';
import { ChangesetBadge } from './ChangesetBadge';
import { useDiffMode } from './ChangesetDiffContext';

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
  current?: Obj;
  prop: Key;
  /**
   * How should this item be labeled in UI
   * @default identity
   */
  labelBy?: (item: Item) => ReactNode;
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
    prop,
    labelBy,
    identifyBy: identifyByProp,
    renderChange,
    children,
  } = props;
  const [_, __, previous] = useDiffMode(current);

  if (!current || !previous) {
    return <>{children}</>;
  }
  if (!has(prop, previous)) {
    console.error(
      `${
        previous.__typename ?? 'Unknown'
      }.${prop} has not be requested in ChangesetDiff`
    );
    return <>{children}</>;
  }

  const currentProp = unwrapSecured(current[prop]) as Item;
  const originalProp = unwrapSecured(previous[prop]) as Item;
  const identifyBy = identifyByProp ?? identity;
  const isDiff = identifyBy(currentProp) !== identifyBy(originalProp);
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
