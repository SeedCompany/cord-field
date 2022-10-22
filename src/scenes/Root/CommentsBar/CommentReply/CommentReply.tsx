import { useMutation } from '@apollo/client';
import loadable from '@loadable/component';
import { Box, Button } from '@mui/material';
import { EditorCore } from '@react-editor-js/core';
import { useRef, useState } from 'react';
import { StyleProps } from '~/common';
import { EditorJsTheme } from '~/components/EditorJsWrapper/EditorJsTheme';
import { useCommentsContext } from '../CommentsBarContext';
import { CreateOrReplyCommentDocument } from './CommentReply.graphql';

const EditorJsWrapper = loadable(() => import('~/components/EditorJsWrapper'), {
  ssr: false,
  resolveComponent: (m) => m.EditorJsWrapper,
});

export interface CommentReplyProps extends StyleProps {
  threadId?: string;
  resourceId: string;
  commentId?: string;
  placeholder?: string;
  onClose?: () => void;
}

export const CommentReply = ({
  threadId,
  resourceId,
  commentId = '',
  placeholder = 'Write a comment...',
  onClose,
  sx,
}: CommentReplyProps) => {
  const { toggleThreadComments } = useCommentsContext();

  const [createComment] = useMutation(CreateOrReplyCommentDocument);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editor = useRef<EditorCore>();

  const handleInitialize = (instance: EditorCore) => {
    editor.current = instance;
  };

  const handleSubmit = () => {
    void handleSave();
  };

  const handleSave = async () => {
    const commentBody = await editor.current?.save();

    if (commentBody && !(commentBody.blocks.length > 0)) {
      return;
    }
    setIsSubmitting(true);
    const { data } = await createComment({
      variables: {
        threadId,
        commentBody,
        resourceId,
      },
    });

    if (data?.createComment) {
      setIsSubmitting(false);
      onClose?.();
      void editor.current?.clear();
      toggleThreadComments(threadId ?? '', true);
    }
  };

  return (
    <Box sx={sx}>
      <Box sx={EditorJsTheme}>
        <EditorJsWrapper
          holder={`reply-to-${commentId}`}
          onInitialize={handleInitialize}
          placeholder={placeholder}
          autofocus
          customTools={['paragraph', 'list', 'quote', 'marker']}
        />
      </Box>
      {onClose && (
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
      )}
      <Button onClick={handleSubmit} disabled={isSubmitting}>
        Submit
      </Button>
    </Box>
  );
};
