import { useMutation } from '@apollo/client';
import { Except } from 'type-fest';
import { addItemToList } from '~/api';
import { CreatePost as CreatePostInput } from '~/api/schema.graphql';
import { PostableIdFragment } from '../PostableId.graphql';
import { PostForm, PostFormProps } from '../PostForm';
import { CreatePostDocument } from './CreatePost.graphql';

export type CreatePostProps = Except<
  PostFormProps<CreatePostInput>,
  'onSubmit'
> & {
  parent: PostableIdFragment;
  /**
   * Submit this post already attached to a quarterly report — used by the
   * report editor's Prayer step, where composing here IS the attach action.
   */
  report?: string;
};

export const CreatePost = ({
  parent,
  report,
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
              report,
            },
          },
        });
      }}
    />
  );
};
