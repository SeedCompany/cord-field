import { DataGridProProps as DataGridProps } from '@mui/x-data-grid-pro';
import { entries } from '@seedcompany/common';
import { extendSx } from '~/common';
import { getInitialVisibility } from '~/components/Grid';
import {
  ProgressReportColumnMapShape,
  ProgressReportsColumnMap,
  ProgressReportsGrid,
} from './ProgressReportsGrid';
import { VariantResponseIconCell } from './VariantResponseCell';

const columns = entries({
  ...ProgressReportsColumnMap,
  project: {
    ...ProgressReportsColumnMap.project,
    flex: 1,
    minWidth: 100,
  },
  language: {
    ...ProgressReportsColumnMap.language,
    flex: 1,
    minWidth: 100,
  },
  teamNews: {
    ...ProgressReportsColumnMap.teamNews,
    renderCell: VariantResponseIconCell,
    headerAlign: 'center',
    width: 95,
  },
  communityStories: {
    ...ProgressReportsColumnMap.communityStories,
    renderCell: VariantResponseIconCell,
    headerAlign: 'center',
    width: 80,
  },
} satisfies ProgressReportColumnMapShape).map(([name, col]) => ({
  field: name,
  ...col,
}));

const initialState = {
  columns: {
    columnVisibilityModel: {
      ...getInitialVisibility(columns),
      'varianceExplanation.reasons': false,
      'engagement.project.isMember': false,
      'engagement.project.pinned': false,
    },
  },
} satisfies DataGridProps['initialState'];

export const ProgressReportsCollapsedGrid = (props: Partial<DataGridProps>) => {
  return (
    <ProgressReportsGrid
      {...props}
      columns={columns}
      initialState={initialState}
      disableColumnMenu
      sx={[
        (theme) => ({
          '.MuiDataGrid-main': {
            borderTop: `thin solid ${theme.palette.divider}`,
          },
        }),
        ...extendSx(props.sx),
      ]}
    />
  );
};
