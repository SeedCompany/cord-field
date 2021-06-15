import { Badge, fade, Grid, makeStyles, Typography } from '@material-ui/core';
import { ChangeHistory as ChangeIcon } from '@material-ui/icons';
import clsx from 'clsx';
import { identity } from 'lodash';
import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import { UnsecuredProp, unwrapSecured } from '../../api';
import { BadgeWithTooltip } from '../BadgeWithTooltip';
import { PaperTooltip } from '../PaperTooltip';

const useStyles = makeStyles(({ palette, shape, spacing }) => ({
  changed: {
    color: palette.info.contrastText,
    background: palette.info.main,
    padding: 0,
    cursor: 'help',
  },
  icon: {
    fontSize: 12,
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

export const ChangesetBadge = <
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
  const classes = useStyles();

  if (!current || !previous) {
    return <>{children}</>;
  }
  const currentProp = unwrapSecured(current[prop]) as Item;
  const originalProp = unwrapSecured(previous[prop]) as Item;
  const isDiff =
    (identifyBy ?? identity)(currentProp) !==
    (identifyBy ?? identity)(originalProp);
  return (
    <Badge
      anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
      component={BadgeWithTooltip}
      tooltip={(content: ReactElement) => (
        <PaperTooltip
          title={
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
            ) : (
              ''
            )
          }
          placement="right"
        >
          {content}
        </PaperTooltip>
      )}
      badgeContent={
        isDiff ? <ChangeIcon color="inherit" className={classes.icon} /> : null
      }
      invisible={!isDiff}
      classes={{
        badge: classes.changed,
      }}
    >
      {children}
    </Badge>
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
    <Grid container direction="column" alignItems="flex-start">
      <Typography variant="caption" gutterBottom>
        This has been changed in the current changeset
      </Typography>
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
