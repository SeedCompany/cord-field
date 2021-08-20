import { useQuery } from '@apollo/client';
import { Card, CardContent, makeStyles, Typography } from '@material-ui/core';
import { startCase } from 'lodash';
import { FC } from 'react';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Error } from '../../components/Error';
import { LanguageListItemCard } from '../../components/LanguageListItemCard';
import { LocationCard } from '../../components/LocationCard';
import { PartnerListItemCard } from '../../components/PartnerListItemCard';
import { ProjectListItemCard } from '../../components/ProjectListItemCard';
import { UserListItemCardLandscape } from '../../components/UserListItemCard';
import { useSearch } from '../Root/Header/HeaderSearch';
import {
  SearchDocument,
  SearchResultItemFragment as SearchResult,
} from './Search.generated';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    flex: 1,
    overflowY: 'auto',
    padding: spacing(4),
  },
  main: {
    maxWidth: breakpoints.values.sm,
    '& > *': {
      marginBottom: spacing(2),
    },
  },
}));

export const SearchResults = () => (
  <Error page show>
    Search is temporarily disabled while performance problems are investigated
  </Error>
);

export const SearchResults2: FC = () => {
  const classes = useStyles();

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
          'LiteracyMaterial',
          'Song',
        ],
      },
    },
  });

  const displayItem = (item: SearchResult) => {
    switch (item.__typename) {
      case 'InternshipProject':
      case 'TranslationProject':
        return <ProjectListItemCard key={item.id} project={item} />;
      case 'Language':
        return <LanguageListItemCard key={item.id} language={item} />;
      case 'User':
        return <UserListItemCardLandscape key={item.id} user={item} />;
      case 'Partner':
        return <PartnerListItemCard key={item.id} partner={item} />;
      case 'Location':
        return <LocationCard key={item.id} location={item} />;
      case 'Film':
      case 'Story':
      case 'LiteracyMaterial':
      case 'Song':
        return <PlaceholderCard key={item.id} item={item} />;
      default:
        console.error(`Unknown type ${item.__typename} returned from search`);
        return null;
    }
  };

  return (
    <div className={classes.root}>
      <Helmet title={`${query} - Search`} />
      <main className={classes.main}>
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
          data.search.items.map(displayItem)
        ) : (
          <Error show>No results found</Error>
        )}
      </main>
    </div>
  );
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
