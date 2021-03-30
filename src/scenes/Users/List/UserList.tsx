import { Grid, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { User } from '../../../api';
import { useNumberFormatter } from '../../../components/Formatters';
import { ContentContainer } from '../../../components/Layout';
import { List, useListQuery } from '../../../components/List';
import { SortButtonDialog, useSort } from '../../../components/Sort';
import { UserListItemCardLandscape as UserCard } from '../../../components/UserListItemCard';
import { UsersDocument } from './users.generated';
import { UserSortOptions } from './UserSortOptions';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  options: {
    margin: spacing(3, 0),
  },
  items: {
    maxWidth: breakpoints.values.sm,
  },
}));

export const UserList: FC = () => {
  const sort = useSort<User>();
  const list = useListQuery(UsersDocument, {
    listAt: (data) => data.users,
    variables: {
      input: sort.value,
    },
  });

  const classes = useStyles();
  const formatNumber = useNumberFormatter();

  return (
    <ContentContainer>
      <Helmet title="People" />
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
        {list.data ? (
          <>{formatNumber(list.data.total)} People</>
        ) : (
          <Skeleton width="9ch" />
        )}
      </Typography>
      <List
        {...list}
        classes={{ container: classes.items }}
        renderItem={(item) => <UserCard user={item} />}
        renderSkeleton={<UserCard />}
        skeletonCount={10}
      />
    </ContentContainer>
  );
};
