import { MutationFunctionOptions, useMutation } from '@apollo/client';
import { Typography } from '@mui/material';
import { Except } from 'type-fest';
import { removeItemFromList } from '~/api';
import { DialogForm, DialogFormProps } from '../../Dialog/DialogForm';
import { SubmitError } from '../../form';
import { DeleteFileNodeDocument } from './FileActions.graphql';
import { FileActionItem, FilesActionItem } from './FileActionsContext';

export type DeleteFileProps = DialogFormProps<{ id: string }> & {
  item: FilesActionItem | undefined;
  parentFile?: FileActionItem;
  refetchQueries?: MutationFunctionOptions['refetchQueries'];
};

export const DeleteFile = (props: Except<DeleteFileProps, 'onSubmit'>) => {
  const { item, parentFile, refetchQueries } = props;
  const [deleteFile] = useMutation(DeleteFileNodeDocument);

  if (!item) return null;
  const { id, type } = item;
  const isDirectory = type === 'Directory';

  const onSubmit: DeleteFileProps['onSubmit'] = async () => {
    await deleteFile({
      variables: { id },
      refetchQueries,
      update: parentFile
        ? removeItemFromList({
            listId: [parentFile, 'children'],
            item,
          })
        : undefined,
    });
  };

  return (
    <DialogForm
      {...props}
      onSubmit={onSubmit}
      sendIfClean // There's no way to actually make this form dirty
      title={`Delete ${isDirectory ? 'folder' : type}`}
    >
      <Typography variant="body1" color="error">
        Are you sure you want to delete this {isDirectory ? 'folder' : type}?
        {isDirectory
          ? " This will also delete all of the folder's contents."
          : null}
      </Typography>
      <SubmitError />
    </DialogForm>
  );
};
