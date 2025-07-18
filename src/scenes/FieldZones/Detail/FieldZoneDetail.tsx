import { useQuery } from '@apollo/client';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Tab, TabsContainer } from '~/components/Tabs';
import { EnumParam, makeQueryHandler, withDefault } from '~/hooks';
import { Error } from '../../../components/Error';
import { Redacted } from '../../../components/Redacted';
import { FieldZoneDetailDocument } from './FieldZoneDetail.graphql';
import { FieldZoneProfile } from './Tabs/Profile/FieldZoneProfile';
import { FieldZoneProjects } from './Tabs/Projects/FieldZoneProjects';

const useFieldZoneDetailsFilters = makeQueryHandler({
  tab: withDefault(EnumParam(['profile', 'projects']), 'profile'),
});

export const FieldZoneDetail = () => {
  const { fieldZoneId = '' } = useParams();

  const { data, error } = useQuery(FieldZoneDetailDocument, {
    variables: { fieldZoneId },
  });

  const [filters, setFilters] = useFieldZoneDetailsFilters();

  const fieldZone = data?.fieldZone;

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
      <Error error={error}>
        {{
          NotFound: 'Could not find fieldZone',
          Default: 'Error loading fieldZone',
        }}
      </Error>
      <Helmet title={fieldZone?.name.value ?? undefined} />

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
              {!fieldZone ? (
                <Skeleton width="20ch" />
              ) : (
                fieldZone.name.value ?? (
                  <Redacted
                    info="You don't have permission to view this field zone's name"
                    width="20ch"
                  />
                )
              )}
            </Typography>
          </Box>
          <TabsContainer>
            <TabContext value={filters.tab}>
              <TabList
                onChange={(_e, tab) => setFilters({ ...filters, tab })}
                aria-label="field zone navigation tabs"
                variant="scrollable"
              >
                <Tab label="Profile" value="profile" />
                <Tab label="Projects" value="projects" />
              </TabList>
              <TabPanel value="profile">
                {fieldZone && <FieldZoneProfile fieldZone={fieldZone} />}
              </TabPanel>
              <TabPanel value="projects">
                {fieldZone && <FieldZoneProjects />}
              </TabPanel>
            </TabContext>
          </TabsContainer>
        </>
      )}
    </Stack>
  );
};
