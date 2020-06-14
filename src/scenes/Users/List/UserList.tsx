import { Button, Grid, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { FC, useState } from 'react';
import { User } from '../../../api';
import { ContentContainer } from '../../../components/ContentContainer';
import { SortButtonDialog, useSort } from '../../../components/Sort';
import {
  UserListItemCardLandscape as ProjectUserCard,
  UserListItemCardPortrait as UserCard,
} from '../../../components/UserListItemCard';
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

const MOCK_PROJECT_USERS = [
  {
    id: '123456',
    avatarLetters: 'AR',
    project: {
      name: 'Labore People Group',
      location: 'Mandoria, Asia',
    },
    activeProjects: 6,
  },
  {
    id: '234567',
    avatarLetters: 'TD',
    project: {
      name: 'Pei Tribe',
      location: 'Papua New Guinea, Oceania',
    },
    activeProjects: 4,
  },
  {
    id: '345678',
    avatarLetters: 'AN',
    project: {
      name: 'Labore People Group',
      location: 'Mandoria, Asia',
    },
    activeProjects: 2,
  },
  {
    id: '456789',
    avatarLetters: 'BN',
    project: {
      name: 'Pei Tribe',
      location: 'Papua New Guinea, Oceania',
    },
    activeProjects: 5,
  },
];

export const UserList: FC = () => {
  const [usersView, setUsersView] = useState<'all' | 'projects'>('projects');
  const isAllUsersView = usersView === 'all';
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
        <Grid item>
          <Typography variant="caption" paragraph>
            {loading ? (
              <Skeleton variant="text" width="3ch" />
            ) : (
              <Button
                onClick={() =>
                  setUsersView(isAllUsersView ? 'projects' : 'all')
                }
              >
                {isAllUsersView ? 'My Projects Only' : 'See All'}
              </Button>
            )}
          </Typography>
        </Grid>
      </Grid>
      {isAllUsersView ? (
        <Grid container spacing={3}>
          {listOrPlaceholders(data?.users.items, 5).map((item, index) => (
            <Grid item key={item?.id ?? index} xs={12} md={6} lg={4} xl={3}>
              <UserCard user={item} className={classes.projectItem} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {MOCK_PROJECT_USERS.map((user) => (
            <Grid item key={user.id}>
              <ProjectUserCard user={user} />
            </Grid>
          ))}
        </Grid>
      )}
    </ContentContainer>
  );
};
