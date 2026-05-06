import { useQuery } from '@apollo/client';
import { Edit } from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Skeleton, Tooltip, Typography } from '@mui/material';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { canEditAny } from '~/common';
import { useDialog } from '~/components/Dialog';
import {
  DisplaySimpleProperty,
  DisplaySimplePropertyProps,
} from '~/components/DisplaySimpleProperty';
import { EditFieldRegion } from '~/components/FieldRegion';
import { Link } from '~/components/Routing';
import { Tab, TabsContainer } from '~/components/Tabs';
import { useDetailTabs } from '~/hooks';
import { Error } from '../../../components/Error';
import { IconButton } from '../../../components/IconButton';
import { Redacted } from '../../../components/Redacted';
import { FieldRegionDetailDocument } from './FieldRegionDetail.graphql';
import { FieldRegionProjectsPanel } from './Tabs/Projects/FieldRegionProjectsPanel';

export const FieldRegionDetail = () => {
  const { fieldRegionId = '' } = useParams();

  const [editRegionState, editRegion] = useDialog();

  const { data, error } = useQuery(FieldRegionDetailDocument, {
    variables: { fieldRegionId },
    fetchPolicy: 'cache-and-network',
  });

  const fieldRegion = data?.fieldRegion;
  const canReadProjects = fieldRegion?.projects.canRead !== false;

  const [activeTab, setTab] = useDetailTabs(
    useMemo(
      () => ['profile', ...(canReadProjects ? ['projects'] : [])],
      [canReadProjects]
    )
  );

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
      <Helmet title={fieldRegion?.name.value || undefined} />
      <Error error={error}>
        {{
          NotFound: 'Could not find field region',
          Default: 'Error loading field region',
        }}
      </Error>
      {!error && (
        <>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Typography variant="h2" sx={{ mr: 2, lineHeight: 'inherit' }}>
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
            {canEditAny(fieldRegion, true) ? (
              <Tooltip title="Edit Field Region">
                <IconButton aria-label="edit region" onClick={editRegion}>
                  <Edit />
                </IconButton>
              </Tooltip>
            ) : null}
          </Box>

          <TabsContainer>
            <TabContext value={activeTab}>
              <TabList onChange={(_, next) => setTab(next)}>
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
                    label="Field Zone"
                    value={
                      <Link
                        to={`/field-zones/${fieldRegion?.fieldZone.value?.id}`}
                      >
                        {fieldRegion?.fieldZone.value?.name.value}
                      </Link>
                    }
                    loading={!fieldRegion}
                  />
                  <DisplayProperty
                    label="Director"
                    value={
                      <Link to={`/users/${fieldRegion?.director.value?.id}`}>
                        {fieldRegion?.director.value?.fullName}
                      </Link>
                    }
                    loading={!fieldRegion}
                  />
                </Box>
              </TabPanel>
              {canReadProjects && (
                <TabPanel value="projects">
                  <FieldRegionProjectsPanel />
                </TabPanel>
              )}
            </TabContext>
          </TabsContainer>

          {fieldRegion && (
            <EditFieldRegion fieldRegion={fieldRegion} {...editRegionState} />
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
