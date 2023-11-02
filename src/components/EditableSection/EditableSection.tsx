import { Edit } from '@mui/icons-material';
import {
  Box,
  Divider,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { ReactNode } from 'react';
import { StyleProps } from '~/common';
import { IconButton } from '../IconButton';

interface EditableSectionProps extends StyleProps {
  children?: ReactNode;
  title?: string;
  tooltipTitle?: string;
  loading?: boolean;
  canEdit?: boolean;
  onEdit?: () => void;
}

export const EditableSection = ({
  loading,
  canEdit,
  onEdit,
  title,
  tooltipTitle,
  children,
  ...rest
}: EditableSectionProps) => {
  return (
    <Box {...rest} component="section">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 1,
        }}
      >
        <Typography variant="h3">
          {!loading ? title : <Skeleton width="120px" />}
        </Typography>
        <Tooltip title={tooltipTitle}>
          <span>
            <IconButton disabled={!canEdit} onClick={onEdit} loading={loading}>
              <Edit />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      <Divider />
      <Stack
        sx={{
          p: 2,
        }}
      >
        {children}
      </Stack>
    </Box>
  );
};
