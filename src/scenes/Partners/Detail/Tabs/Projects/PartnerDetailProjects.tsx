import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
  GridColDef,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { PartnerTypeLabels, PartnerTypeList } from '~/api/schema.graphql';
import { findIndexOrThrow } from '~/common/findIndexOrThrow';
import {
  DefaultDataGridStyles,
  flexLayout,
  multiSelectColumn,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSource,
} from '~/components/Grid';
import {
  ProjectDataGridRowFragment as Project,
  ProjectColumns,
  ProjectInitialState,
  ProjectToolbar,
} from '~/components/ProjectDataGrid';
import { TabPanelContent } from '~/components/Tabs';
import {
  PartnerProjectsDocument,
  // PartnerProjectDataGridRowFragment as PartnerProject,
} from './PartnerProjects.graphql';

export const PartnerDetailProjects = () => {
  const { partnerId = '' } = useParams();

  const [props] = useDataGridSource({
    query: PartnerProjectsDocument,
    variables: { partnerId: partnerId },
    listAt: 'partner.projects',
    initialInput: {
      sort: 'name',
    },
  });

  const slots = useMemo(
    () =>
      merge({}, DefaultDataGridStyles.slots, props.slots, {
        toolbar: ProjectToolbar,
      } satisfies DataGridProps['slots']),
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
        columns={mergedProjectPartnerColumns}
        initialState={ProjectInitialState}
        headerFilters
        hideFooter
        sx={[flexLayout, noHeaderFilterButtons, noFooter]}
      />
    </TabPanelContent>
  );
};

const PartnershipColumns: GridColDef[] = [
  {
    field: 'partnerships.types',
    ...multiSelectColumn(PartnerTypeList, PartnerTypeLabels),
    headerName: 'Partnership Type',
    width: 160,
    serverFilter: ({ value }) => ({
      partnerships: { types: value },
    }),
    valueGetter: (_, { partnership }) => partnership.types.value,
  },
];

const mergedProjectPartnerColumns = ProjectColumns.toSpliced(
  findIndexOrThrow('status', ProjectColumns) + 1,
  0,
  ...PartnershipColumns
);
