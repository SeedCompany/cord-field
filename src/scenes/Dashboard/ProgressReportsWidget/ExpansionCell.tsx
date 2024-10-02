import { Box } from '@mui/material';
import {
  GridState,
  GridRenderCellParams as RenderCellParams,
  useGridSelector,
} from '@mui/x-data-grid';
import { ChildrenProp, extendSx, StyleProps } from '~/common';

export const ExpansionCell = ({
  id,
  api,
  sx,
  className,
  children,
}: Pick<RenderCellParams, 'id' | 'api'> & StyleProps & ChildrenProp) => {
  const selectedRows = useGridSelector(
    { current: api },
    (state: GridState) => state.rowSelection
  );
  const isExpanded = selectedRows.includes(id);

  return (
    <Box
      sx={[
        {
          overflow: 'hidden',
          textWrap: 'wrap',
          display: isExpanded ? 'contents' : '-webkit-box',
          WebkitLineClamp: '2',
          WebkitBoxOrient: 'vertical',

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
