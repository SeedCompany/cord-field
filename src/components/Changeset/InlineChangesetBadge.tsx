import { Box, Grid, TooltipProps, Typography } from '@mui/material';
import { startCase } from 'lodash';
import { ReactNode } from 'react';
import { extendSx, StyleProps } from '~/common';
import { PaperTooltip } from '../PaperTooltip';
import { DiffMode } from './ChangesetDiffContext';
import { ChangesetIcon } from './ChangesetIcon';
import { modeToPalette } from './theme';

export interface InlineChangesetBadgeProps extends StyleProps {
  mode?: DiffMode;
  moreInfo?: ReactNode;
  tooltipProps?: Omit<TooltipProps, 'title' | 'children'>;
}

/**
 * A ChangesetBadge meant to be used inline, instead of attached to another element.
 */
export const InlineChangesetBadge = (props: InlineChangesetBadgeProps) => {
  const { mode, moreInfo, tooltipProps, ...rest } = props;

  if (!mode) {
    return null;
  }
  const paletteKey = modeToPalette[mode];

  return (
    <PaperTooltip
      placement="right"
      {...tooltipProps}
      title={
        <Grid container direction="column" alignItems="flex-start">
          <Typography variant="caption" gutterBottom>
            {startCase(mode)} in the current change request
          </Typography>
          {moreInfo}
        </Grid>
      }
    >
      <Box
        {...rest}
        sx={[
          (theme) => ({
            color: theme.palette[paletteKey].contrastText,
            background: theme.palette[paletteKey].main,
            borderRadius: '10px',
            display: 'flex',
            flexFlow: 'row wrap',
            placeContent: 'center',
            alignItems: 'center',
            lineHeight: 1,
            minWidth: '20px',
            height: '20px',
          }),
          ...extendSx(rest.sx),
        ]}
      >
        <ChangesetIcon
          mode={mode}
          color="inherit"
          sx={{ fontSize: 12, cursor: 'help' }}
        />
      </Box>
    </PaperTooltip>
  );
};
