import { useMutation } from '@apollo/client';
import { useMemo } from 'react';
import { Except } from 'type-fest';
import { UpdatePost as UpdatePostInput } from '~/api/schema.graphql';
import { PostForm, PostFormProps } from '../PostForm';
import { UpdatePostDocument } from './EditPost.graphql';

export type EditPostProps = Except<
  PostFormProps<UpdatePostInput>,
  'onSubmit' | 'initialValues'
> & { includeMembership: boolean };

export const EditPost = (props: EditPostProps) => {
  const [updatePost] = useMutation(UpdatePostDocument);
  const post = props.post;

  const initialValues = useMemo(
    () =>
      post
        ? {
            id: post.id,
            body: post.body.value || '',
            shareability: post.shareability,
            type: post.type,
          }
        : undefined,
    [post]
  );
  return (
    <PostForm<UpdatePostInput>
      title="Edit Post"
      {...props}
      initialValues={initialValues}
      includeMembership={props.includeMembership}
      onSubmit={async (input) => {
        await updatePost({
          variables: { input },
        });
      }}
    />
  );
};
