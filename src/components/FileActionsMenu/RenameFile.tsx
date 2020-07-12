import React from 'react';
import { Except } from 'type-fest';
import { GQLOperations, RenameFileInput } from '../../api';
import { DialogForm, DialogFormProps } from '../Dialog/DialogForm';
import { SubmitError, TextField } from '../form';
import { useRenameFileNodeMutation } from './FileActions.generated';
import { FileActionItem } from './FileActionsMenu';

export type RenameFileProps = DialogFormProps<RenameFileInput> & {
  item: FileActionItem | null;
};

export const RenameFile = (props: Except<RenameFileProps, 'onSubmit'>) => {
  const { item } = props;
  const [renameFile] = useRenameFileNodeMutation();

  if (!item) return null;
  const { id, name, category } = item;

  const onSubmit: RenameFileProps['onSubmit'] = async ({ name }) => {
    const input = {
      id,
      name,
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
      title={`Rename ${category}`}
    >
      <SubmitError />
      <TextField
        defaultValue={name}
        name="name"
        label="Name"
        placeholder={`Enter new ${category.toLowerCase()} name`}
        autoFocus
      />
    </DialogForm>
  );
};
