import {
  Add as AddIcon,
  ChangeHistory as ChangeIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { Badge, Grid, TooltipProps, Typography } from '@mui/material';
import { startCase } from 'lodash';
import { cloneElement, isValidElement, ReactElement, ReactNode } from 'react';
import { makeStyles } from 'tss-react/mui';
import { simpleSwitch, UseStyles } from '~/common';
import { BadgeWithTooltip } from '../BadgeWithTooltip';
import { PaperTooltip } from '../PaperTooltip';

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
    [`&.${classes.added}`]: {
      color: 'white',
      background: palette.success.main,
    },
    [`&.${classes.changed}`]: {
      color: palette.info.contrastText,
      background: palette.info.main,
    },
    [`&.${classes.removed}`]: {
      color: palette.error.contrastText,
      background: palette.error.main,
    },
  },
  icon: {
    fontSize: 12,
  },
  children: {
    [`&.${classes.added}.${classes.outline}`]: {
      border: `2px solid ${palette.success.main}`,
    },
    [`&.${classes.changed}.${classes.outline}`]: {
      border: `2px solid ${palette.info.main}`,
    },
    [`&.${classes.removed}`]: {
      [`&.${classes.outline}`]: {
        border: `2px solid ${palette.error.main}`,
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
  mode?: 'added' | 'removed' | 'changed';
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
  const Icon = simpleSwitch(mode, {
    added: AddIcon,
    changed: ChangeIcon,
    removed: RemoveIcon,
  })!;

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
      badgeContent={<Icon color="inherit" className={classes.icon} />}
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
