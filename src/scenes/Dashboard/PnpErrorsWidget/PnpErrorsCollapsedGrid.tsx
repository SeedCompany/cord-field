import { DataGridProProps as DataGridProps } from '@mui/x-data-grid-pro';
import { extendSx } from '~/common';
import { getInitialVisibility } from '~/components/Grid';
import {
  PnpErrorsColumnMap,
  PnpErrorsColumnMapShape,
  PnpErrorsGrid,
  PnpErrorsGridProps,
} from './PnpErrorsGrid';

const columns = Object.values({
  ...PnpErrorsColumnMap,
  project: {
    ...PnpErrorsColumnMap.project,
    flex: 1,
    minWidth: 100,
  },
  language: {
    ...PnpErrorsColumnMap.language,
    flex: 1,
    minWidth: 100,
  },
} satisfies PnpErrorsColumnMapShape);

const initialState = {
  columns: {
    columnVisibilityModel: {
      ...getInitialVisibility(columns),
      viewReport: false,
      'engagement.project.isMember': false,
      'engagement.project.pinned': false,
    },
  },
} satisfies DataGridProps['initialState'];

export const PnpErrorsCollapsedGrid = (
  props: Omit<PnpErrorsGridProps, 'columns'>
) => {
  return (
    <PnpErrorsGrid
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
