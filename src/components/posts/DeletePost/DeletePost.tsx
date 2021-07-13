import { useMutation } from '@apollo/client';
import { Typography } from '@material-ui/core';
import * as React from 'react';
import {
  Id_InternshipProject_Fragment as InternshipProjectIdFragment,
  removeItemFromList,
  Id_TranslationProject_Fragment as TranslationProjectIdFragment,
} from '../../../api';
import { DialogForm } from '../../../components/Dialog/DialogForm';
import { SubmitError } from '../../../components/form';
import { IconButtonProps } from '../../../components/IconButton';
import { callAll } from '../../../util';
import {
  DeletePostDocument,
  PostToDeleteFragment,
} from './DeletePost.generated';

type ProjectIdFragment =
  | TranslationProjectIdFragment
  | InternshipProjectIdFragment;

interface DeletePostProps extends IconButtonProps {
  open: boolean;
  project: ProjectIdFragment;
  post: PostToDeleteFragment;
  onClose: () => void;
}

export const DeletePost = ({
  open,
  project,
  post,
  onClose,
}: DeletePostProps) => {
  const [deletePost] = useMutation(DeletePostDocument, {
    variables: {
      id: post.id,
    },
    update: callAll(
      removeItemFromList({
        listId: [project, 'posts'],
        item: post,
      })
    ),
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
        changesetAware
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
