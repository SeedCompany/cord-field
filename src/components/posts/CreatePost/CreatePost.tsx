import { useMutation } from '@apollo/client';
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
  disableMembership: boolean;
};

export const CreatePost = ({
  parent,
  disableMembership,
  ...props
}: CreatePostProps) => {
  const [createPost] = useMutation(CreatePostDocument, {
    update: addItemToList({
      listId: [parent, 'posts'],
      outputToItem: (data) => data.createPost.post,
    }),
  });

  return (
    <PostForm<CreatePostInput>
      title="Add Post"
      {...props}
      disableMembership={disableMembership}
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
      }}
    />
  );
};
