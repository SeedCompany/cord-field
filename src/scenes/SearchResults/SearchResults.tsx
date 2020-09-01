import { Card, CardContent, makeStyles, Typography } from '@material-ui/core';
import { startCase } from 'lodash';
import { FC } from 'react';
import * as React from 'react';
import { LanguageListItemCard } from '../../components/LanguageListItemCard';
import { OrganizationListItemCard } from '../../components/OrganizationListItemCard';
import { ProjectListItemCard } from '../../components/ProjectListItemCard';
import { UserListItemCardLandscape } from '../../components/UserListItemCard';
import { useSearch } from '../Root/Header/HeaderSearch';
import {
  SearchResultItemFragment as SearchResult,
  useSearchQuery,
} from './Search.generated';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    flex: 1,
    overflowY: 'scroll',
    padding: spacing(4),
  },
  main: {
    maxWidth: breakpoints.values.sm,
    '& > *': {
      marginBottom: spacing(2),
    },
  },
}));

export const SearchResults: FC = () => {
  const classes = useStyles();

  const [{ q: query }] = useSearch();
  const { data, error, loading } = useSearchQuery({
    variables: {
      input: { query: query ?? '' },
    },
  });

  const displayItem = (item: SearchResult) => {
    switch (item.__typename) {
      case 'InternshipProject':
      case 'TranslationProject':
        return <ProjectListItemCard key={item.id} project={item} />;
      case 'Language':
        return <LanguageListItemCard key={item.id} language={item} />;
      case 'Organization':
        return <OrganizationListItemCard key={item.id} organization={item} />;
      case 'User':
        return <UserListItemCardLandscape key={item.id} user={item} />;
      case 'Country':
      case 'Region':
      case 'Zone':
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
      <main className={classes.main}>
        {error ? (
          <Typography>Error loading results</Typography>
        ) : loading ? (
          <Typography>Loading results</Typography>
        ) : data && data.search.items.length > 0 ? (
          data.search.items.map(displayItem)
        ) : (
          <Typography>No results found</Typography>
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
