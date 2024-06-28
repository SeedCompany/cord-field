import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
import {
  DefaultDataGridStyles,
  flexLayout,
  noHeaderFilterButtons,
  useDataGridSource,
} from '~/components/Grid';
import {
  ProjectDataGridRowFragment as Project,
  ProjectColumns,
} from '~/components/ProjectDataGrid';
import { ProjectListDocument } from './ProjectList.graphql';

export interface PanelProps {
  filters: { mine?: boolean; pinned?: boolean };
}

export const ProjectsPanel = ({ filters }: PanelProps) => {
  const [dataGridProps] = useDataGridSource({
    query: ProjectListDocument,
    variables: {
      input: {
        filter: {
          ...(filters.mine ? { mine: true } : {}),
          ...(filters.pinned ? { pinned: true } : {}),
        },
      },
    },
    listAt: 'projects',
    initialInput: {},
  });

  const slots = useMemo(
    () => merge({}, DefaultDataGridStyles.slots, dataGridProps.slots),
    [dataGridProps.slots]
  );

  const slotProps = useMemo(
    () => merge({}, DefaultDataGridStyles.slotProps, dataGridProps.slotProps),
    [dataGridProps.slotProps]
  );

  return (
    <DataGrid<Project>
      {...DefaultDataGridStyles}
      {...dataGridProps}
      slots={slots}
      slotProps={slotProps}
      columns={ProjectColumns}
      initialState={projectInitialState}
      headerFilters
      sx={[flexLayout, noHeaderFilterButtons]}
    />
  );
};

const projectInitialState = {
  pinnedColumns: {
    left: [ProjectColumns[0]!.field],
  },
} satisfies DataGridProps['initialState'];
