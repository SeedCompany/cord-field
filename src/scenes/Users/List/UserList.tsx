import { Grid, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { User } from '../../../api';
import { ListContainer } from '../../../components/ListContainer';
import { SortButtonDialog, useSort } from '../../../components/Sort';
import { UserListItemCard } from '../../../components/UserListItemCard';
import { listOrPlaceholders } from '../../../util';
import { useUsersQuery } from './users.generated';
import { UserSortOptions } from './UserSortOptions';

const useStyles = makeStyles(({ spacing }) => ({
  options: {
    margin: spacing(3, 0),
  },
  projectItem: {
    marginBottom: spacing(2),
  },
}));

export const UserList: FC = () => {
  const sort = useSort<User>();

  const { data, loading } = useUsersQuery({
    variables: {
      input: {
        ...sort.value,
      },
    },
  });
  const classes = useStyles();

  return (
    <ListContainer>
      <Typography variant="h2" paragraph>
        People
      </Typography>
      <Grid container spacing={1} className={classes.options}>
        <Grid item>
          <SortButtonDialog {...sort}>
            <UserSortOptions />
          </SortButtonDialog>
        </Grid>
      </Grid>

      <Typography variant="h3" paragraph>
        {loading ? (
          <Skeleton variant="text" width="3ch" />
        ) : (
          <>{data?.users.total} People</>
        )}
      </Typography>
      <Grid container spacing={3}>
        {listOrPlaceholders(data?.users.items, 5).map((item, index) => (
          <Grid item key={item?.id ?? index} xs={12} md={6} lg={4} xl={3}>
            <UserListItemCard user={item} className={classes.projectItem} />
          </Grid>
        ))}
      </Grid>
    </ListContainer>
  );
};
