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
import { invalidatePartnersEngagements } from '../LanguageEngagement/Create/invalidatePartnersEngagements';
import { recalculateSensitivity } from '../LanguageEngagement/Create/recalculateSensitivity';
import {
  DeleteEngagementDocument,
  EngagementToDeleteFragment,
} from './DeleteEngagement.graphql';

interface DeleteEngagementProps extends IconButtonProps {
  project: ProjectIdFragment;
  engagement: EngagementToDeleteFragment;
}

export const DeleteEngagement = (props: DeleteEngagementProps) => {
  const { project, engagement, ...rest } = props;
  const [deleteEng] = useMutation(DeleteEngagementDocument, {
    variables: {
      id: engagement.id,
      changeset: engagement.changeset?.id,
    },
    update: callAll(
      removeItemFromList({
        listId: [project, 'engagements'],
        item: engagement,
      }),
      removeItemFromList({
        listId: 'engagements',
        item: engagement,
      }),
      invalidatePartnersEngagements(),
      recalculateSensitivity(project)
    ),
  });
  const [confirmState, ask] = useDialog();
  const navigate = useNavigate();

  if (!engagement.canDelete) {
    return null;
  }

  return (
    <>
      <Tooltip title="Delete Engagement">
        <IconButton color="error" {...rest} onClick={ask}>
          <DeleteOutline />
        </IconButton>
      </Tooltip>
      <DialogForm
        {...confirmState}
        onSubmit={() =>
          deleteEng().then(() => navigate(`/projects/${project.id}`))
        }
        sendIfClean
        title="Delete Engagement"
        submitLabel="Delete"
        closeLabel="Keep"
        SubmitProps={{ color: 'error' }}
        changesetAware
      >
        <SubmitError />
        <Typography variant="body1">
          Are you sure you want to delete this engagement?
        </Typography>
      </DialogForm>
    </>
  );
};
