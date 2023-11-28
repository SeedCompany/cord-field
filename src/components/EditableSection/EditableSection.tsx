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
import { ChildrenProp, StyleProps } from '~/common';
import { IconButton } from '../IconButton';

interface EditableSectionProps extends StyleProps, ChildrenProp {
  title?: ReactNode;
  editTooltip?: ReactNode;
  editIcon?: ReactNode;
  loading?: boolean;
  canEdit?: boolean;
  onEdit?: (arg?: any) => void | Promise<void>;
  iconLabel?: string;
}

export const EditableSection = ({
  loading,
  canEdit,
  onEdit,
  title,
  editTooltip,
  editIcon,
  children,
  iconLabel,
  ...rest
}: EditableSectionProps) => (
  <Box component="section" {...rest}>
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
      <Tooltip title={editTooltip ?? 'Edit'}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            disabled={!canEdit}
            onClick={onEdit}
            loading={loading}
            size="small"
          >
            {editIcon || <Edit />}
          </IconButton>
          {iconLabel && (
            <Typography variant="body2" sx={{ ml: 1 }}>
              {iconLabel}
            </Typography>
          )}
        </Box>
      </Tooltip>
    </Box>
    <Divider />
    <Stack p={2}>{children}</Stack>
  </Box>
);
