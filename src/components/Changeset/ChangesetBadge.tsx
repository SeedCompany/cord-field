import { Badge, Grid, TooltipProps, Typography } from '@mui/material';
import { mapEntries } from '@seedcompany/common';
import { startCase } from 'lodash';
import { cloneElement, isValidElement, ReactElement, ReactNode } from 'react';
import { makeStyles } from 'tss-react/mui';
import { UseStyles } from '~/common';
import { BadgeWithTooltip } from '../BadgeWithTooltip';
import { PaperTooltip } from '../PaperTooltip';
import { DiffMode } from './ChangesetDiffContext';
import { ChangesetIcon } from './ChangesetIcon';
import { modeToPalette } from './theme';

const useStyles = makeStyles<
  ChangesetBadgeOwnProps,
  'added' | 'changed' | 'removed' | 'outline'
>()(({ palette }, _params, classes) => ({
  root: {
    display: 'flex',
  },
  badge: {
    padding: 0,
    cursor: 'help',
    ...mapEntries(['added', 'changed', 'removed'], (mode) => {
      const paletteKey = modeToPalette[mode];
      const css = {
        color: palette[paletteKey].contrastText,
        background: palette[paletteKey].main,
      };
      return [`&.${classes[mode]}`, css];
    }).asRecord,
  },
  icon: {
    fontSize: 12,
  },
  children: {
    [`&.${classes.added}.${classes.outline}`]: {
      border: `2px solid ${palette[modeToPalette.added].main}`,
    },
    [`&.${classes.changed}.${classes.outline}`]: {
      border: `2px solid ${palette[modeToPalette.changed].main}`,
    },
    [`&.${classes.removed}`]: {
      [`&.${classes.outline}`]: {
        border: `2px solid ${palette[modeToPalette.removed].main}`,
      },
      boxShadow: 'none',
      backgroundColor: 'inherit',
      '& > *': {
        filter: 'grayscale(1)',
      },
    },
  },
  added: {},
  changed: {},
  removed: {},
  outline: {},
}));

interface ChangesetBadgeOwnProps {
  children: ReactNode;
  mode?: DiffMode;
  disableOutline?: boolean;
  moreInfo?: ReactNode;
  TooltipProps?: Omit<TooltipProps, 'title' | 'children'>;
}

export interface ChangesetBadgeProps
  extends ChangesetBadgeOwnProps,
    UseStyles<typeof useStyles> {}

export const ChangesetBadge = (props: ChangesetBadgeProps) => {
  const { mode, disableOutline, children, moreInfo, TooltipProps } = props;
  const outline = !disableOutline;
  const { classes, cx } = useStyles(props, {
    props: { classes: props.classes },
  });

  if (!mode) {
    return <>{children}</>;
  }

  return (
    <Badge
      anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
      component={BadgeWithTooltip}
      tooltip={(content: ReactElement) => (
        <PaperTooltip
          placement="right"
          {...TooltipProps}
          title={
            <Grid container direction="column" alignItems="flex-start">
              <Typography variant="caption" gutterBottom>
                {startCase(mode)} in the current change request
              </Typography>
              {moreInfo}
            </Grid>
          }
        >
          {content}
        </PaperTooltip>
      )}
      badgeContent={
        <ChangesetIcon mode={mode} color="inherit" className={classes.icon} />
      }
      classes={{
        root: classes.root,
        badge: cx({
          [classes.badge]: true,
          [classes.added]: mode === 'added',
          [classes.changed]: mode === 'changed',
          [classes.removed]: mode === 'removed',
          [classes.outline]: outline,
        }),
      }}
    >
      {isValidElement(children)
        ? cloneElement(children, {
            ...children.props,
            className: cx(
              {
                [classes.children]: true,
                [classes.added]: mode === 'added',
                [classes.changed]: mode === 'changed',
                [classes.removed]: mode === 'removed',
                [classes.outline]: outline,
              },
              children.props?.className
            ),
          })
        : children}
    </Badge>
  );
};
