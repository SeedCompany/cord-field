import { useMutation } from '@apollo/client';
import { Except } from 'type-fest';
import { addItemToList } from '~/api';
import { CreateEthnoArt as CreateEthnoArtInput } from '~/api/schema.graphql';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../../../components/Dialog/DialogForm';
import { SubmitError, TextField } from '../../../../../../components/form';
import { EthnoArtLookupItem } from '../../../../../../components/form/Lookup/EthnoArt';
import { CreateEthnoArtDocument } from './CreateEthnoArt.graphql';

export type CreateEthnoArtProps = Except<
  DialogFormProps<CreateEthnoArtInput, EthnoArtLookupItem>,
  'onSubmit'
>;

export const CreateEthnoArt = (props: CreateEthnoArtProps) => {
  const [createEthnoArt] = useMutation(CreateEthnoArtDocument, {
    update: addItemToList({
      listId: 'ethnoArts',
      outputToItem: (res) => res.createEthnoArt.ethnoArt,
    }),
  });

  return (
    <DialogForm
      {...props}
      onSubmit={async (input) => {
        const { data } = await createEthnoArt({
          variables: { input },
        });

        return data!.createEthnoArt.ethnoArt;
      }}
      title="Create Ethno Art"
    >
      <SubmitError />
      <TextField
        name="name"
        label="Name"
        placeholder="Enter EthnoArt name"
        required
      />
    </DialogForm>
  );
};
