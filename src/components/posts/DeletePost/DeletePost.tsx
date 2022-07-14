import { useMutation } from '@apollo/client';
import { Typography } from '@mui/material';
import { Except } from 'type-fest';
import { removeItemFromList } from '../../../api';
import { DialogForm, DialogFormProps } from '../../Dialog/DialogForm';
import { SubmitError } from '../../form';
import { PostableIdFragment } from '../PostableId.graphql';
import { DeletePostDocument, PostToDeleteFragment } from './DeletePost.graphql';

interface DeletePostProps extends Except<DialogFormProps<any>, 'onSubmit'> {
  parent: PostableIdFragment;
  post: PostToDeleteFragment;
}

export const DeletePost = ({ parent, post, ...rest }: DeletePostProps) => {
  const [deletePost] = useMutation(DeletePostDocument, {
    variables: {
      id: post.id,
    },
    update: removeItemFromList({
      listId: [parent, 'posts'],
      item: post,
    }),
  });

  return (
    <DialogForm
      title="Delete Post"
      submitLabel="Delete"
      closeLabel="Keep"
      SubmitProps={{ color: 'error' }}
      {...rest}
      onSubmit={async () => {
        await deletePost();
      }}
      sendIfClean
    >
      <SubmitError />
      <Typography variant="body1">
        Are you sure you want to delete this post?
      </Typography>
    </DialogForm>
  );
};
