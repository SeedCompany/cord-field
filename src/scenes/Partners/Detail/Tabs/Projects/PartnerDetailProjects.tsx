import { useQuery } from '@apollo/client';
import { Box, Typography } from '@mui/material';
import { GridSortModel } from '@mui/x-data-grid';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Order } from '~/api/schema/schema.graphql';
import { PartnerDetailProjectsTable } from './PartnerDetailProjectsTable';
import { PartnerProjectsDocument } from './PartnerProjects.graphql';

export const PartnerDetailProjects = () => {
  const { partnerId = '' } = useParams();
  const [page, setPage] = useState<number>(0);
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState<Order>('ASC');
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'name', sort: 'asc' },
  ]);

  const { data } = useQuery(PartnerProjectsDocument, {
    variables: {
      id: partnerId,
      input: {
        count: 25,
        page: page + 1,
        sort: sortField,
        order: sortOrder,
      },
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-first',
  });

  const handleSortModelChange = useCallback((model: GridSortModel) => {
    const { field = 'name', sort = 'ASC' } = model[0] || {};
    const order = sort?.toUpperCase() as Order;
    setSortModel(model);
    setSortField(field);
    setSortOrder(order);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const projects = data?.partner.projects;

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
          totalRows={projects?.total}
          onPageChange={handlePageChange}
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
        />
      )}
    </Box>
  );
};
