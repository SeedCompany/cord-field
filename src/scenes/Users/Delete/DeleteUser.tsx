import { useMutation } from '@apollo/client';
import { DeleteOutline } from '@mui/icons-material';
import { Tooltip, Typography } from '@mui/material';
import { removeItemFromList } from '~/api';
import { callAll } from '~/common';
import { useDialog } from '../../../components/Dialog';
import { DialogForm } from '../../../components/Dialog/DialogForm';
import { SubmitError } from '../../../components/form';
import { IconButton, IconButtonProps } from '../../../components/IconButton';
import { useNavigate } from '../../../components/Routing';
import { DeleteUserDocument } from './DeleteUser.graphql';

interface DeleteUserProps extends IconButtonProps {
  user: { id: string; canDelete: boolean };
}

export const DeleteUser = (props: DeleteUserProps) => {
  const { user, ...rest } = props;
  const [deleteUser] = useMutation(DeleteUserDocument, {
    variables: {
      id: user.id,
    },
    update: callAll(
      removeItemFromList({
        listId: 'users',
        item: user,
      })
    ),
  });
  const [confirmState, ask] = useDialog();
  const navigate = useNavigate();

  if (!user.canDelete) {
    return null;
  }

  return (
    <>
      <Tooltip title="Delete Person">
        <IconButton color="error" {...rest} onClick={ask}>
          <DeleteOutline />
        </IconButton>
      </Tooltip>
      <DialogForm
        {...confirmState}
        onSubmit={() => deleteUser().then(() => navigate(`/`))}
        sendIfClean
        title="Delete Person"
        submitLabel="Delete"
        closeLabel="Keep"
        SubmitProps={{ color: 'error' }}
      >
        <SubmitError />
        <Typography variant="body1">
          Are you sure you want to delete this person?
        </Typography>
      </DialogForm>
    </>
  );
};
