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
  CanDeleteLanguageFragment,
  DeleteLanguageDocument,
} from './DeleteLanguage.graphql';

interface DeleteLanguageProps extends IconButtonProps {
  language: CanDeleteLanguageFragment;
}

export const DeleteLanguage = (props: DeleteLanguageProps) => {
  const { language, ...rest } = props;
  const [deleteLanguage] = useMutation(DeleteLanguageDocument, {
    variables: {
      id: language.id,
    },
    update: callAll(
      removeItemFromList({
        listId: 'languages',
        item: language,
      })
    ),
  });
  const [confirmState, ask] = useDialog();
  const navigate = useNavigate();

  if (!language.canDelete) {
    return null;
  }

  return (
    <>
      <Tooltip title="Delete Language">
        <IconButton aria-label="delete language" color="error" {...rest} onClick={ask}>
          <DeleteOutline />
        </IconButton>
      </Tooltip>
      <DialogForm
        {...confirmState}
        onSubmit={() => deleteLanguage().then(() => navigate(`/`))}
        sendIfClean
        title="Delete Language"
        submitLabel="Delete"
        closeLabel="Keep"
        SubmitProps={{ color: 'error' }}
      >
        <SubmitError />
        <Typography variant="body1">
          Are you sure you want to delete this language?
        </Typography>
      </DialogForm>
    </>
  );
};
