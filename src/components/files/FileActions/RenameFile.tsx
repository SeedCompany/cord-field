import { MutationFunctionOptions, useMutation } from '@apollo/client';
import React from 'react';
import { Except } from 'type-fest';
import { RenameFileInput } from '../../../api';
import { DialogForm, DialogFormProps } from '../../Dialog/DialogForm';
import { SubmitError, TextField } from '../../form';
import { parseFileNameAndExtension } from '../../Formatters';
import { RenameFileNodeDocument } from './FileActions.generated';
import { FilesActionItem } from './FileActionsContext';

export type RenameFileProps = DialogFormProps<RenameFileInput> & {
  item: FilesActionItem | undefined;
  refetchQueries?: MutationFunctionOptions['refetchQueries'];
};

export const RenameFile = (props: Except<RenameFileProps, 'onSubmit'>) => {
  const { item, refetchQueries } = props;
  const [renameFile] = useMutation(RenameFileNodeDocument);

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
      refetchQueries,
    });
  };

  return (
    <DialogForm {...props} onSubmit={onSubmit} title={`Rename ${type}`}>
      <SubmitError />
      <TextField
        defaultValue={parseFileNameAndExtension(name).displayName}
        name="name"
        label="Name"
        placeholder={`Enter new ${type.toLowerCase()} name`}
        required
      />
    </DialogForm>
  );
};
