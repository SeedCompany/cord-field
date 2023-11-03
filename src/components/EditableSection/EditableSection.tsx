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
  loading?: boolean;
  canEdit?: boolean;
  onEdit?: () => void;
}

export const EditableSection = ({
  loading,
  canEdit,
  onEdit,
  title,
  editTooltip,
  children,
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
        <span>
          <IconButton
            disabled={!canEdit}
            onClick={onEdit}
            loading={loading}
            size="small"
          >
            <Edit />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
    <Divider />
    <Stack p={2}>{children}</Stack>
  </Box>
);
