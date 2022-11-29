import { ButtonProps } from '@mui/material';
import { TransitionType } from '~/api/schema/schema.graphql';

export const transitionTypeStyles: Record<TransitionType, ButtonProps> = {
  Approve: { color: 'primary', variant: 'contained' },
  Neutral: { color: 'secondary', variant: 'text' },
  Reject: { color: 'error', variant: 'text' },
};
