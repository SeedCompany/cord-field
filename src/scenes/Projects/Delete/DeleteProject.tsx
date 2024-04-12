import { useMutation } from '@apollo/client';
import { DeleteOutline } from '@mui/icons-material';
import { Tooltip, Typography } from '@mui/material';
import { removeItemFromList } from '~/api';
import { callAll } from '~/common';
import { ProjectIdFragment } from '~/common/fragments';
import { useDialog } from '../../../components/Dialog';
import { DialogForm } from '../../../components/Dialog/DialogForm';
import { SubmitError } from '../../../components/form';
import { IconButton, IconButtonProps } from '../../../components/IconButton';
import { useNavigate } from '../../../components/Routing';
import {
  CanDeleteFragment,
  DeleteProjectDocument,
} from './DeleteProject.graphql';

interface DeleteProjectProps extends IconButtonProps {
  project: ProjectIdFragment & CanDeleteFragment;
}

export const DeleteProject = (props: DeleteProjectProps) => {
  const { project, ...rest } = props;
  const [deleteProject] = useMutation(DeleteProjectDocument, {
    variables: {
      id: project.id,
    },
    update: callAll(
      removeItemFromList({
        listId: 'projects',
        item: project,
      })
      // TODO remove from languages/partners?
    ),
  });
  const [confirmState, ask] = useDialog();
  const navigate = useNavigate();

  if (!project.canDelete) {
    return null;
  }

  return (
    <>
      <Tooltip title="Delete Project">
        <IconButton color="error" {...rest} onClick={ask}>
          <DeleteOutline />
        </IconButton>
      </Tooltip>
      <DialogForm
        {...confirmState}
        onSubmit={() => deleteProject().then(() => navigate(`/`))}
        sendIfClean
        title="Delete Project"
        submitLabel="Delete"
        closeLabel="Keep"
        SubmitProps={{ color: 'error' }}
      >
        <SubmitError />
        <Typography variant="body1">
          Are you sure you want to delete this project?
        </Typography>
      </DialogForm>
    </>
  );
};
