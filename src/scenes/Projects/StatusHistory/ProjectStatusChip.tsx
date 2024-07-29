import { Box, Chip, Tooltip } from '@mui/material';

export const ProjectStatusChip = ({ status }: { status: string }) => {
  return (
    <Box display="flex" width={1} flex={1} justifyContent="center">
      <Tooltip title={status}>
        <Chip label={status} sx={{ maxWidth: 154, textOverflow: 'ellipsis' }} />
      </Tooltip>
    </Box>
  );
};
