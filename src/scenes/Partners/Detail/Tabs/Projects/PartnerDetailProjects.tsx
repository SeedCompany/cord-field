import { Box, Typography } from '@mui/material';
import { PartnerDetailsFragment } from '../../PartnerDetail.graphql';
import { PartnerDetailProjectsTable } from './PartnerDetailProjectsTable';

interface Props {
  partner: PartnerDetailsFragment | undefined;
}

export const PartnerDetailProjects = ({ partner }: Props) => {
  const projects = partner?.projects;

  return (
    <Box>
      {projects?.canRead === false ? (
        <Typography color="textSecondary">
          You don't have permission to see the projects this partner is engaged
          in
        </Typography>
      ) : projects?.items.length === 0 ? (
        <Typography color="textSecondary">
          This partner is not engaged in any projects
        </Typography>
      ) : (
        <PartnerDetailProjectsTable
          projects={projects?.items ? projects.items : []}
        />
      )}
    </Box>
  );
};
