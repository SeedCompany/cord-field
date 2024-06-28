import { DataGridPro as DataGrid, GridLocaleText } from '@mui/x-data-grid-pro';
import { useParams } from 'react-router-dom';
import { useDataGridSource } from '~/components/Grid';
import {
  ProjectDataGridRowFragment as Project,
  ProjectColumns,
} from '~/components/ProjectDataGrid';
import { PartnerTabContainer } from '../PartnerTabContainer';
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
    <PartnerTabContainer
      sx={{
        flex: 1,
        p: 0,
        maxWidth: '100cqw',
        width: 'min-content',
        // idk why -50, MUI pushes down past container
        maxHeight: 'calc(100cqh - 50px)',
      }}
    >
      <DataGrid<Project>
        density="compact"
        disableColumnMenu
        {...props}
        columns={ProjectColumns}
        disableRowSelectionOnClick
        localeText={localeText}
      />
    </PartnerTabContainer>
  );
};

const localeText: Partial<GridLocaleText> = {
  noRowsLabel: 'This partner is not engaged in any projects',
};
