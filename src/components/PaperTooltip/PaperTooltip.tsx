import { Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

export const PaperTooltip = styled(Tooltip)(
  ({ theme: { palette, spacing, typography, shadows } }) => ({
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
);
