import { useMutation } from '@apollo/client';
import { Except } from 'type-fest';
import { addItemToList } from '~/api';
import { CreateFilm as CreateFilmInput } from '~/api/schema.graphql';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../../../components/Dialog/DialogForm';
import { SubmitError, TextField } from '../../../../../../components/form';
import { FilmLookupItem } from '../../../../../../components/form/Lookup';
import { CreateFilmDocument } from './CreateFilm.graphql';

export type CreateFilmProps = Except<
  DialogFormProps<CreateFilmInput, FilmLookupItem>,
  'onSubmit'
>;

export const CreateFilm = (props: CreateFilmProps) => {
  const [createFilm] = useMutation(CreateFilmDocument, {
    update: addItemToList({
      listId: 'films',
      outputToItem: (res) => res.createFilm.film,
    }),
  });
  return (
    <DialogForm
      {...props}
      onSubmit={async (input) => {
        const { data } = await createFilm({
          variables: { input },
        });

        return data!.createFilm.film;
      }}
      title="Create Film"
    >
      <SubmitError />
      <TextField
        name="name"
        label="Name"
        placeholder="Enter film name"
        required
      />
    </DialogForm>
  );
};
