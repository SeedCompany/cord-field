import { useQuery } from '@apollo/client';
import { Edit } from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Skeleton, Tooltip, Typography } from '@mui/material';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { canEditAny } from '~/common';
import { useDialog } from '~/components/Dialog';
import { Error } from '~/components/Error';
import { IconButton } from '~/components/IconButton';
import { Redacted } from '~/components/Redacted';
import { Tab, TabsContainer } from '~/components/Tabs';
import { EditTool } from '~/components/Tool';
import { useDetailTabs } from '~/hooks';
import { ToolDetailProfile } from './Tabs/Profile/ToolDetailProfile';
import { ToolDetailUsages, UsageTab } from './Tabs/Usages';
import { ToolDetailDocument } from './ToolDetail.graphql';

export const ToolDetail = () => {
  const { toolId = '' } = useParams();
  const [editState, edit] = useDialog();

  const { data, error } = useQuery(ToolDetailDocument, {
    variables: { id: toolId },
    fetchPolicy: 'cache-and-network',
  });

  const tool = data?.tool;
  const canEditTool = canEditAny(tool);

  const tabs = useMemo(
    () =>
      (tool?.containerSummary ?? []).map((c) => ({
        value: c.containerType as UsageTab,
        label: c.containerType === 'Engagement' ? 'Engagements' : 'Projects',
      })),
    [tool?.containerSummary]
  );

  const [activeTab, setTab] = useDetailTabs(tabs.map((t) => t.value));

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
      <Helmet title={tool?.name.value || undefined} />
      <Error error={error}>
        {{ NotFound: 'Could not find tool', Default: 'Error loading tool' }}
      </Error>
      {!error && (
        <>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="h2" sx={{ mr: 2, lineHeight: 'inherit' }}>
              {!tool ? (
                <Skeleton width="20ch" />
              ) : (
                tool.name.value ?? (
                  <Redacted info="You don't have permission to view this tool's name" />
                )
              )}
            </Typography>
            {canEditTool ? (
              <Tooltip title="Edit Tool">
                <IconButton aria-label="edit tool" onClick={edit}>
                  <Edit />
                </IconButton>
              </Tooltip>
            ) : null}
          </Box>

          <TabsContainer>
            <TabContext value={activeTab}>
              <TabList onChange={(_, next) => setTab(next)}>
                <Tab label="Profile" value="profile" />
                {tabs.map((tab) => (
                  <Tab key={tab.value} label={tab.label} value={tab.value} />
                ))}
              </TabList>

              <TabPanel value="profile">
                {tool && <ToolDetailProfile tool={tool} />}
              </TabPanel>

              {tabs.map((tab) => (
                <TabPanel key={tab.value} value={tab.value}>
                  <ToolDetailUsages toolId={toolId} tab={tab.value} />
                </TabPanel>
              ))}
            </TabContext>
          </TabsContainer>

          {tool ? <EditTool tool={tool} {...editState} /> : null}
        </>
      )}
    </Box>
  );
};
