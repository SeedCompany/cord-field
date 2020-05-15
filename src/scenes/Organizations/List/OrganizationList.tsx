import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import { times } from 'lodash';
import React, { FC } from 'react';
import { Organization } from '../../../api';
import { OrganizationListItemCard } from '../../../components/OrganizationListItemCard';
import { SortButtonDialog, useSort } from '../../../components/Sort';
import { useOrganizationsQuery } from './Organizations.generated';
import { OrganizationSortOptions } from './OrganizationSortOptions';

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

export const OrganizationList: FC = () => {
  const sort = useSort<Organization>();
  const { loading, data } = useOrganizationsQuery({
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
        My Organizations
      </Typography>
      <Grid container spacing={1} className={classes.options}>
        <Grid item>
          <SortButtonDialog {...sort}>
            <OrganizationSortOptions />
          </SortButtonDialog>
        </Grid>
        <Grid item>
          <Button variant="outlined">Filter Options</Button>
        </Grid>
      </Grid>
      <Typography variant="h3" paragraph>
        {data?.organizations.total} Organizations
      </Typography>
      <Grid container direction="column" spacing={2}>
        {loading
          ? times(5).map((index) => (
              <Grid item key={index}>
                <OrganizationListItemCard />
              </Grid>
            ))
          : data?.organizations.items.map((item) => (
              <Grid item key={item.id}>
                <OrganizationListItemCard organization={item} />
              </Grid>
            ))}
      </Grid>
    </div>
  );
};
