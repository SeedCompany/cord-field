import { ExpandLess, ExpandMore, Reply } from '@mui/icons-material';
import {
  Box,
  Button,
  ButtonProps,
  Collapse,
  Divider,
  Stack,
} from '@mui/material';
import { useState } from 'react';
import { extendSx, StyleProps } from '~/common';
import { CreateComment } from '../CommentForm/CreateComment';
import { CommentItem } from '../CommentItem';
import { useCommentsContext } from '../CommentsContext';
import { CommentThreadFragment } from './commentThread.graphql';

interface CommentThreadProps {
  thread: CommentThreadFragment;
}

export const CommentThread = ({ thread }: CommentThreadProps) => {
  const { expandedThreads } = useCommentsContext();
  const [isEditing, setIsEditing] = useState(false);

  const isExpanded = expandedThreads.has(thread.id);
  return (
    <Stack role="listitem" gap="var(--gap)">
      <CommentItem
        comment={thread.firstComment}
        thread={thread}
        isEditing={isEditing}
        onEditChange={setIsEditing}
      />

      <Box pl={2}>
        <ThreadActions thread={thread} isEditing={isEditing} />

        <Collapse in={isExpanded}>
          <Stack
            role="list"
            divider={<Divider />}
            sx={{ mt: 'var(--gap)', gap: 'var(--gap)' }}
          >
            {thread.comments.items.slice(1).map((comment) => (
              <CommentItem key={comment.id} comment={comment} thread={thread} />
            ))}
          </Stack>
        </Collapse>
      </Box>
    </Stack>
  );
};

const ThreadActions = ({
  thread,
  isEditing,
  ...rest
}: CommentThreadProps & { isEditing: boolean } & StyleProps) => {
  const { expandedThreads } = useCommentsContext();
  const isExpanded = expandedThreads.has(thread.id);

  const [isReplying, setIsReplying] = useState(false);

  const repliesCount = thread.comments.total - 1;
  const hasChildren = repliesCount > 0;

  return (
    <Box
      sx={[
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        isReplying && { flexDirection: 'column', alignItems: 'flex-start' },
        !hasChildren && { justifyContent: 'flex-end' },
        ...extendSx(rest.sx),
      ]}
      {...rest}
    >
      {isReplying && (
        <CreateComment
          threadId={thread.id}
          sx={{ width: 1 }}
          onFinish={() => {
            setIsReplying(false);
            if (!isExpanded) {
              expandedThreads.add(thread.id);
            }
          }}
          onCancel={() => setIsReplying(false)}
        />
      )}

      {hasChildren && (
        <ExpandThreadLink
          onClick={() => expandedThreads.toggle(thread.id)}
          isExpanded={isExpanded}
          repliesCount={repliesCount}
        />
      )}

      {!isEditing && !isReplying && (
        <Button onClick={() => setIsReplying(true)} startIcon={<Reply />}>
          Reply
        </Button>
      )}
    </Box>
  );
};

const ExpandThreadLink = ({
  isExpanded,
  repliesCount,
  ...rest
}: {
  isExpanded?: boolean;
  repliesCount: number;
} & ButtonProps) => {
  const Icon = isExpanded ? ExpandLess : ExpandMore;

  return (
    <Button variant="text" color="secondary" startIcon={<Icon />} {...rest}>
      {isExpanded ? 'Hide' : 'Show'} {repliesCount} replies
    </Button>
  );
};
