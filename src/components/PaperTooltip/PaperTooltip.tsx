import { Tooltip } from '@mui/material';
import { CSSObject } from 'tss-react';
import { withStyles } from 'tss-react/mui';

export const PaperTooltip = withStyles(
  Tooltip,
  ({ palette, spacing, typography, shadows }) => ({
    tooltip: {
      backgroundColor: palette.background.paper,
      color: palette.text.primary,
      ...(typography.body1 as CSSObject),
      padding: spacing(1),
      boxShadow: shadows[8],
    },
    arrow: {
      color: palette.background.paper,
    },
  })
);
