import { useQuery } from '@apollo/client';
import { Edit } from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Skeleton, Tooltip, Typography } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { canEditAny } from '~/common';
import { useDialog } from '~/components/Dialog';
import {
  DisplaySimpleProperty,
  DisplaySimplePropertyProps,
} from '~/components/DisplaySimpleProperty';
import { Link } from '~/components/Routing';
import { Tab, TabsContainer } from '~/components/Tabs';
import { EnumParam, makeQueryHandler, withDefault } from '~/hooks';
import { Error } from '../../../components/Error';
import { EditFieldZone } from '../../../components/FieldZone';
import { IconButton } from '../../../components/IconButton';
import { Redacted } from '../../../components/Redacted';
import { FieldZoneDetailDocument } from './FieldZoneDetail.graphql';
import { FieldZoneProjectsPanel } from './Tabs/Projects/FieldZoneProjectsPanel';

const useFieldZoneDetailFilters = makeQueryHandler({
  tab: withDefault(EnumParam(['profile', 'projects']), 'profile'),
});

export const FieldZoneDetail = () => {
  const { fieldZoneId = '' } = useParams();
  const [filters, setFilters] = useFieldZoneDetailFilters();

  const [editZoneState, editZone] = useDialog();

  const { data, error } = useQuery(FieldZoneDetailDocument, {
    variables: { fieldZoneId },
    fetchPolicy: 'cache-and-network',
  });

  const fieldZone = data?.fieldZone;
  const canReadProjects = fieldZone?.projects.canRead !== false;

  const readableTabs = useMemo(
    () => ['profile', ...(canReadProjects ? ['projects'] : [])],
    [canReadProjects]
  );

  useEffect(() => {
    if (!readableTabs.includes(filters.tab)) {
      setFilters({ tab: 'profile' });
    }
  }, [filters.tab, readableTabs, setFilters]);

  return (
    <Box
      component="main"
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflowY: 'auto',
        padding: 4,
        gap: 3,
        maxWidth: theme.breakpoints.values.xl,
      })}
    >
      <Helmet title={fieldZone?.name.value || undefined} />
      <Error error={error}>
        {{
          NotFound: 'Could not find field zone',
          Default: 'Error loading field zone',
        }}
      </Error>
      {!error && (
        <>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Typography variant="h2" sx={{ mr: 2, lineHeight: 'inherit' }}>
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
            {canEditAny(fieldZone, true) ? (
              <Tooltip title="Edit Field Zone">
                <IconButton aria-label="edit zone" onClick={editZone}>
                  <Edit />
                </IconButton>
              </Tooltip>
            ) : null}
          </Box>

          <TabsContainer>
            <TabContext
              value={
                readableTabs.includes(filters.tab) ? filters.tab : 'profile'
              }
            >
              <TabList onChange={(_, next) => setFilters({ tab: next })}>
                <Tab label="Profile" value="profile" />
                {canReadProjects && <Tab label="Projects" value="projects" />}
              </TabList>
              <TabPanel value="profile">
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    py: 2,
                    px: 1,
                  }}
                >
                  <DisplayProperty
                    label="Director"
                    value={
                      fieldZone?.director.value && (
                        <Link to={`/users/${fieldZone.director.value.id}`}>
                          {fieldZone.director.value.fullName}
                        </Link>
                      )
                    }
                    loading={!fieldZone}
                  />
                </Box>
              </TabPanel>
              {canReadProjects && (
                <TabPanel value="projects">
                  <FieldZoneProjectsPanel />
                </TabPanel>
              )}
            </TabContext>
          </TabsContainer>

          {fieldZone && (
            <EditFieldZone fieldZone={fieldZone} {...editZoneState} />
          )}
        </>
      )}
    </Box>
  );
};

const DisplayProperty = (props: DisplaySimplePropertyProps) =>
  !props.value && !props.loading ? null : (
    <DisplaySimpleProperty
      variant="body1"
      {...{ component: 'div' }}
      {...props}
      loading={
        props.loading ? (
          <>
            <Typography variant="body2">
              <Skeleton width="10%" />
            </Typography>
            <Typography variant="body1">
              <Skeleton width="40%" />
            </Typography>
          </>
        ) : null
      }
      LabelProps={{
        color: 'textSecondary',
        variant: 'body2',
        ...props.LabelProps,
      }}
      ValueProps={{
        color: 'textPrimary',
        ...props.ValueProps,
      }}
    />
  );
