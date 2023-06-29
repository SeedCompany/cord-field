import { Box, Typography } from '@mui/material';
import { CordIcon } from '../../../components/Icons';

export const SidebarHeader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: 1,
        height: 72,
        alignItems: 'center',
      }}
    >
      <CordIcon
        fontSize="large"
        sx={{
          borderRadius: '0',
          justifySelf: 'center',
          width: 60,
          height: 32,
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          height: 1,
          pl: 2,
          flexDirection: 'column',
          alignItems: 'flex-start',
          backgroundColor: 'white',
          justifyContent: 'center',
          color: '#091016',
        }}
      >
        <Typography variant="h4" color="inherit">
          Cord Field
        </Typography>
        <Typography variant="caption" color="inherit">
          by Seed Company
        </Typography>
      </Box>
    </Box>
  );
};
