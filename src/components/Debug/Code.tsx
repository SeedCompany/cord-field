import { Box } from '@mui/material';
import { ChildrenProp } from '~/common';

export const Code = ({
  className,
  json,
  children,
}: { json?: any; className?: string } & ChildrenProp) => {
  return (
    <Box
      component="pre"
      className={className}
      sx={(theme) => ({
        padding: theme.spacing(1),
        borderRadius: theme.shape.borderRadius,
        color: theme.palette.background.paper,
        backgroundColor: theme.palette.grey[800],
      })}
    >
      {json ? JSON.stringify(json, undefined, 2) : children}
    </Box>
  );
};
