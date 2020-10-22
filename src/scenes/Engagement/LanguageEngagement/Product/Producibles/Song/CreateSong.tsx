import { useMutation } from '@apollo/client';
import React from 'react';
import { Except } from 'type-fest';
import { CreateSongInput, GQLOperations } from '../../../../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../../../components/Dialog/DialogForm';
import { SubmitError, TextField } from '../../../../../../components/form';
import { SongLookupItem } from '../../../../../../components/form/Lookup';
import { CreateSongDocument } from './CreateSong.generated';

export type CreateSongProps = Except<
  DialogFormProps<CreateSongInput, SongLookupItem>,
  'onSubmit'
>;

export const CreateSong = (props: CreateSongProps) => {
  const [createSong] = useMutation(CreateSongDocument);

  return (
    <DialogForm
      {...props}
      onSubmit={async (input) => {
        const { data } = await createSong({
          variables: { input },
          refetchQueries: [GQLOperations.Query.Songs],
          awaitRefetchQueries: true,
        });

        return data!.createSong.song;
      }}
      title="Create Song"
    >
      <SubmitError />
      <TextField
        name="song.name"
        label="Name"
        placeholder="Enter song name"
        required
      />
    </DialogForm>
  );
};
