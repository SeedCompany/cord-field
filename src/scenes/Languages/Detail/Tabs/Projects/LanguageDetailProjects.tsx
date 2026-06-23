import { DataGridPro as DataGrid } from '@mui/x-data-grid-pro';
import { useParams } from 'react-router-dom';
import { useIsMobile } from '~/common';
import {
  DefaultDataGridStyles,
  flexLayout,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSlots,
  useDataGridSource,
} from '~/components/Grid';
import { EntityList as LanguagesProjectsList } from '~/components/List';
import {
  ProjectColumns,
  ProjectInitialState,
  ProjectToolbar,
} from '~/components/ProjectDataGrid';
import { SensitivityIcon } from '~/components/Sensitivity';
import { TabPanelContent } from '~/components/Tabs';
import {
  type LanguageProjectDataGridRowFragment as LanguageProject,
  LanguageProjectsDocument,
} from './LanguageProjects.graphql';

export const LanguageDetailProjects = () => {
  const { languageId = '' } = useParams();
  const isMobile = useIsMobile();

  return isMobile ? (
    <LanguagesProjectsList
      query={LanguageProjectsDocument}
      listAt={(data) => data.language.projects}
      variables={{ languageId }}
      columns={ProjectColumns}
      sortDefault={{ field: 'name', direction: 'ASC' }}
      defaultSecondaryField="primaryLocation.name"
      primary={(project) => project.name.value}
      to={(project) => `/projects/${project.id}`}
      avatar={(project) => <SensitivityIcon value={project.sensitivity} />}
    />
  ) : (
    // The grid (and its `useDataGridSource`) must only mount on desktop.
    <LanguageProjectsGrid />
  );
};

const LanguageProjectsGrid = () => {
  const { languageId = '' } = useParams();

  const [props] = useDataGridSource({
    query: LanguageProjectsDocument,
    variables: { languageId },
    listAt: 'language.projects',
    initialInput: {
      sort: 'name',
    },
  });

  const { slots, slotProps } = useDataGridSlots(props, {
    slots: { toolbar: ProjectToolbar },
  });

  return (
    <TabPanelContent>
      <DataGrid<LanguageProject>
        {...DefaultDataGridStyles}
        {...props}
        slots={slots}
        slotProps={slotProps}
        columns={ProjectColumns}
        initialState={ProjectInitialState}
        headerFilters
        hideFooter
        sx={[flexLayout, noHeaderFilterButtons, noFooter]}
      />
    </TabPanelContent>
  );
};
