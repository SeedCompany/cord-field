import React from 'react';
import { Except } from 'type-fest';
import {
  CreateLiteracyMaterialInput,
  GQLOperations,
} from '../../../../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../../../components/Dialog/DialogForm';
import { SubmitError, TextField } from '../../../../../../components/form';
import { LiteracyMaterialLookupItem } from '../../../../../../components/form/Lookup';
import { useCreateLiteracyMaterialMutation } from './CreateLiteracyMaterial.generated';

export type CreateLiteracyMaterialProps = Except<
  DialogFormProps<CreateLiteracyMaterialInput, LiteracyMaterialLookupItem>,
  'onSubmit'
>;

export const CreateLiteracyMaterial = (props: CreateLiteracyMaterialProps) => {
  const [createLiteracyMaterial] = useCreateLiteracyMaterialMutation();

  return (
    <DialogForm
      DialogProps={{
        fullWidth: true,
        maxWidth: 'xs',
      }}
      {...props}
      onSubmit={async (input) => {
        const { data } = await createLiteracyMaterial({
          variables: { input },
          refetchQueries: [GQLOperations.Query.LiteracyMaterials],
          awaitRefetchQueries: true,
        });

        return data!.createLiteracyMaterial.literacyMaterial;
      }}
      title="Create Literacy Material"
    >
      <SubmitError />
      <TextField
        name="literacyMaterial.name"
        label="LiteracyMaterial"
        placeholder="Enter literacy material name"
        autoFocus
      />
    </DialogForm>
  );
};
