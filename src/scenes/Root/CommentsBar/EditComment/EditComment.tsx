import { useMutation } from '@apollo/client';
import loadable from '@loadable/component';
import { Box, Button } from '@mui/material';
import { EditorCore } from '@react-editor-js/core';
import { useRef, useState } from 'react';
import { EditorJsTheme } from '~/components/EditorJsWrapper/EditorJsTheme';
import { UpdateCommentDocument } from './EditComment.graphql';

const EditorJsWrapper = loadable(() => import('~/components/EditorJsWrapper'), {
  ssr: false,
  resolveComponent: (m) => m.EditorJsWrapper,
});

interface EditCommentProps {
  commentId: string;
  onClose?: () => void;
  blocks: JSON;
}

export const EditComment = ({
  commentId,
  onClose,
  blocks,
}: EditCommentProps) => {
  const [updateComment] = useMutation(UpdateCommentDocument);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInitialize = (instance: EditorCore) => {
    editor.current = instance;
  };

  const editor = useRef<EditorCore>();

  const handleSubmit = () => {
    void handleUpdateComment();
  };

  const handleCancel = () => {
    onClose?.();
  };

  const handleUpdateComment = async () => {
    const commentBody = await editor.current?.save();

    if (commentBody && !(commentBody.blocks.length > 0)) {
      return;
    }

    setIsSubmitting(true);
    const { data } = await updateComment({
      variables: {
        commentId,
        commentBody,
      },
    });
    if (data?.updateComment) {
      setIsSubmitting(false);
      onClose?.();
    }
  };

  return (
    <Box>
      <Box sx={EditorJsTheme}>
        <EditorJsWrapper
          holder={`reply-to-${commentId}`}
          onInitialize={handleInitialize}
          autofocus
          customTools={['paragraph', 'list', 'quote']}
          blocks={blocks}
        />
      </Box>
      <Button onClick={handleCancel} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button onClick={handleSubmit} disabled={isSubmitting}>
        Submit
      </Button>
    </Box>
  );
};
