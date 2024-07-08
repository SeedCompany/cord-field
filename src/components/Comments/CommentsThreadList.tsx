import { Box, Button, List } from '@mui/material';
import { useEffect } from 'react';
import { useListQuery } from '../List';
import { CommentForm } from './CommentForm';
import { useCommentsContext } from './CommentsBarContext';
import { CommentThreadsListDocument } from './CommentsThreadList.graphql';
import { CommentThread } from './CommentThread';
import { CommentThreadFragment } from './CommentThread/commentThread.graphql';

interface CommentThreadListProps {
  resourceId: string;
}

export const CommentsThreadList = ({ resourceId }: CommentThreadListProps) => {
  const { setResourceCommentsTotal } = useCommentsContext();

  const { data, loadMore } = useListQuery(CommentThreadsListDocument, {
    listAt: (data) => data.commentThreads,
    variables: {
      resourceId,
      input: {
        order: 'ASC',
      },
    },
  });

  useEffect(() => {
    const totalComments = (data?.items ?? [])
      .flatMap((thread: CommentThreadFragment) => thread.comments.total)
      .reduce((prev, total) => prev + total, 0);

    setResourceCommentsTotal(totalComments);
  }, [data, setResourceCommentsTotal]);

  return (
    <List aria-label="comments-list" sx={{ width: 1 }}>
      <Box sx={{ padding: 2, pt: 0 }}>
        <CommentForm resourceId={resourceId} />
      </Box>

      {data?.items.map((thread: CommentThreadFragment) => (
        <CommentThread
          thread={thread}
          key={thread.id}
          resourceId={resourceId}
        />
      ))}
      {data?.hasMore && (
        <Box
          p={1}
          sx={{
            textAlign: 'center',
            '&:hover': {
              backgroundColor: 'transparent',
              textDecoration: 'underline',
              cursor: 'pointer',
            },
          }}
        >
          <Button onClick={loadMore}>Load More</Button>
        </Box>
      )}
    </List>
  );
};
