import { Except } from 'type-fest';
import { CreatePostInput } from '~/api/schema.graphql';
import { CreatePost as CreatePostType } from '~/api/schema/schema.graphql';
import { PostableIdFragment } from '../PostableId.graphql';
import { PostForm, PostFormProps } from '../PostForm';
import { useCreatePost } from './hooks/useCreatePost';

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
  const createPost = useCreatePost(parent);

  return (
    <PostForm<CreatePostInput>
      title="Add Post"
      {...props}
      includeMembership={includeMembership}
      onSubmit={async ({ post }: { post: CreatePostType }) => {
        await createPost(post);
      }}
    />
  );
};
