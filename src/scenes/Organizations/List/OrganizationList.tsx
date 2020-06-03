import { Grid, makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';
import { Organization } from '../../../api';
import { OrganizationListItemCard } from '../../../components/OrganizationListItemCard';
import { SortButtonDialog, useSort } from '../../../components/Sort';
import { listOrPlaceholders } from '../../../util';
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
  item: {
    marginBottom: spacing(2),
  },
}));

export const OrganizationList: FC = () => {
  const sort = useSort<Organization>();
  const { data } = useOrganizationsQuery({
    variables: {
      input: {
        ...sort.value,
      },
    },
  });
  const items = data?.organizations.items;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h2" paragraph>
        Partners
      </Typography>
      <Grid container spacing={1} className={classes.options}>
        <Grid item>
          <SortButtonDialog {...sort}>
            <OrganizationSortOptions />
          </SortButtonDialog>
        </Grid>
      </Grid>
      <Typography variant="h3" paragraph>
        {data?.organizations.total} Partners
      </Typography>
      {listOrPlaceholders(items, 15).map((item, index) => (
        <OrganizationListItemCard
          key={item?.id ?? index}
          organization={item}
          className={classes.item}
        />
      ))}
    </div>
  );
};
