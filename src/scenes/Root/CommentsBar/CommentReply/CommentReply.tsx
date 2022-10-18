import { useMutation } from '@apollo/client';
import loadable from '@loadable/component';
import { Box, Button, TextField } from '@mui/material';
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
}

export const CommentReply = ({
  threadId,
  resourceId,
  commentId = '',
  placeholder = 'Write a reply...',
  sx,
}: CommentReplyProps) => {
  const [createComment] = useMutation(CreateOrReplyCommentDocument);
  const [isReplying, setIsReplying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editor = useRef<EditorCore>();

  const handleInitialize = (instance: EditorCore) => {
    editor.current = instance;
  };

  const handleReply = () => {
    setIsReplying(true);
  };

  const handleCancel = () => {
    setIsReplying(false);
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
      setIsReplying(false);
    }
  };

  return (
    <Box sx={sx}>
      {isReplying ? (
        <>
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
          <Button onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            Submit
          </Button>
        </>
      ) : (
        <TextField
          onClick={handleReply}
          disabled={isSubmitting}
          placeholder={placeholder}
          variant="outlined"
          size="small"
          sx={{ width: '100%', padding: 0 }}
        />
      )}
    </Box>
  );
};
