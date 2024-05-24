import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useTable } from '~/hooks';
import { PartnerDetailProjectsTable } from './PartnerDetailProjectsTable';
import { PartnerProjectsDocument } from './PartnerProjects.graphql';

export const PartnerDetailProjects = () => {
  const { partnerId = '' } = useParams();

  const [props, { list: projects }] = useTable({
    query: PartnerProjectsDocument,
    variables: { id: partnerId },
    listAt: 'partner.projects',
    initialInput: {
      sort: 'name',
      count: 20,
    },
  });

  return projects?.canRead === false ? (
    <Typography p={3}>
      You don't have permission to see the projects this partner is engaged in
    </Typography>
  ) : (
    <PartnerDetailProjectsTable {...props} sx={{ border: 'none', pt: 1 }} />
  );
};
