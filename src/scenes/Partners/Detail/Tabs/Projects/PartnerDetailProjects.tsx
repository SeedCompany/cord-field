import { useQuery } from '@apollo/client';
import { Typography } from '@mui/material';
import { GridSortItem } from '@mui/x-data-grid';
import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { isNetworkRequestInFlight } from '~/api';
import { upperCase } from '~/common';
import { PartnerDetailProjectsTable } from './PartnerDetailProjectsTable';
import { PartnerProjectsDocument } from './PartnerProjects.graphql';

export const PartnerDetailProjects = () => {
  const { partnerId = '' } = useParams();

  const pageSize = 25;
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<GridSortItem>({
    field: 'name',
    sort: 'asc',
  });

  const { data, networkStatus } = useQuery(PartnerProjectsDocument, {
    variables: {
      id: partnerId,
      input: {
        count: pageSize,
        page: page + 1,
        sort: sort.field,
        order: upperCase(sort.sort!),
      },
    },
    notifyOnNetworkStatusChange: true,
  });
  const projects = data?.partner.projects;

  // Keep total count between page fetches
  const total = useRef(0);
  if (projects?.total) {
    total.current = projects.total;
  }

  return projects?.canRead === false ? (
    <Typography p={3}>
      You don't have permission to see the projects this partner is engaged in
    </Typography>
  ) : (
    <PartnerDetailProjectsTable
      rows={projects?.items ?? []}
      rowCount={total.current}
      loading={isNetworkRequestInFlight(networkStatus)}
      page={page}
      onPageChange={setPage}
      sortModel={[sort]}
      onSortModelChange={([next]) => {
        setSort(next!);
        setPage(0);
      }}
      pageSize={pageSize}
      rowsPerPageOptions={[pageSize]}
      sortingOrder={['desc', 'asc']} // no unsorted
      paginationMode="server"
      sortingMode="server"
      sx={{ border: 'none', pt: 1 }}
    />
  );
};
