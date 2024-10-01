import { CardContent } from '@mui/material';
import { ChildrenProp } from '~/common';

export const WidgetBody = ({ children }: ChildrenProp) => (
  <CardContent
    sx={{
      height: 1,
      overflow: 'auto',
      display: 'flex',
      justifyContent: 'center',
      p: 0,
      '&:last-child': {
        paddingBottom: 0,
      },
    }}
  >
    {children}
  </CardContent>
);
