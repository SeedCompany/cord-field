import { useMutation } from '@apollo/client';
import { useCallback } from 'react';
import { addItemToList } from '~/api';
import { CreatePost } from '~/api/schema/schema.graphql';
import { PostableIdFragment } from '../../PostableId.graphql';
import { CreatePostDocument } from '../CreatePost.graphql';

export const useCreatePost = (parent: PostableIdFragment) => {
  const [createPostMutation] = useMutation(CreatePostDocument, {
    update: addItemToList({
      listId: [parent, 'posts'],
      outputToItem: (data) => data.createPost.post,
    }),
  });

  return useCallback(
    async (post: CreatePost) => {
      await createPostMutation({
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
    },
    [createPostMutation, parent.id]
  );
};
