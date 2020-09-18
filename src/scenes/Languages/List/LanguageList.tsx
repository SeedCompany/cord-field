import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { times } from 'lodash';
import React, { FC } from 'react';
import { Language } from '../../../api';
import { useNumberFormatter } from '../../../components/Formatters';
import { LanguageListItemCard } from '../../../components/LanguageListItemCard';
import { ContentContainer } from '../../../components/Layout';
import { ListContainer } from '../../../components/Layout/ListContainer';
import { SortButtonDialog, useSort } from '../../../components/Sort';
import { useLanguagesQuery } from './languages.generated';
import { LanguageSortOptions } from './LanguageSortOptions';

const useStyles = makeStyles(({ spacing }) => ({
  options: {
    margin: spacing(3, 0),
  },
  item: {
    marginBottom: spacing(2),
  },
}));

export const LanguageList: FC = () => {
  const formatNumber = useNumberFormatter();
  const sort = useSort<Language>();

  const { loading, data } = useLanguagesQuery({
    variables: {
      input: {
        ...sort.value,
      },
    },
  });
  const classes = useStyles();

  return (
    <ContentContainer>
      <Typography variant="h2" paragraph>
        Languages
      </Typography>
      <Grid container spacing={1} className={classes.options}>
        <Grid item>
          <SortButtonDialog {...sort}>
            <LanguageSortOptions />
          </SortButtonDialog>
        </Grid>
        <Grid item>
          <Button variant="outlined">Filter Options</Button>
        </Grid>
      </Grid>
      <Typography variant="h3" paragraph>
        {data ? (
          `${formatNumber(data.languages.total)} Languages`
        ) : (
          <Skeleton width="14ch" />
        )}
      </Typography>
      <ListContainer>
        {loading
          ? times(10).map((index) => (
              <LanguageListItemCard key={index} className={classes.item} />
            ))
          : data?.languages.items.map((item) => (
              <LanguageListItemCard
                language={item}
                key={item.id}
                className={classes.item}
              />
            ))}
      </ListContainer>
    </ContentContainer>
  );
};
