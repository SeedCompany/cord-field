import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
  GridColDef,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { PartnerTypeLabels, PartnerTypeList } from '~/api/schema.graphql';
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
import { PartnerProjectsDocument } from './PartnerProjects.graphql';

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

  const getStatusColumnIndex = (field: string, defaultIndex?: number) => {
    const index = ProjectColumns.findIndex((column) => column.field === field);
    return index === -1 ? defaultIndex : index + 1;
  };

  const ProjectPartnerColumns: GridColDef[] = [
    ...ProjectColumns.slice(0, getStatusColumnIndex('status', 5)),
    {
      field: 'partnerships.types',
      ...multiSelectColumn(PartnerTypeList, PartnerTypeLabels),
      headerName: 'Partnership Type',
      width: 160,
      sortable: false,
      serverFilter: ({ value }) => ({
        partnerships: { types: typeof value === 'string' ? [value] : value },
      }),
      valueGetter: (_, { partnership }) => partnership.types.value,
    },
    ...ProjectColumns.slice(getStatusColumnIndex('status', 0)),
  ];

  return (
    <TabPanelContent>
      <DataGrid<Project>
        {...DefaultDataGridStyles}
        {...props}
        slots={slots}
        slotProps={slotProps}
        columns={ProjectPartnerColumns}
        initialState={ProjectInitialState}
        headerFilters
        hideFooter
        sx={[flexLayout, noHeaderFilterButtons, noFooter]}
      />
    </TabPanelContent>
  );
};
