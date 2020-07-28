import { Typography } from '@material-ui/core';
import React from 'react';
import { Except } from 'type-fest';
import { GQLOperations } from '../../../api';
import { DialogForm, DialogFormProps } from '../../Dialog/DialogForm';
import { SubmitError } from '../../form';
import { useDeleteFileNodeMutation } from './FileActions.generated';
import { FileActionItem } from './FileActionsContext';

export type DeleteFileProps = DialogFormProps<{ id: string }> & {
  item: FileActionItem | undefined;
};

export const DeleteFile = (props: Except<DeleteFileProps, 'onSubmit'>) => {
  const { item } = props;
  const [deleteFile] = useDeleteFileNodeMutation();

  if (!item) return null;
  const { id, type } = item;
  const isDirectory = type === 'Directory';

  const onSubmit: DeleteFileProps['onSubmit'] = async () => {
    console.log('id', id);
    await deleteFile({
      variables: { id },
      refetchQueries: [GQLOperations.Query.ProjectDirectory],
    });
  };

  return (
    <DialogForm
      DialogProps={{
        fullWidth: true,
        maxWidth: 'xs',
      }}
      {...props}
      onSubmit={onSubmit}
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
