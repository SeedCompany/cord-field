import { Grid, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { User } from '../../../api';
import { ContentContainer } from '../../../components/ContentContainer';
import { SortButtonDialog, useSort } from '../../../components/Sort';
import { UserListItemCardLandscape as UserCard } from '../../../components/UserListItemCard';
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
    <ContentContainer>
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

      <Grid container justify="space-between">
        <Grid item>
          <Typography variant="h3" paragraph>
            {loading ? (
              <Skeleton variant="text" width="3ch" />
            ) : (
              <>{data?.users.total} People</>
            )}
          </Typography>
        </Grid>
      </Grid>
      {listOrPlaceholders(data?.users.items, 5).map((item, index) => (
        <UserCard
          key={item?.id ?? index}
          user={item}
          className={classes.projectItem}
        />
      ))}
    </ContentContainer>
  );
};
