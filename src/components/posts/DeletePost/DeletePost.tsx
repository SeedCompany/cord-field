import { useMutation } from '@apollo/client';
import { Typography } from '@material-ui/core';
import * as React from 'react';
import { removeItemFromList } from '../../../api';
import { DialogForm } from '../../Dialog/DialogForm';
import { SubmitError } from '../../form';
import { IconButtonProps } from '../../IconButton';
import { PostableIdFragment } from '../PostableId.generated';
import {
  DeletePostDocument,
  PostToDeleteFragment,
} from './DeletePost.generated';

interface DeletePostProps extends IconButtonProps {
  open: boolean;
  parent: PostableIdFragment;
  post: PostToDeleteFragment;
  onClose: () => void;
}

export const DeletePost = ({
  open,
  parent,
  post,
  onClose,
}: DeletePostProps) => {
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
    <>
      <DialogForm
        open={open}
        onSubmit={() => deletePost().then(() => onClose())}
        sendIfClean
        title="Delete Post"
        submitLabel="Delete"
        closeLabel="Keep"
        SubmitProps={{ color: 'error' }}
        onClose={() => onClose()}
      >
        <SubmitError />
        <Typography variant="body1">
          Are you sure you want to delete this post?
        </Typography>
      </DialogForm>
    </>
  );
};
