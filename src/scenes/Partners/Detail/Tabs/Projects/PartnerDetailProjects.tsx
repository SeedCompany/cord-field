import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  DefaultDataGridStyles,
  flexLayout,
  getInitialVisibility,
  noHeaderFilterButtons,
  useDataGridSource,
} from '~/components/Grid';
import {
  ProjectDataGridRowFragment as Project,
  ProjectColumns,
} from '~/components/ProjectDataGrid';
import { TabPanelContent } from '~/components/Tabs';
import { PartnerProjectsDocument } from './PartnerProjects.graphql';

const initialState = {
  pinnedColumns: {
    left: [ProjectColumns[0]!.field],
  },
  columns: {
    columnVisibilityModel: getInitialVisibility(ProjectColumns),
  },
} satisfies DataGridProps['initialState'];

export const PartnerDetailProjects = () => {
  const { partnerId = '' } = useParams();

  const [props] = useDataGridSource({
    query: PartnerProjectsDocument,
    variables: { id: partnerId },
    listAt: 'partner.projects',
    initialInput: {
      sort: 'name',
    },
  });

  const slots = useMemo(
    () => merge({}, DefaultDataGridStyles.slots, props.slots),
    [props.slots]
  );
  const slotProps = useMemo(
    () => merge({}, DefaultDataGridStyles.slotProps, props.slotProps),
    [props.slotProps]
  );

  return (
    <TabPanelContent>
      <DataGrid<Project>
        {...DefaultDataGridStyles}
        {...props}
        slots={slots}
        slotProps={slotProps}
        columns={ProjectColumns}
        initialState={initialState}
        headerFilters
        sx={[flexLayout, noHeaderFilterButtons]}
      />
    </TabPanelContent>
  );
};
