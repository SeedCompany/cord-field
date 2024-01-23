import { ApolloClient, useQuery } from '@apollo/client';
import { Typography } from '@mui/material';
import { uniqBy } from 'lodash';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { isNetworkRequestInFlight } from '~/api';
import { Order } from '~/api/schema/schema.graphql';
import { lowerCase, upperCase } from '~/common';
import { PartnerDetailProjectsTable } from './PartnerDetailProjectsTable';
import {
  PartnerProjectsDocument,
  PartnerProjectsQuery,
} from './PartnerProjects.graphql';

const initialInput = {
  count: 20,
  page: 1,
  sort: 'name',
  order: 'ASC' as Order,
};

export const PartnerDetailProjects = () => {
  const { partnerId = '' } = useParams();

  const [input, setInput] = useState(initialInput);

  const { data: allPages } = useQuery(PartnerProjectsDocument, {
    variables: { id: partnerId },
    fetchPolicy: 'cache-only',
  });
  const isCacheComplete =
    allPages &&
    allPages.partner.projects.total === allPages.partner.projects.items.length;

  const {
    data: currentPage,
    networkStatus,
    client,
  } = useQuery(PartnerProjectsDocument, {
    skip: isCacheComplete,
    variables: { id: partnerId, input },
    notifyOnNetworkStatusChange: true,
    onCompleted: (nextPage) => {
      addToAllPagesCacheEntry(client, partnerId, nextPage);
    },
  });

  const projects = (isCacheComplete ? allPages : currentPage)?.partner.projects;
  const total =
    allPages?.partner.projects.total ??
    currentPage?.partner.projects.total ??
    0;

  return projects?.canRead === false ? (
    <Typography p={3}>
      You don't have permission to see the projects this partner is engaged in
    </Typography>
  ) : (
    <PartnerDetailProjectsTable
      rows={projects?.items ?? []}
      rowCount={total}
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
      paginationMode={isCacheComplete ? 'client' : 'server'}
      sortingMode={isCacheComplete ? 'client' : 'server'}
      sx={{ border: 'none', pt: 1 }}
    />
  );
};

function addToAllPagesCacheEntry(
  client: ApolloClient<any>,
  partnerId: string,
  nextPage: PartnerProjectsQuery
) {
  client.cache.updateQuery(
    {
      query: PartnerProjectsDocument,
      variables: { id: partnerId },
    },
    (prev) => {
      if (
        prev &&
        prev.partner.projects.items.length === nextPage.partner.projects.total
      ) {
        return undefined; // no change
      }
      const mergedList = uniqBy(
        [
          ...(prev?.partner.projects.items ?? []),
          ...nextPage.partner.projects.items,
        ],
        (project) => project.id
      );
      return {
        partner: {
          ...nextPage.partner,
          projects: {
            ...nextPage.partner.projects,
            items: mergedList,
          },
        },
      };
    }
  );
}
