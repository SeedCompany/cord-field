import { Add } from '@mui/icons-material';
import { Breadcrumbs, Stack, Tooltip, Typography } from '@mui/material';
import { partition } from 'lodash';
import { Helmet } from 'react-helmet-async';
import { makeStyles } from 'tss-react/mui';
import { Breadcrumb } from '../../../../components/Breadcrumb';
import { useDialog } from '../../../../components/Dialog';
import { Fab } from '../../../../components/Fab';
import { List, useListQuery } from '../../../../components/List';
import { ProjectBreadcrumb } from '../../../../components/ProjectBreadcrumb';
import { ProjectMemberCard } from '../../../../components/ProjectMemberCard';
import { useProjectId } from '../../useProjectId';
import { CreateProjectMember } from '../Create/CreateProjectMember';
import { UpdateProjectMember, UpdateProjectMemberProps } from '../Update';
import { ProjectMembersDocument } from './ProjectMembers.graphql';

const useStyles = makeStyles()(({ spacing, breakpoints }) => ({
  root: {
    flex: 1,
    overflowY: 'auto',
    padding: spacing(4),
    maxWidth: breakpoints.values.sm,
  },
  headerContainer: {
    margin: spacing(3, 0),
    display: 'flex',
  },
  title: {
    marginRight: spacing(3),
  },
}));

export const ProjectMembersList = () => {
  const { classes } = useStyles();
  const { projectId, changesetId } = useProjectId();
  const { root: data, ...list } = useListQuery(ProjectMembersDocument, {
    listAt: (res) => res.project.team,
    variables: {
      project: projectId,
      changeset: changesetId,
    },
  });

  const [createMemberState, createMember] = useDialog();

  const [editMemberState, editMember, editingMember] =
    useDialog<UpdateProjectMemberProps['member']>();

  const [active, historic] = partition(
    data?.project.team.items,
    (member) => member.active !== false
  );

  return (
    <div className={classes.root}>
      <Helmet
        title={`Team Members - ${data?.project.name.value ?? 'A Project'}`}
      />
      <Breadcrumbs>
        <ProjectBreadcrumb data={data?.project} />
        <Breadcrumb to=".">Team Members</Breadcrumb>
      </Breadcrumbs>
      <div className={classes.headerContainer}>
        <Typography variant="h2" className={classes.title}>
          Team Members
        </Typography>
        {(!list.data || list.data.canCreate) && (
          <Tooltip title="Add Team Member">
            <Fab
              color="error"
              aria-label="Add Team Member"
              loading={!list.data}
              onClick={createMember}
            >
              <Add />
            </Fab>
          </Tooltip>
        )}
        {data && (
          <CreateProjectMember {...createMemberState} project={data.project} />
        )}
      </div>
      {list.data?.canRead === false ? (
        <Typography>
          Sorry, you don't have permission to view this project's team members.
        </Typography>
      ) : (
        <List
          {...list}
          data={list.data ? { ...list.data, items: active } : undefined}
          spacing={3}
          renderItem={(member) => (
            <ProjectMemberCard
              projectMember={member}
              onEdit={() => editMember(member)}
            />
          )}
          renderSkeleton={<ProjectMemberCard />}
        />
      )}
      {historic.length > 0 && (
        <>
          <Typography variant="h3" sx={{ my: 2 }}>
            Historic
          </Typography>
          <Stack
            // to match the list above
            sx={{ gap: 3, pr: 2 }}
          >
            {historic.map((member) => (
              <ProjectMemberCard
                key={member.id}
                projectMember={member}
                onEdit={() => editMember(member)}
              />
            ))}
          </Stack>
        </>
      )}
      {editingMember && (
        <UpdateProjectMember
          {...editMemberState}
          member={editingMember}
          project={data!.project}
        />
      )}
    </div>
  );
};
