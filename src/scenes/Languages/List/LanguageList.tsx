import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import { times } from 'lodash';
import React, { FC } from 'react';
import { Language } from '../../../api';
import { LanguageListItemCard } from '../../../components/LanguageListItemCard';
import { SortButtonDialog, useSort } from '../../../components/Sort';
import { useLanguagesQuery } from './languages.generated';
import { LanguageSortOptions } from './LanguageSortOptions';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    flex: 1,
    overflowY: 'scroll',
    padding: spacing(4),
  },
  options: {
    margin: spacing(3, 0),
  },
}));

export const LanguageList: FC = () => {
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
    <div className={classes.root}>
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
        {data?.languages.total} Languages
      </Typography>
      <Grid container direction="column" spacing={2}>
        {loading
          ? times(10).map((index) => (
              <Grid item key={index}>
                <LanguageListItemCard />
              </Grid>
            ))
          : data?.languages.items.map((item) => (
              <Grid item key={item.id}>
                <LanguageListItemCard language={item} />
              </Grid>
            ))}
      </Grid>
    </div>
  );
};
