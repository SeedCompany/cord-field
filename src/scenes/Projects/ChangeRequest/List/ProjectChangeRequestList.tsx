import { Add } from '@mui/icons-material';
import { Box, Breadcrumbs, Tooltip, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { Breadcrumb } from '../../../../components/Breadcrumb';
import { useDialog } from '../../../../components/Dialog';
import { Fab } from '../../../../components/Fab';
import { List, useListQuery } from '../../../../components/List';
import { ProjectBreadcrumb } from '../../../../components/ProjectBreadcrumb';
import { ProjectChangeRequestListItem } from '../../../../components/ProjectChangeRequestListItem';
import { useProjectId } from '../../useProjectId';
import { CreateProjectChangeRequest } from '../Create';
import { ProjectChangeRequestListDocument as ChangeRequestList } from './ProjectChangeRequestList.graphql';

export const ProjectChangeRequestList = () => {
  const { projectId, changesetId } = useProjectId();
  const { root: data, ...list } = useListQuery(ChangeRequestList, {
    listAt: (res) => res.project.changeRequests,
    variables: {
      project: projectId,
      changeset: changesetId,
    },
  });

  const [createState, openCreateDialog] = useDialog();

  return (
    <Box sx={{ overflowY: 'auto' }}>
      <Box component="main" sx={{ p: 4, maxWidth: 'sm' }}>
        <Helmet
          title={`Change Requests - ${data?.project.name.value ?? 'A Project'}`}
        />
        <Breadcrumbs>
          <ProjectBreadcrumb data={data?.project} />
          <Breadcrumb to=".">Change Requests</Breadcrumb>
        </Breadcrumbs>
        <Box sx={{ my: 3, mx: 0, display: 'flex' }}>
          <Typography variant="h2" sx={{ mr: 3 }}>
            Change Requests
          </Typography>
          {(!list.data || list.data.canCreate) && (
            <Tooltip title="Create Change Request">
              <Fab
                color="error"
                loading={!list.data}
                onClick={openCreateDialog}
              >
                <Add />
              </Fab>
            </Tooltip>
          )}
          {data && (
            <CreateProjectChangeRequest
              {...createState}
              project={data.project}
            />
          )}
        </Box>
        {list.data?.canRead === false ? (
          <Typography>
            Sorry, you don't have permission to view this project's change
            requests.
          </Typography>
        ) : (
          <List
            {...list}
            spacing={3}
            renderItem={(changeRequest) => (
              <ProjectChangeRequestListItem data={changeRequest} />
            )}
            renderSkeleton={<ProjectChangeRequestListItem />}
          />
        )}
      </Box>
    </Box>
  );
};
