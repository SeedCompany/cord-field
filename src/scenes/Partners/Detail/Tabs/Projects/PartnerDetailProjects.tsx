import { DataGridPro as DataGrid, GridColDef } from '@mui/x-data-grid-pro';
import { useParams } from 'react-router-dom';
import { PartnerTypeLabels, PartnerTypeList } from '~/api/schema.graphql';
import { useIsMobile } from '~/common';
import {
  DefaultDataGridStyles,
  flexLayout,
  multiEnumColumn,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSlots,
  useDataGridSource,
} from '~/components/Grid';
import { EntityList as PartnersProjectsList } from '~/components/List';
import {
  insertProjectColumnAfterField,
  ProjectDataGridRowFragment as Project,
  ProjectColumns,
  ProjectInitialState,
  ProjectToolbar,
} from '~/components/ProjectDataGrid';
import { SensitivityIcon } from '~/components/Sensitivity';
import { TabPanelContent } from '~/components/Tabs';
import {
  PartnerProjectDataGridRowFragment as PartnerProject,
  PartnerProjectsDocument,
} from './PartnerProjects.graphql';

export const PartnerDetailProjects = () => {
  const { partnerId = '' } = useParams();
  const isMobile = useIsMobile();

  return isMobile ? (
    <PartnersProjectsList
      query={PartnerProjectsDocument}
      listAt={(data) => data.partner.projects}
      variables={{ partnerId }}
      columns={PartnerProjectColumns}
      sortDefault={{ field: 'name', direction: 'ASC' }}
      defaultSecondaryField="primaryLocation.name"
      primary={(project) => project.name.value}
      to={(project) => `/projects/${project.id}`}
      avatar={(project) => <SensitivityIcon value={project.sensitivity} />}
    />
  ) : (
    // The grid (and its `useDataGridSource`) must only mount on desktop.
    <PartnerProjectsGrid />
  );
};

const PartnerProjectsGrid = () => {
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

const PartnerProjectColumns = insertProjectColumnAfterField(
  // The helper only requires `row` to be _at least_ a `Project`; the superset
  // constraint is enforced below.
  ProjectColumns as Array<GridColDef<PartnerProject>>,
  'status',
  PartnershipTypesColumn
);

// Actually enforce superset constraint here, since we're ignoring above.
const _EnforcePartnerProjectIsSupersetOfProject: Project =
  undefined as unknown as PartnerProject;
