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
import {
  CanDeletePartnerFragment,
  DeletePartnerDocument,
} from './DeletePartner.graphql';

interface DeletePartnerProps extends IconButtonProps {
  partner: CanDeletePartnerFragment;
}

export const DeletePartner = (props: DeletePartnerProps) => {
  const { partner, ...rest } = props;
  const [deletePartner] = useMutation(DeletePartnerDocument, {
    variables: {
      id: partner.id,
    },
    update: callAll(
      removeItemFromList({
        listId: 'partners',
        item: partner,
      })
    ),
  });
  const [confirmState, ask] = useDialog();
  const navigate = useNavigate();

  if (!partner.canDelete) {
    return null;
  }

  return (
    <>
      <Tooltip title="Delete Partner">
        <IconButton aria-label="delete partner" color="error" {...rest} onClick={ask}>
          <DeleteOutline />
        </IconButton>
      </Tooltip>
      <DialogForm
        {...confirmState}
        onSubmit={() => deletePartner().then(() => navigate(`/`))}
        sendIfClean
        title="Delete Partner"
        submitLabel="Delete"
        closeLabel="Keep"
        SubmitProps={{ color: 'error' }}
      >
        <SubmitError />
        <Typography variant="body1">
          Are you sure you want to delete this partner?
        </Typography>
      </DialogForm>
    </>
  );
};
