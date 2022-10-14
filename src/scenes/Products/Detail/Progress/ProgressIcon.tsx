import { CheckCircle } from '@mui/icons-material';
import { Box } from '@mui/material';

export const ProgressIcon = ({ complete }: { complete: boolean }) => {
  return complete ? (
    <CheckCircle
      color="primary"
      sx={{
        // Scale icon to same size as rest
        transform: 'scale(1.2)',
      }}
    />
  ) : (
    <Box
      sx={(theme) => ({
        width: theme.spacing(3),
        height: theme.spacing(3),
        backgroundColor: theme.palette.action.disabledBackground,
        borderRadius: '100%',
      })}
    />
  );
};
