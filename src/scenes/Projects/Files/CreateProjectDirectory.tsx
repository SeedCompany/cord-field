import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { Except } from 'type-fest';
import { addItemToList } from '~/api';
import { CreateDirectoryInput } from '~/api/schema.graphql';
import {
  DialogForm,
  DialogFormProps,
} from '../../../components/Dialog/DialogForm';
import { SubmitError, TextField } from '../../../components/form';
import { ButtonLink } from '../../../components/Routing';
import { useProjectId } from '../useProjectId';
import { CreateProjectDirectoryDocument } from './CreateProjectDirectory.graphql';
import { useProjectCurrentDirectory } from './useProjectCurrentDirectory';

export type CreateProjectDirectoryProps = DialogFormProps<CreateDirectoryInput>;

export const CreateProjectDirectory = (
  props: Except<CreateProjectDirectoryProps, 'onSubmit'>
) => {
  const [createDirectory] = useMutation(CreateProjectDirectoryDocument);
  const { projectUrl } = useProjectId();
  const { directoryId } = useProjectCurrentDirectory();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit: CreateProjectDirectoryProps['onSubmit'] = async (
    nameInput
  ) => {
    const { data } = await createDirectory({
      variables: {
        input: {
          ...nameInput,
          parent: directoryId,
        },
      },
      update: addItemToList({
        listId: [{ __typename: 'Directory', id: directoryId }, 'children'],
        outputToItem: (res) => res.createDirectory,
      }),
    });
    const directory = data!.createDirectory;

    enqueueSnackbar(`Created folder: ${directory.name}`, {
      variant: 'success',
      action: () => (
        <ButtonLink color="inherit" to={`${projectUrl}/files/${directory.id}`}>
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
