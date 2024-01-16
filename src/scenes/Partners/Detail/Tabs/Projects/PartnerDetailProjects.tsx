import { useQuery } from '@apollo/client';
import { Typography } from '@mui/material';
import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { isNetworkRequestInFlight } from '~/api';
import { Order } from '~/api/schema/schema.graphql';
import { lowerCase, upperCase } from '~/common';
import { PartnerDetailProjectsTable } from './PartnerDetailProjectsTable';
import { PartnerProjectsDocument } from './PartnerProjects.graphql';

const initialInput = {
  count: 20,
  page: 1,
  sort: 'name',
  order: 'ASC' as Order,
};

export const PartnerDetailProjects = () => {
  const { partnerId = '' } = useParams();

  const [input, setInput] = useState(initialInput);

  // Keep total count between page fetches
  const total = useRef(0);
  const singlePage = total.current <= input.count;

  const { data, networkStatus } = useQuery(PartnerProjectsDocument, {
    variables: {
      id: partnerId,
      // If only one page, we'll do client side sorting, so skip any input changes as a single query is sufficient.
      // Otherwise, let API handle sorting & pagination.
      input: singlePage ? initialInput : input,
    },
    notifyOnNetworkStatusChange: true,
  });
  const projects = data?.partner.projects;

  if (projects) {
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
      page={input.page - 1}
      sortModel={[{ field: input.sort, sort: lowerCase(input.order) }]}
      onPageChange={(next) => {
        setInput((prev) => ({ ...prev, page: next + 1 }));
      }}
      onSortModelChange={([next]) => {
        setInput((prev) => ({
          ...prev,
          sort: next!.field,
          order: upperCase(next!.sort!),
          page: 1,
        }));
      }}
      pageSize={input.count}
      rowsPerPageOptions={[input.count]}
      sortingOrder={['desc', 'asc']} // no unsorted
      paginationMode="server"
      sortingMode={singlePage ? 'client' : 'server'}
      sx={{ border: 'none', pt: 1 }}
    />
  );
};
