import { Box } from '@mui/material';
import { GridRenderCellParams as RenderCellParams } from '@mui/x-data-grid';
import { ChildrenProp, extendSx, StyleProps } from '~/common';
import { useExpanded } from './expansionState';

export const ExpansionCell = ({
  id,
  sx,
  className,
  children,
}: Pick<RenderCellParams, 'id' | 'api'> & StyleProps & ChildrenProp) => {
  const isExpanded = useExpanded().has(id);

  return (
    <Box
      sx={[
        {
          overflow: 'hidden',
          textWrap: 'wrap',
          display: isExpanded ? 'contents' : '-webkit-box',
          WebkitLineClamp: '2',
          WebkitBoxOrient: 'vertical',

          // Only show the first child when collapsed.
          // This prevents the clamp from happening (half) below the shown cell.
          '& > :not(:first-child) /* emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason */':
            {
              display: isExpanded ? undefined : 'none',
            },

          // No trailing spacing on response
          '& > *:last-child': { mb: 0 },
        },
        ...extendSx(sx),
      ]}
      className={className}
    >
      {children}
    </Box>
  );
};
