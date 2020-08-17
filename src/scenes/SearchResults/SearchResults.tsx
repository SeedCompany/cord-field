import { Card, makeStyles, Typography } from '@material-ui/core';
import { FC, useEffect } from 'react';
import * as React from 'react';
import { LanguageListItemCard } from '../../components/LanguageListItemCard';
import { OrganizationListItemCard } from '../../components/OrganizationListItemCard';
import { ProjectListItemCard } from '../../components/ProjectListItemCard';
import { UserListItemCardLandscape } from '../../components/UserListItemCard';
import { useSearch } from '../Root/Header/HeaderSearch';
import { SearchQuery, useSearchQuery } from './Search.generated';

const useStyles = makeStyles(({ spacing }) => ({
  searchResults: {
    padding: spacing(3),
    '& > *': {
      marginBottom: spacing(2),
    },
  },
}));

const PlaceholderCard: FC<{
  id: string;
  header: string;
  value: string | null | undefined;
}> = ({ id, header, value }) => {
  return (
    <Card key={id}>
      <Typography variant="h4">{header}</Typography>
      <Typography>{value}</Typography>
    </Card>
  );
};

export const SearchResults: FC = () => {
  const [searchParams, setSearchParams] = useSearch();
  const searchValue = searchParams.searchValue ?? '';
  const classes = useStyles();

  useEffect(() => {
    return () => {
      setSearchParams({ searchValue: '' });
    };
  }, [setSearchParams]);

  const { data, error, loading } = useSearchQuery({
    variables: {
      input: { query: searchValue },
    },
  });

  const displayItems = (data: SearchQuery | undefined, loading: boolean) => {
    const items = data?.search.items;

    if (loading) {
      return <Typography>Loading Searching Results</Typography>;
    } else if (items && items.length > 0) {
      return items.map((item) => {
        if (item.__typename === 'Country') {
          return '';
        } else if (
          item.__typename === 'TranslationProject' ||
          item.__typename === 'InternshipProject'
        ) {
          return <ProjectListItemCard key={item.id} project={item} />;
        } else if (item.__typename === 'Language') {
          return <LanguageListItemCard key={item.id} language={item} />;
        } else if (item.__typename === 'Organization') {
          return <OrganizationListItemCard key={item.id} organization={item} />;
        } else if (item.__typename === 'Region') {
          return (
            <PlaceholderCard
              id={item.id}
              header={'Region'}
              value={item.name.value}
            />
          );
        } else if (item.__typename === 'User') {
          return <UserListItemCardLandscape key={item.id} user={item} />;
        } else if (item.__typename === 'Zone') {
          return (
            <PlaceholderCard
              id={item.id}
              header={'Zone'}
              value={item.name.value}
            />
          );
        } else if (item.__typename === 'Film') {
          return (
            <PlaceholderCard
              id={item.id}
              header={'Film'}
              value={item.name.value}
            />
          );
        } else if (item.__typename === 'Story') {
          return (
            <PlaceholderCard
              id={item.id}
              header={'Story'}
              value={item.name.value}
            />
          );
        } else if (item.__typename === 'LiteracyMaterial') {
          return (
            <PlaceholderCard
              id={item.id}
              header={'Literacy Material'}
              value={item.name.value}
            />
          );
        } else if (item.__typename === 'Song') {
          return (
            <PlaceholderCard
              id={item.id}
              header={'Song'}
              value={item.name.value}
            />
          );
        } else {
          console.error(`Unknown type ${item.__typename} returned from search`);
          return '';
        }
      });
    } else {
      return <Typography>No Search Results for "{searchValue}"</Typography>;
    }
  };

  return (
    <div className={classes.searchResults}>
      {error ? (
        <Typography>Error Searching</Typography>
      ) : (
        displayItems(data, loading)
      )}
    </div>
  );
};
