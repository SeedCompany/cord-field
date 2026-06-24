import { Paper, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useIsMobile } from '~/common';
import { EntityList as UsersList } from '~/components/List';
import { UserColumns } from '~/components/UserDataGrid/UserColumns';
import { UserGrid } from './UserGrid';
import { UsersDocument } from './users.graphql';

export const UserList = () => {
  const isMobile = useIsMobile();
  return (
    <Stack sx={{ flex: 1, padding: { xs: 2, md: 4 }, pt: 2 }}>
      <Helmet title="People" />
      <Stack component="main" sx={{ flex: 1 }}>
        {!isMobile && (
          <Typography variant="h2" paragraph>
            People
          </Typography>
        )}
        {isMobile ? (
          <UsersList
            title="People"
            query={UsersDocument}
            listAt={(data) => data.users}
            columns={UserColumns}
            sortDefault={{ field: 'fullName', direction: 'ASC' }}
            defaultSecondaryField="title"
            primary={(user) => user.fullName}
            to={(user) => `/users/${user.id}`}
          />
        ) : (
          // The grid (and its `useDataGridSource`) must only mount on desktop.
          <Stack sx={{ flex: 1, containerType: 'size' }}>
            <Paper
              sx={{
                flex: 1,
                minHeight: 375,
                maxHeight: '100cqh',
                width: 'min-content',
                maxWidth: '100cqw',
              }}
            >
              <UserGrid />
            </Paper>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
