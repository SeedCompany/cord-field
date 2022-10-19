import { useMutation } from '@apollo/client';
import loadable from '@loadable/component';
import { Box, Button } from '@mui/material';
import { EditorCore } from '@react-editor-js/core';
import { useRef, useState } from 'react';
import { StyleProps } from '~/common';
import { CreateOrReplyCommentDocument } from './CommentReply.graphql';

const EditorJsWrapper = loadable(() => import('~/components/EditorJsWrapper'), {
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
  placeholder = 'Write a reply...',
  onClose,
  sx,
}: CommentReplyProps) => {
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
    }
  };

  return (
    <Box sx={sx}>
      <Box
        sx={(theme) => ({
          border: `thin solid ${theme.palette.divider}`,
          borderRadius: `${theme.shape.borderRadius}px`,
          height: 200,
          overflow: 'auto',
          padding: 1,

          '& .codex-editor': {
            padding: 1,
          },
          '& .codex-editor__redactor': {
            paddingBottom: '0 !important',
          },
          '& .ce-settings': {
            left: '-68px',
          },

          '& .cdx-block': {
            padding: '0',
          },
          '& .ce-popover--opened': {
            maxHeight: '140px',
          },

          // block styling
          '& .ce-paragraph': {
            fontSize: '0.875rem',
          },
        })}
      >
        <EditorJsWrapper
          holder={`reply-to-${commentId}`}
          onInitialize={handleInitialize}
          placeholder={placeholder}
          autofocus
          customTools={['Paragraph', 'List']}
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
