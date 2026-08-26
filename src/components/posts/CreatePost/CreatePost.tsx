import { useMutation } from '@apollo/client';
import { Except } from 'type-fest';
import { addItemToList, type ListIdentifier } from '~/api';
import { CreatePost as CreatePostInput } from '~/api/schema.graphql';
import { PostableIdFragment } from '../PostableId.graphql';
import { PostForm, PostFormProps } from '../PostForm';
import { CreatePostDocument } from './CreatePost.graphql';

export type CreatePostProps = Except<
  PostFormProps<CreatePostInput>,
  'onSubmit' | 'initialValues'
> & {
  parent: PostableIdFragment;
  /**
   * The parent field the new post belongs to, when it isn't the plain `posts`
   * list — GTL reports read prayer through `prayerRequests`, and a post added
   * to the wrong cached list simply never appears.
   */
  listField?: 'posts' | 'prayerRequests';
};

export const CreatePost = ({
  parent,
  includeMembership = false,
  listField = 'posts',
  fixedType,
  ...props
}: CreatePostProps) => {
  const [createPost] = useMutation(CreatePostDocument, {
    update: addItemToList({
      // `prayerRequests` lives on GTLReport alone, so the pair cannot be typed
      // against the whole Postable union; the runtime shape is the same.
      listId: [parent, listField] as ListIdentifier<PostableIdFragment>,
      outputToItem: (data) => data.createPost.post,
    }),
  });

  return (
    <PostForm<CreatePostInput>
      title="Add Post"
      {...props}
      fixedType={fixedType}
      includeMembership={includeMembership}
      onSubmit={async (values) => {
        await createPost({
          variables: {
            input: {
              parent: parent.id,
              body: values.body,
              type: fixedType ?? values.type,
              shareability: values.shareability,
            },
          },
        });
      }}
    />
  );
};
