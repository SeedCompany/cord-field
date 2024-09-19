import { CardContent } from '@mui/material';
import { ChildrenProp } from '~/common';

export const WidgetBody = ({ children }: ChildrenProp) => {
  return (
    <CardContent
      sx={{
        '&:last-child': {
          paddingBottom: 0,
        },
        p: 0,
        overflowX: 'auto',
        overflowY: 'auto',
        height: 1,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {children}
    </CardContent>
  );
};
