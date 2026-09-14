import { ButtonProps } from '@mui/material';
import { TransitionType } from '~/api/schema/schema.graphql.ts';

export const transitionTypeStyles = {
  Approve: { color: 'primary', variant: 'contained' },
  Neutral: { color: 'secondary', variant: 'text' },
  Reject: { color: 'error', variant: 'text' },
} satisfies Record<TransitionType, ButtonProps>;
