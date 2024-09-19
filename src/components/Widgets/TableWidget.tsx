import { Box } from '@mui/material';
import { ChildrenProp } from '~/common';

export const TableWidget = ({ children }: ChildrenProp) => {
  return (
    <Box
      sx={({ spacing }) => ({
        height: '100%',
        width: `calc(100% - ${spacing(4)})`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      })}
    >
      {children}
    </Box>
  );
};
