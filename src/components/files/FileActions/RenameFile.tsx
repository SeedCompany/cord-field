import React from 'react';
import { Except } from 'type-fest';
import { GQLOperations, RenameFileInput } from '../../../api';
import { DialogForm, DialogFormProps } from '../../Dialog/DialogForm';
import { SubmitError, TextField } from '../../form';
import { useFileNameAndExtension } from '../hooks';
import { useRenameFileNodeMutation } from './FileActions.generated';
import { FileActionItem } from './FileActionsContext';

export type RenameFileProps = DialogFormProps<RenameFileInput> & {
  item: FileActionItem | undefined;
};

export const RenameFile = (props: Except<RenameFileProps, 'onSubmit'>) => {
  const { item } = props;
  const fileNameAndExtension = useFileNameAndExtension();
  const [renameFile] = useRenameFileNodeMutation();

  if (!item) return null;
  const { id, name, type } = item;

  const onSubmit: RenameFileProps['onSubmit'] = async ({
    name: inputtedName,
  }) => {
    const { extension } = fileNameAndExtension(name);
    const input = {
      id,
      name: `${inputtedName}.${extension}`,
    };
    await renameFile({
      variables: { input },
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
      title={`Rename ${type}`}
    >
      <SubmitError />
      <TextField
        defaultValue={fileNameAndExtension(name).displayName}
        name="name"
        label="Name"
        placeholder={`Enter new ${type.toLowerCase()} name`}
        autoFocus
      />
    </DialogForm>
  );
};
