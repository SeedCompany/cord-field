import React from 'react';
import { Except } from 'type-fest';
import { CreateFilmInput, GQLOperations } from '../../../../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../../../components/Dialog/DialogForm';
import { SubmitError, TextField } from '../../../../../../components/form';
import { FilmLookupItem } from '../../../../../../components/form/Lookup';
import { useCreateFilmMutation } from './CreateFilm.generated';

export type CreateFilmProps = Except<
  DialogFormProps<CreateFilmInput, FilmLookupItem>,
  'onSubmit'
>;

export const CreateFilm = (props: CreateFilmProps) => {
  const [createFilm] = useCreateFilmMutation();
  return (
    <DialogForm
      DialogProps={{
        fullWidth: true,
        maxWidth: 'xs',
      }}
      {...props}
      onSubmit={async (input) => {
        const { data } = await createFilm({
          variables: { input },
          refetchQueries: [GQLOperations.Query.Films],
          awaitRefetchQueries: true,
        });

        return data!.createFilm.film;
      }}
      title="Create Film"
    >
      <SubmitError />
      <TextField name="film.name" label="Name" placeholder="Enter film name" />
    </DialogForm>
  );
};
