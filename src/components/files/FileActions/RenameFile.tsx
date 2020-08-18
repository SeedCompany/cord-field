import React from 'react';
import { Except } from 'type-fest';
import { GQLOperations, RenameFileInput } from '../../../api';
import { DialogForm, DialogFormProps } from '../../Dialog/DialogForm';
import { SubmitError, TextField } from '../../form';
import { parseFileNameAndExtension } from '../../Formatters';
import { useRenameFileNodeMutation } from './FileActions.generated';
import { FilesActionItem } from './FileActionsContext';

export type RenameFileProps = DialogFormProps<RenameFileInput> & {
  item: FilesActionItem | undefined;
  refetchQueries?: Array<keyof typeof GQLOperations.Query>;
};

export const RenameFile = (props: Except<RenameFileProps, 'onSubmit'>) => {
  const { item, refetchQueries } = props;
  const [renameFile] = useRenameFileNodeMutation();

  if (!item) return null;
  const { id, name, type } = item;

  const onSubmit: RenameFileProps['onSubmit'] = async ({
    name: inputtedName,
  }) => {
    const { extension } = parseFileNameAndExtension(name);
    const input = {
      id,
      name: `${inputtedName}.${extension}`,
    };
    await renameFile({
      variables: { input },
      ...(refetchQueries ? { refetchQueries } : null),
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
        defaultValue={parseFileNameAndExtension(name).displayName}
        name="name"
        label="Name"
        placeholder={`Enter new ${type.toLowerCase()} name`}
        autoFocus
      />
    </DialogForm>
  );
};
