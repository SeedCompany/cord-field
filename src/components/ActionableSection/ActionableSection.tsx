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

interface ActionableSectionProps extends StyleProps, ChildrenProp {
  title?: ReactNode;
  actionTooltip?: ReactNode;
  actionIcon?: ReactNode;
  loading?: boolean;
  canPerformAction?: boolean;
  onAction?: (arg?: any) => void | Promise<void>;
  iconLabel?: string;
}

export const ActionableSection = ({
  loading,
  canPerformAction,
  onAction,
  title,
  actionTooltip,
  actionIcon,
  children,
  iconLabel,
  ...rest
}: ActionableSectionProps) => (
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
      <Tooltip title={actionTooltip ?? 'Edit'}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            disabled={!canPerformAction}
            onClick={onAction}
            loading={loading}
            size="small"
          >
            {actionIcon || <Edit />}
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
