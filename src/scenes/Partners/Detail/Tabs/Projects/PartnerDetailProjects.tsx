import { DataGridPro as DataGrid, GridColDef } from '@mui/x-data-grid-pro';
import { useParams } from 'react-router-dom';
import { PartnerTypeLabels, PartnerTypeList } from '~/api/schema.graphql';
import { unmatchedIndexThrow } from '~/common';
import {
  DefaultDataGridStyles,
  flexLayout,
  multiEnumColumn,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSlots,
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
  PartnerProjectDataGridRowFragment as PartnerProject,
  PartnerProjectsDocument,
} from './PartnerProjects.graphql';

export const PartnerDetailProjects = () => {
  const { partnerId = '' } = useParams();

  const [props] = useDataGridSource({
    query: PartnerProjectsDocument,
    variables: { partnerId },
    listAt: 'partner.projects',
    initialInput: {
      sort: 'name',
    },
  });

  const { slots, slotProps } = useDataGridSlots(props, {
    slots: { toolbar: ProjectToolbar },
  });

  return (
    <TabPanelContent>
      <DataGrid<PartnerProject>
        {...DefaultDataGridStyles}
        {...props}
        slots={slots}
        slotProps={slotProps}
        columns={PartnerProjectColumns}
        initialState={ProjectInitialState}
        headerFilters
        hideFooter
        sx={[flexLayout, noHeaderFilterButtons, noFooter]}
      />
    </TabPanelContent>
  );
};

const PartnershipTypesColumn: GridColDef<PartnerProject> = {
  field: 'partnerships.types',
  ...multiEnumColumn(PartnerTypeList, PartnerTypeLabels),
  headerName: 'Partnership Roles',
  width: 160,
  valueGetter: (_, { partnership }) => partnership.types.value,
};

const indexAfterStatus =
  unmatchedIndexThrow(ProjectColumns.findIndex((c) => c.field === 'status')) +
  1;

const PartnerProjectColumns =
  // Avoid contravariance constraint on `row` parameter of `valueGetter`.
  // This function is called for us, and we just want to enforce that
  // the `row` is _at least_ a `Project`.
  // The actual enforcement below.
  (ProjectColumns as Array<GridColDef<PartnerProject>>)
    // Add types' column after status
    .toSpliced(indexAfterStatus, 0, PartnershipTypesColumn);

// Actually enforce superset constraint here, since we're ignoring above.
const _EnforcePartnerProjectIsSupersetOfProject: Project =
  undefined as unknown as PartnerProject;
