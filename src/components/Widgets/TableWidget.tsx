import { Box } from '@mui/material';
import { ChildrenProp } from '~/common';

export const TableWidget = ({ children }: ChildrenProp) => (
  <Box
    sx={{
      height: 1,
      containerType: 'size',

      // Align text within the first column to header
      '.MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
        // :first-of-type didn't work
        '&[aria-colindex="1"]': {
          pl: 2,
        },
      },
    }}
  >
    {children}
  </Box>
);
