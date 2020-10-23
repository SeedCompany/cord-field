import { useMutation } from '@apollo/client';
import React from 'react';
import { Except } from 'type-fest';
import { CreateStoryInput, GQLOperations } from '../../../../../../api';
import {
  DialogForm,
  DialogFormProps,
} from '../../../../../../components/Dialog/DialogForm';
import { SubmitError, TextField } from '../../../../../../components/form';
import { StoryLookupItem } from '../../../../../../components/form/Lookup';
import { CreateStoryDocument } from './CreateStory.generated';

export type CreateStoryProps = Except<
  DialogFormProps<CreateStoryInput, StoryLookupItem>,
  'onSubmit'
>;

export const CreateStory = (props: CreateStoryProps) => {
  const [createStory] = useMutation(CreateStoryDocument);

  return (
    <DialogForm
      {...props}
      onSubmit={async (input) => {
        const { data } = await createStory({
          variables: { input },
          refetchQueries: [GQLOperations.Query.Stories],
          awaitRefetchQueries: true,
        });

        return data!.createStory.story;
      }}
      title="Create Story"
    >
      <SubmitError />
      <TextField
        name="story.name"
        label="Name"
        placeholder="Enter story name"
        required
      />
    </DialogForm>
  );
};
