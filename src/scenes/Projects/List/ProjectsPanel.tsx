import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
import {
  DefaultDataGridStyles,
  flexLayout,
  getInitialVisibility,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSource,
} from '~/components/Grid';
import {
  ProjectDataGridRowFragment as Project,
  ProjectColumns,
  ProjectToolbar,
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
    () =>
      merge({}, DefaultDataGridStyles.slots, dataGridProps.slots, {
        toolbar: ProjectToolbar,
      } satisfies DataGridProps['slots']),
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
      hideFooter
      sx={[flexLayout, noHeaderFilterButtons, noFooter]}
    />
  );
};

const projectInitialState = {
  pinnedColumns: {
    left: [ProjectColumns[0]!.field],
  },
  columns: {
    columnVisibilityModel: getInitialVisibility(ProjectColumns),
  },
} satisfies DataGridProps['initialState'];
