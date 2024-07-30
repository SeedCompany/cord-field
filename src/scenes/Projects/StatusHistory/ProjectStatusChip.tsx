import { Box, Chip, Tooltip, Typography } from '@mui/material';

export const ProjectStatusChip = ({ status }: { status: string }) => {
  return (
    <Box display="flex" width={1} flex={1} justifyContent="center">
      <Tooltip title={status}>
        <Chip
          label={
            <Typography variant="button" color="textSecondary" fontSize="80%">
              {status}
            </Typography>
          }
          sx={{
            maxWidth: 154,
            textOverflow: 'ellipsis',
            borderRadius: 1,
          }}
        />
      </Tooltip>
    </Box>
  );
};
