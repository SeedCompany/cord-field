import { Grid, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { User } from '../../../api';
import { useNumberFormatter } from '../../../components/Formatters';
import { ContentContainer } from '../../../components/Layout';
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
  listContainer: {
    overflow: 'auto',
    marginLeft: spacing(-2),
    padding: spacing(2),
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
  const formatNumber = useNumberFormatter();

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

      <Typography variant="h3" paragraph>
        {loading ? (
          <Skeleton width="9ch" />
        ) : (
          <>{formatNumber(data?.users.total)} People</>
        )}
      </Typography>
      <div className={classes.listContainer}>
        {listOrPlaceholders(data?.users.items, 10).map((item, index) => (
          <UserCard
            key={item?.id ?? index}
            user={item}
            className={classes.projectItem}
          />
        ))}
      </div>
    </ContentContainer>
  );
};
