import { Tooltip, TooltipProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export const PaperTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme: { palette, spacing, typography, shadows } }) => ({
  '& .MuiTooltip-tooltip': {
    backgroundColor: palette.background.paper,
    color: palette.text.primary,
    ...typography.body1,
    padding: spacing(1),
    boxShadow: shadows[8],
  },
  '& .MuiTooltip-arrow': {
    color: palette.background.paper,
  },
}));
