import { ApolloClient, useQuery } from '@apollo/client';
import { Box, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { cmpBy, simpleSwitch } from '@seedcompany/common';
import { uniqBy } from 'lodash';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { isNetworkRequestInFlight } from '~/api';
import { Order, Sensitivity } from '~/api/schema/schema.graphql';
import { lowerCase, upperCase } from '~/common';
import { SensitivityIcon } from '~/components/Sensitivity';
import { PaginatedTable } from '~/components/Tables';
import {
  PartnerDetailLanguagesTableListItemFragment as Language,
  PartnerLanguagesDocument,
  PartnerLanguagesQuery,
} from './PartnerLanguages.graphql';

const initialInput = {
  count: 20,
  page: 1,
  sort: 'name',
  order: 'ASC' as Order,
};

export const PartnerDetailLanguages = () => {
  const { partnerId = '' } = useParams();

  const [input, setInput] = useState(initialInput);

  const { data: allPages } = useQuery(PartnerLanguagesDocument, {
    variables: { id: partnerId },
    fetchPolicy: 'cache-only',
  });
  const isCacheComplete =
    allPages &&
    allPages.partner.languages.total ===
      allPages.partner.languages.items.length;

  const {
    data: currentPage,
    networkStatus,
    client,
  } = useQuery(PartnerLanguagesDocument, {
    skip: isCacheComplete,
    variables: { id: partnerId, input },
    notifyOnNetworkStatusChange: true,
    onCompleted: (nextPage) => {
      addToAllPagesCacheEntry(client, partnerId, nextPage);
    },
  });

  const languages = (isCacheComplete ? allPages : currentPage)?.partner
    .languages;

  const total =
    allPages?.partner.languages.total ??
    currentPage?.partner.languages.total ??
    0;

  const columns: Array<GridColDef<Language>> = [
    {
      headerName: 'Language Name',
      field: 'name',
      flex: 2,
      valueGetter: ({ value }) => value.value,
      renderCell: ({ value }) => (
        <Box component="span" color="primary.main">
          {value}
        </Box>
      ),
    },
    {
      headerName: 'Register of Dialects Code',
      field: 'registryOfDialectsCode',
      flex: 1,
      valueGetter: ({ value }) => value.value,
    },
    {
      headerName: 'Sensitivity',
      field: 'sensitivity',
      flex: 1,
      sortComparator: cmpBy<Sensitivity>((v) =>
        simpleSwitch(v, { Low: 0, Medium: 1, High: 2 })
      ),
      renderCell: ({ value }) => (
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          textTransform="uppercase"
        >
          <SensitivityIcon value={value} disableTooltip />
          {value}
        </Box>
      ),
    },
  ];

  return languages?.canRead === false ? (
    <Typography p={3}>
      You don't have permission to see the projects this partner is engaged in
    </Typography>
  ) : (
    <PaginatedTable<Language>
      columns={columns}
      rows={languages?.items ?? []}
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
  nextPage: PartnerLanguagesQuery
) {
  client.cache.updateQuery(
    {
      query: PartnerLanguagesDocument,
      variables: { id: partnerId },
    },
    (prev) => {
      if (
        prev &&
        prev.partner.languages.items.length === nextPage.partner.languages.total
      ) {
        return undefined; // no change
      }
      const mergedList = uniqBy(
        [
          ...(prev?.partner.languages.items ?? []),
          ...nextPage.partner.languages.items,
        ],
        (project) => project.id
      );
      return {
        partner: {
          ...nextPage.partner,
          projects: {
            ...nextPage.partner.languages,
            items: mergedList,
          },
        },
      };
    }
  );
}
