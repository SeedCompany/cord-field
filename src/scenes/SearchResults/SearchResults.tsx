import { useQuery } from '@apollo/client';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { startCase } from 'lodash';
import { ReactElement } from 'react';
import { Helmet } from 'react-helmet-async';
import { Error } from '../../components/Error';
import { LanguageListItemCard } from '../../components/LanguageListItemCard';
import { LocationCard } from '../../components/LocationCard';
import { PartnerListItemCard } from '../../components/PartnerListItemCard';
import { ProjectListItemCard } from '../../components/ProjectListItemCard';
import { Navigate } from '../../components/Routing';
import { UserListItemCardLandscape } from '../../components/UserListItemCard';
import { useSearch } from '../Root/Header/HeaderSearch';
import {
  SearchDocument,
  SearchResultItemFragment as SearchResult,
} from './Search.graphql';

export const SearchResults = () => {
  const [{ q: query }] = useSearch();
  const { data, error, loading } = useQuery(SearchDocument, {
    variables: {
      input: {
        query: query ?? '',
        type: [
          'InternshipProject',
          'TranslationProject',
          'Language',
          'User',
          'Partner',
          'Location',
          'Film',
          'Story',
        ],
      },
    },
  });

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        padding: 4,
      }}
    >
      <Helmet title={`${query} - Search`} />
      <Box
        component="main"
        sx={(theme) => ({
          maxWidth: theme.breakpoints.values.sm,
          '& > *': {
            marginBottom: 2,
          },
        })}
      >
        {error ? (
          <Error error={error}>Error loading search results</Error>
        ) : loading ? (
          <>
            <ProjectListItemCard />
            <UserListItemCardLandscape />
            <PartnerListItemCard />
            <ProjectListItemCard />
            <PartnerListItemCard />
            <UserListItemCardLandscape />
          </>
        ) : data && data.search.items.length > 0 ? (
          data.search.items.map((item, _, list) => {
            const res = displayItem(item);
            return Array.isArray(res)
              ? list.length === 1
                ? res[0]
                : res[1]
              : res;
          })
        ) : (
          <Error show>No results found</Error>
        )}
      </Box>
    </Box>
  );
};

const displayItem = (
  item: SearchResult
): [exact: string | ReactElement, card: ReactElement] | ReactElement | null => {
  /* eslint-disable react/jsx-key -- type is tuple not array */
  switch (item.__typename) {
    case 'InternshipProject':
    case 'TranslationProject':
      return [
        <Navigate replace to={`/projects/${item.id}`} />,
        <ProjectListItemCard key={item.id} project={item} />,
      ];
    case 'Language':
      return [
        <Navigate replace to={`/languages/${item.id}`} />,
        <LanguageListItemCard key={item.id} language={item} />,
      ];
    case 'User':
      return [
        <Navigate replace to={`/users/${item.id}`} />,
        <UserListItemCardLandscape key={item.id} user={item} />,
      ];
    case 'Partner':
      return [
        <Navigate replace to={`/partners/${item.id}`} />,
        <PartnerListItemCard key={item.id} partner={item} />,
      ];
    case 'Location':
      return [
        <Navigate replace to={`/locations/${item.id}`} />,
        <LocationCard key={item.id} location={item} />,
      ];
    case 'Film':
    case 'Story':
    case 'EthnoArt':
      return <PlaceholderCard key={item.id} item={item} />;
    default:
      console.error(`Unknown type ${item.__typename} returned from search`);
      return null;
  }
  /* eslint-enable react/jsx-key */
};

const PlaceholderCard = ({
  item,
}: {
  item: Extract<SearchResult, { name: unknown }>;
}) => (
  <Card>
    <CardContent>
      <Typography variant="h4">{startCase(item.__typename)}</Typography>
      <Typography>{item.name.value}</Typography>
    </CardContent>
  </Card>
);
