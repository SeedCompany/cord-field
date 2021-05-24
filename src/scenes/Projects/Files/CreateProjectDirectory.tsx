import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Except } from 'type-fest';
import { addItemToList, CreateDirectoryInput } from '../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { SubmitError, TextField } from '../../../components/form';
import { ButtonLink } from '../../../components/Routing';
import { CreateProjectDirectoryDocument } from './CreateProjectDirectory.generated';
import { useProjectCurrentDirectory } from './useProjectCurrentDirectory';

export type CreateProjectDirectoryProps = DialogFormProps<CreateDirectoryInput>;

export const CreateProjectDirectory = (
  props: Except<CreateProjectDirectoryProps, 'onSubmit'>
) => {
  const [createDirectory] = useMutation(CreateProjectDirectoryDocument);
  const { project, directoryId } = useProjectCurrentDirectory();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit: CreateProjectDirectoryProps['onSubmit'] = async (
    nameInput
  ) => {
    const input = {
      ...nameInput,
      parentId: directoryId,
    };
    const { data } = await createDirectory({
      variables: { input },
      update: addItemToList({
        listId: [{ __typename: 'Directory', id: directoryId }, 'children'],
        outputToItem: (res) => res.createDirectory,
      }),
    });
    const directory = data.createDirectory;

    enqueueSnackbar(`Created folder: ${directory.name}`, {
      variant: 'success',
      action: () => (
        <ButtonLink
          color="inherit"
          to={`/projects/${project!.id}/files/${directory.id}`}
        >
          View
        </ButtonLink>
      ),
    });
  };

  return (
    <DialogForm {...props} onSubmit={onSubmit} title="Create Folder">
      <SubmitError />
      <TextField
        name="name"
        label="Name"
        placeholder="Enter folder name"
        required
      />
    </DialogForm>
  );
};
