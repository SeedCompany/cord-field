import { MutationUpdaterFn, useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { Except } from 'type-fest';
import { CreatePostInput } from '../../../api';
import { PostForm, PostFormProps } from '../PostForm';
import { CreatePostDocument, CreatePostMutation } from './CreatePost.generated';

export type CreatePostProps = Except<
  PostFormProps<CreatePostInput>,
  'onSubmit' | 'initialValues'
> & {
  parentId: string;
  mutationUpdate?: MutationUpdaterFn<CreatePostMutation>;
};

export const CreatePost = ({
  parentId,
  mutationUpdate,
  ...props
}: CreatePostProps) => {
  const [createPost] = useMutation(CreatePostDocument, {
    update: mutationUpdate,
  });
  const { enqueueSnackbar } = useSnackbar();

  return (
    <PostForm<CreatePostInput>
      title="Add Post"
      {...props}
      initialValues={{
        post: {
          body: '',
          type: 'Note',
          shareability: 'Internal',
        },
      }}
      onSubmit={async ({ post }) => {
        await createPost({
          variables: {
            input: {
              post: {
                parentId,
                body: post.body,
                type: post.type,
                shareability: post.shareability,
              },
            },
          },
        });

        enqueueSnackbar(`Comment posted`, {
          variant: 'success',
        });
      }}
    />
  );
};
