import { Tooltip, withStyles } from '@material-ui/core';

export const PaperTooltip = withStyles(
  ({ palette, spacing, typography, shadows }) => ({
    tooltip: {
      backgroundColor: palette.background.paper,
      color: palette.text.primary,
      ...typography.body1,
      padding: spacing(1),
      boxShadow: shadows[8],
    },
    arrow: {
      color: palette.background.paper,
    },
  })
)(Tooltip);
