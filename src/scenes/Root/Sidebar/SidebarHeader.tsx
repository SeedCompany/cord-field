import { Box, Typography } from '@mui/material';
import { CordIcon } from '../../../components/Icons';
import { SwooshBackground } from './SwooshBackground';

export const SidebarHeader = () => {
  return (
    <Box
      sx={{
        position: 'relative',
      }}
    >
      <SwooshBackground />
      <Box
        sx={(theme) => ({
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: '15%',
          padding: theme.spacing(0, 4, 0, 4),
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
        })}
      >
        <CordIcon sx={{ color: 'inherit', fontSize: 40 }} />
        <Typography
          display="block"
          variant="caption"
          sx={(theme) => ({
            fontWeight: theme.typography.fontWeightLight,
          })}
        >
          © Seed Company
        </Typography>
      </Box>
    </Box>
  );
};
