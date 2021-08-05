import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { Except } from 'type-fest';
import { addItemToList, CreatePostInput } from '../../../api';
import { PostableIdFragment } from '../PostableId.generated';
import { PostForm, PostFormProps } from '../PostForm';
import { CreatePostDocument } from './CreatePost.generated';

export type CreatePostProps = Except<
  PostFormProps<CreatePostInput>,
  'onSubmit' | 'initialValues'
> & {
  parent: PostableIdFragment;
};

export const CreatePost = ({ parent, ...props }: CreatePostProps) => {
  const [createPost] = useMutation(CreatePostDocument, {
    update: addItemToList({
      listId: [parent, 'posts'],
      outputToItem: (data) => data.createPost.post,
    }),
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
                parentId: parent.id,
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
