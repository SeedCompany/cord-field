import {
  Badge,
  Grid,
  makeStyles,
  TooltipProps,
  Typography,
} from '@material-ui/core';
import {
  Add as AddIcon,
  ChangeHistory as ChangeIcon,
  Remove as RemoveIcon,
} from '@material-ui/icons';
import clsx from 'clsx';
import { startCase } from 'lodash';
import { cloneElement, isValidElement, ReactElement, ReactNode } from 'react';
import { simpleSwitch, UseStyles } from '~/common';
import { BadgeWithTooltip } from '../BadgeWithTooltip';
import { PaperTooltip } from '../PaperTooltip';

const useStyles = makeStyles(({ palette }) => ({
  root: {
    display: 'flex',
  },
  badge: {
    padding: 0,
    cursor: 'help',
    '&$added': {
      color: 'white',
      background: palette.success.main,
    },
    '&$changed': {
      color: palette.info.contrastText,
      background: palette.info.main,
    },
    '&$removed': {
      color: palette.error.contrastText,
      background: palette.error.main,
    },
  },
  icon: {
    fontSize: 12,
  },
  children: {
    '&$added$outline': {
      border: `2px solid ${palette.success.main}`,
    },
    '&$changed$outline': {
      border: `2px solid ${palette.info.main}`,
    },
    '&$removed': {
      '&$outline': {
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

export interface ChangesetBadgeProps extends UseStyles<typeof useStyles> {
  children: ReactNode;
  mode?: 'added' | 'removed' | 'changed';
  disableOutline?: boolean;
  moreInfo?: ReactNode;
  TooltipProps?: Omit<TooltipProps, 'title' | 'children'>;
}

export const ChangesetBadge = (props: ChangesetBadgeProps) => {
  const { mode, disableOutline, children, moreInfo, TooltipProps } = props;
  const outline = !disableOutline;
  const classes = useStyles(props);

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
          // Assuming more info is given when changed
          interactive={mode === 'changed'}
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
        badge: clsx({
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
            className: clsx(
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
