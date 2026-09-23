import { useMutation } from '@apollo/client';
import { Except } from 'type-fest';
import { addItemToList } from '~/api';
import { CreatePost as CreatePostInput } from '~/api/schema.graphql.ts';
import { PostableIdFragment } from '../PostableId.graphql.ts';
import { PostForm, PostFormProps } from '../PostForm';
import { CreatePostDocument } from './CreatePost.graphql.ts';

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
      onSubmit={async (values) => {
        await createPost({
          variables: {
            input: {
              parent: parent.id,
              body: values.body,
              type: values.type,
              shareability: values.shareability,
            },
          },
        });
      }}
    />
  );
};
