import { DataGridPro as DataGrid, GridLocaleText } from '@mui/x-data-grid-pro';
import { useParams } from 'react-router-dom';
import { useDataGridSource } from '~/components/Grid';
import {
  ProjectDataGridRowFragment as Project,
  ProjectColumns,
} from '~/components/ProjectDataGrid';
import { TabPanelContent } from '~/components/Tabs';
import { PartnerProjectsDocument } from './PartnerProjects.graphql';

export const PartnerDetailProjects = () => {
  const { partnerId = '' } = useParams();

  const [props] = useDataGridSource({
    query: PartnerProjectsDocument,
    variables: { id: partnerId },
    listAt: 'partner.projects',
    initialInput: {
      sort: 'name',
      count: 20,
    },
  });

  return (
    <TabPanelContent>
      <DataGrid<Project>
        density="compact"
        disableColumnMenu
        {...props}
        columns={ProjectColumns}
        disableRowSelectionOnClick
        localeText={localeText}
      />
    </TabPanelContent>
  );
};

const localeText: Partial<GridLocaleText> = {
  noRowsLabel: 'This partner is not engaged in any projects',
};
