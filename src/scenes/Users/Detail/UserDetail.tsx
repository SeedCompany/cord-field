import { useQuery } from '@apollo/client';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { PartialDeep } from 'type-fest';
import { ToggleCommentsButton } from '~/components/Comments/ToggleCommentButton';
import { Error } from '~/components/Error';
import { Redacted } from '~/components/Redacted';
import { Tab, TabsContainer } from '~/components/Tabs';
import { TogglePinButton } from '~/components/TogglePinButton';
import { EnumParam, makeQueryHandler, withDefault } from '~/hooks';
import { useComments } from '../../../components/Comments/CommentsContext';
import { UsersQueryVariables } from '../List/users.graphql';
import { ImpersonationToggle } from './ImpersonationToggle';
import { AssignOrganizationToUserFormFragment } from './Tabs/Partners/AssignOrgToUserForm/AssignOrgToUser.graphql';
import { UserDetailPartners } from './Tabs/Partners/UserDetailPartners';
import { UserDetailProfile } from './Tabs/Profile/UserDetailProfile';
import { UserDetailProjects } from './Tabs/Projects/UserDetailProjects';
import { UserDocument } from './UserDetail.graphql';

const useUserDetailsFilters = makeQueryHandler({
  tab: withDefault(EnumParam(['profile', 'projects', 'partners']), 'profile'),
});

export const UserDetail = () => {
  const { userId = '' } = useParams();
  const { data, error } = useQuery(UserDocument, {
    variables: { userId },
  });
  useComments(userId);
  const [filters, setFilters] = useUserDetailsFilters();
  const user = data?.user;

  return (
    <Stack
      component="main"
      sx={{
        overflowY: 'auto',
        p: 4,
        gap: 3,
        flex: 1,
        maxWidth: (theme) => theme.breakpoints.values.xl,
      }}
    >
      <Helmet title={user?.fullName ?? undefined} />

      <Error error={error}>
        {{
          NotFound: 'Could not find user',
          Default: 'Error loading user',
        }}
      </Error>
      {!error && (
        <>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                mr: 2,
                lineHeight: 'inherit',
              }}
            >
              {!user ? (
                <Skeleton width="20ch" />
              ) : (
                user.fullName ?? (
                  <Redacted
                    info="You don't have permission to view this person's name"
                    width="20ch"
                  />
                )
              )}
            </Typography>
            <TogglePinButton
              object={user}
              label="Person"
              listId="users"
              listFilter={(args: PartialDeep<UsersQueryVariables>) =>
                args.input?.filter?.pinned ?? false
              }
            />
            <ToggleCommentsButton loading={!user} />
            <ImpersonationToggle user={user} />
          </Box>
          <TabsContainer>
            <TabContext value={filters.tab}>
              <TabList
                onChange={(_e, tab) => setFilters({ ...filters, tab })}
                aria-label="user navigation tabs"
                variant="scrollable"
              >
                <Tab label="Profile" value="profile" />
                <Tab label="Projects" value="projects" />
                <Tab label="Partners" value="partners" />
              </TabList>
              <TabPanel value="profile">
                {user && <UserDetailProfile user={user} />}
              </TabPanel>
              <TabPanel value="projects">
                <UserDetailProjects />
              </TabPanel>
              <TabPanel value="partners">
                {user && (
                  <UserDetailPartners
                    user={{ ...(user as AssignOrganizationToUserFormFragment) }}
                  />
                )}
              </TabPanel>
            </TabContext>
          </TabsContainer>
        </>
      )}
    </Stack>
  );
};
