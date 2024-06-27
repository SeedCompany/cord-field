import { GridLocaleText } from '@mui/x-data-grid-pro';
import { useParams } from 'react-router-dom';
import { ProjectList } from '~/components/ProjectList/ProjectList';
import { TabPanelContentContainer } from '~/components/Tabs';
import { useTable } from '~/hooks';
import { PartnerProjectsDocument } from './PartnerProjects.graphql';

export const PartnerDetailProjects = () => {
  const { partnerId = '' } = useParams();

  const [props] = useTable({
    query: PartnerProjectsDocument,
    variables: { id: partnerId },
    listAt: 'partner.projects',
    initialInput: {
      sort: 'name',
      count: 20,
    },
  });

  return (
    <TabPanelContentContainer>
      <ProjectList
        tableProps={{ ...props, localeText }}
        initialState={{
          pinnedColumns: {
            left: ['name'],
          },
        }}
      />
    </TabPanelContentContainer>
  );
};

const localeText: Partial<GridLocaleText> = {
  noRowsLabel: 'This partner is not engaged in any projects',
};
