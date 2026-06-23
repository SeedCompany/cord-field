import { useQuery } from '@apollo/client';
import {
  Build,
  FolderOpen,
  MenuBook,
  Movie,
  Palette,
  Person,
  Public,
  Search,
  Translate,
} from '@mui/icons-material';
import { Box, List, Stack } from '@mui/material';
import { startCase } from 'lodash';
import { ReactElement } from 'react';
import { Helmet } from 'react-helmet-async';
import { PeopleJoinedIcon } from '~/components/Icons';
import { EntityListItem } from '~/components/List';
import { Error } from '../../components/Error';
import { Navigate } from '../../components/Routing';
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
          'FieldRegion',
          'FieldZone',
          'Tool',
        ],
      },
    },
  });

  return (
    <Box
      sx={(theme) => ({
        flex: 1,
        overflowY: 'auto',
        padding: { xs: theme.spacing(2), md: theme.spacing(4) },
      })}
    >
      <Helmet title={`${query} - Search`} />
      <Stack
        component="main"
        sx={{
          maxWidth: 600,
        }}
      >
        {error ? (
          <Error error={error}>Error loading search results</Error>
        ) : (
          <List disablePadding component="div">
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <EntityListItem key={index} loading icon={<Search />} />
              ))
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
          </List>
        )}
      </Stack>
    </Box>
  );
};

const displayItem = (
  item: SearchResult
): [exact: string | ReactElement, row: ReactElement] | ReactElement | null => {
  /* eslint-disable react/jsx-key -- type is tuple not array */
  switch (item.__typename) {
    case 'MomentumTranslationProject':
    case 'MultiplicationTranslationProject':
    case 'InternshipProject':
      return [
        <Navigate key={item.id} replace to={`/projects/${item.id}`} />,
        <EntityListItem
          key={item.id}
          to={`/projects/${item.id}`}
          icon={<FolderOpen />}
          primary={item.name.value}
          secondary={item.primaryLocation.value?.name.value}
        />,
      ];
    case 'Language':
      return [
        <Navigate key={item.id} replace to={`/languages/${item.id}`} />,
        <EntityListItem
          key={item.id}
          to={`/languages/${item.id}`}
          icon={<Translate />}
          primary={item.displayName.value}
          secondary={item.ethnologue.code.value}
        />,
      ];
    case 'User':
      return [
        <Navigate key={item.id} replace to={`/users/${item.id}`} />,
        <EntityListItem
          key={item.id}
          to={`/users/${item.id}`}
          icon={<Person />}
          primary={[item.displayFirstName.value, item.displayLastName.value]
            .filter(Boolean)
            .join(' ')}
          secondary={item.title.value}
        />,
      ];
    case 'Partner':
      return [
        <Navigate key={item.id} replace to={`/partners/${item.id}`} />,
        <EntityListItem
          key={item.id}
          to={`/partners/${item.id}`}
          icon={<PeopleJoinedIcon />}
          primary={
            item.organization.value?.acronym.value ??
            item.organization.value?.name.value
          }
          secondary={
            item.organization.value?.acronym.value
              ? item.organization.value.name.value
              : undefined
          }
        />,
      ];
    case 'Location':
      return [
        <Navigate key={item.id} replace to={`/locations/${item.id}`} />,
        <EntityListItem
          key={item.id}
          to={`/locations/${item.id}`}
          icon={<Public />}
          primary={item.name.value}
          secondary={item.locationType.value}
        />,
      ];
    case 'FieldRegion':
      return [
        <Navigate key={item.id} replace to={`/field-regions/${item.id}`} />,
        <EntityListItem
          key={item.id}
          to={`/field-regions/${item.id}`}
          icon={<Public />}
          primary={item.name.value}
          secondary={item.director.value?.fullName}
        />,
      ];
    case 'FieldZone':
      return [
        <Navigate key={item.id} replace to={`/field-zones/${item.id}`} />,
        <EntityListItem
          key={item.id}
          to={`/field-zones/${item.id}`}
          icon={<Public />}
          primary={item.name.value}
          secondary={item.director.value?.fullName}
        />,
      ];
    case 'Tool':
      return [
        <Navigate key={item.id} replace to={`/tools/${item.id}`} />,
        <EntityListItem
          key={item.id}
          to={`/tools/${item.id}`}
          icon={<Build />}
          primary={item.name.value}
          secondary={item.description.value}
        />,
      ];
    case 'Film':
    case 'Story':
    case 'EthnoArt':
      return (
        <EntityListItem
          key={item.id}
          icon={
            item.__typename === 'Film' ? (
              <Movie />
            ) : item.__typename === 'Story' ? (
              <MenuBook />
            ) : (
              <Palette />
            )
          }
          primary={item.name.value}
          secondary={startCase(item.__typename)}
        />
      );
    default:
      console.error(`Unknown type ${item.__typename} returned from search`);
      return null;
  }
  /* eslint-enable react/jsx-key */
};
