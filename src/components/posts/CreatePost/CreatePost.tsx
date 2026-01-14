import { useMutation } from '@apollo/client';
import { Except } from 'type-fest';
import { addItemToList } from '~/api';
import { CreatePostInput } from '~/api/schema.graphql';
import { PostableIdFragment } from '../PostableId.graphql';
import { PostForm, PostFormProps } from '../PostForm';
import { CreatePostDocument } from './CreatePost.graphql';

export type CreatePostProps = Except<
  PostFormProps<CreatePostInput>,
  'onSubmit' | 'initialValues'
> & {
  parent: PostableIdFragment;
};

export const CreatePost = ({
  parent,
  includeMembership = false,
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
      includeMembership={includeMembership}
      onSubmit={async ({ post }) => {
        await createPost({
          variables: {
            input: {
              post: {
                parent: parent.id,
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
