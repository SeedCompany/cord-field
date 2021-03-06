import { useMutation } from '@apollo/client';
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
import { CreateLiteracyMaterialDocument } from './CreateLiteracyMaterial.generated';

export type CreateLiteracyMaterialProps = Except<
  DialogFormProps<CreateLiteracyMaterialInput, LiteracyMaterialLookupItem>,
  'onSubmit'
>;

export const CreateLiteracyMaterial = (props: CreateLiteracyMaterialProps) => {
  const [createLiteracyMaterial] = useMutation(CreateLiteracyMaterialDocument);

  return (
    <DialogForm
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
        label="Name"
        placeholder="Enter literacy material name"
        required
      />
    </DialogForm>
  );
};
