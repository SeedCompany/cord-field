import { Paper, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useIsMobile } from '~/common';
import { EntityList as ToolsList } from '~/components/List';
import { ToolColumns } from '~/components/ToolDataGrid';
import { ToolGrid } from './ToolGrid';
import { ToolsDocument } from './tools.graphql';

export const ToolList = () => {
  const isMobile = useIsMobile();
  return (
    <Stack sx={{ flex: 1, padding: { xs: 2, md: 4 }, pt: 2 }}>
      <Helmet title="Tools" />
      <Stack component="main" sx={{ flex: 1 }}>
        {!isMobile && (
          <Typography variant="h2" paragraph>
            Tools
          </Typography>
        )}
        {isMobile ? (
          <ToolsList
            title="Tools"
            query={ToolsDocument}
            listAt={(data) => data.tools}
            columns={ToolColumns}
            sortDefault={{
              field: ToolColumns[0]!.field,
              direction: 'ASC',
            }}
            defaultSecondaryField="description"
            primary={(tool) => tool.name.value}
            to={(tool) => `/tools/${tool.id}`}
          />
        ) : (
          // ai edge-case The grid (and its `useDataGridSource`) must only mount on desktop.
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
              <ToolGrid />
            </Paper>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
