import { Typography } from '@mui/material';
import { FallbackProps } from 'react-error-boundary';

export const PreviewError = (props: FallbackProps) => (
  <Typography
    variant="h3"
    color="textSecondary"
    textAlign="center"
    maxWidth="sm"
  >
    {props.error.message}
  </Typography>
);
