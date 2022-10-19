import { Badge, Grid, Theme, TooltipProps, Typography } from '@mui/material';
import { startCase } from 'lodash';
import { cloneElement, isValidElement, ReactElement, ReactNode } from 'react';
import { mapFromList, StyleProps } from '~/common';
import { BadgeWithTooltip } from '../BadgeWithTooltip';
import { PaperTooltip } from '../PaperTooltip';
import { DiffMode } from './ChangesetDiffContext';
import { ChangesetIcon } from './ChangesetIcon';
import { modeToPalette } from './theme';

const classes = {
  added: 'changeset-badge-added',
  changed: 'changeset-badge-changed',
  removed: 'changeset-badge-removed',
  outline: 'changeset-badge-outline',
};

interface ChangesetBadgeOwnProps {
  children: ReactNode;
  mode?: DiffMode;
  disableOutline?: boolean;
  moreInfo?: ReactNode;
  TooltipProps?: Omit<TooltipProps, 'title' | 'children'>;
}

const generatedModeStyles = (theme: Theme) => ({
  ...mapFromList(['added', 'changed', 'removed'] as const, (mode) => {
    const paletteKey = modeToPalette[mode];
    const css = {
      color: theme.palette[paletteKey].contrastText,
      background: theme.palette[paletteKey].main,
      padding: 0,
      cursor: 'help',
    };
    return [`& .${classes[mode]} ~ .MuiBadge-badge`, css];
  }),
});

export interface ChangesetBadgeProps
  extends ChangesetBadgeOwnProps,
    StyleProps {}

export const ChangesetBadge = (props: ChangesetBadgeProps) => {
  const { mode, disableOutline, children, moreInfo, TooltipProps } = props;
  const outline = !disableOutline;

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
      badgeContent={<ChangesetIcon mode={mode} sx={{ fontSize: 12 }} />}
      classes={{
        [classes.added]: mode === 'added',
        [classes.changed]: mode === 'changed',
        [classes.removed]: mode === 'removed',
        [classes.outline]: outline,
      }}
      sx={[
        {
          '&.MuiBadge-root': {
            display: 'flex',
          },
        },
        generatedModeStyles,
      ]}
    >
      {isValidElement(children)
        ? cloneElement(children, {
            ...children.props,
            className:
              `${children.props?.className ? children.props?.className : ''} ` +
              `${mode === 'added' ? classes.added : ''} ` +
              `${mode === 'changed' ? classes.changed : ''} ` +
              `${mode === 'removed' ? classes.removed : ''} ` +
              `${outline ? classes.outline : ''}`,

            sx: [
              (theme: Theme) => ({
                [`&.${classes.added}.${classes.outline}`]: {
                  border: `2px solid ${
                    theme.palette[modeToPalette.added].main
                  }`,
                },
                [`&.${classes.changed}.${classes.outline}`]: {
                  border: `2px solid ${
                    theme.palette[modeToPalette.changed].main
                  }`,
                },
                [`&.${classes.removed}`]: {
                  [`&.${classes.outline}`]: {
                    border: `2px solid ${
                      theme.palette[modeToPalette.removed].main
                    }`,
                  },
                  boxShadow: 'none',
                  backgroundColor: 'inherit',
                  '& > *': {
                    filter: 'grayscale(1)',
                  },
                },
              }),
            ],
          })
        : children}
    </Badge>
  );
};
