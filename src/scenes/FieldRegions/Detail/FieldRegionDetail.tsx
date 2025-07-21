import { useQuery } from '@apollo/client';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Tab, TabsContainer } from '~/components/Tabs';
import { EnumParam, makeQueryHandler, withDefault } from '~/hooks';
import { Error } from '../../../components/Error';
import { Redacted } from '../../../components/Redacted';
import { FieldRegionDetailDocument } from './FieldRegionDetail.graphql';
import { FieldRegionProfile } from './Tabs/Profile/FieldRegionProfile';
import { FieldRegionProjects } from './Tabs/Projects/FieldRegionProjects';

const useFieldRegionDetailsFilters = makeQueryHandler({
  tab: withDefault(EnumParam(['profile', 'projects']), 'profile'),
});

export const FieldRegionDetail = () => {
  const { fieldRegionId = '' } = useParams();

  const { data, error } = useQuery(FieldRegionDetailDocument, {
    variables: { fieldRegionId },
  });

  const [filters, setFilters] = useFieldRegionDetailsFilters();

  const fieldRegion = data?.fieldRegion;

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
          NotFound: 'Could not find field region',
          Default: 'Error loading field region',
        }}
      </Error>
      <Helmet title={fieldRegion?.name.value ?? undefined} />

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
              {!fieldRegion ? (
                <Skeleton width="20ch" />
              ) : (
                fieldRegion.name.value ?? (
                  <Redacted
                    info="You don't have permission to view this field region's name"
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
                aria-label="field region navigation tabs"
                variant="scrollable"
              >
                <Tab label="Profile" value="profile" />
                <Tab label="Projects" value="projects" />
              </TabList>
              <TabPanel value="profile">
                {fieldRegion && (
                  <FieldRegionProfile fieldRegion={fieldRegion} />
                )}
              </TabPanel>
              <TabPanel value="projects">
                {fieldRegion && <FieldRegionProjects />}
              </TabPanel>
            </TabContext>
          </TabsContainer>
        </>
      )}
    </Stack>
  );
};
