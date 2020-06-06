import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';
import { User } from '../../../api';
import { useSort } from '../../../components/Sort';
import { UserListItemCard } from '../../../components/UserListItemCard';
import { listOrPlaceholders } from '../../../util';
import { useUsersQuery } from './users.generated';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    flex: 1,
    overflowY: 'scroll',
    padding: spacing(4),
  },
  options: {
    margin: spacing(3, 0),
  },
  projectItem: {
    marginBottom: spacing(2),
  },
}));

export const UserList: FC = () => {
  const sort = useSort<User>();

  const { data } = useUsersQuery({
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
        My Projects
      </Typography>
      <Grid container spacing={1} className={classes.options}>
        <Grid item>
          <Button variant="outlined">Filter Options</Button>
        </Grid>
      </Grid>
      <Typography variant="h3" paragraph>
        {data?.users.total} Users
      </Typography>
      {listOrPlaceholders(data?.users.items, 5).map((item, index) => (
        <UserListItemCard
          key={item?.id ?? index}
          user={item}
          className={classes.projectItem}
        />
      ))}
    </div>
  );
};
