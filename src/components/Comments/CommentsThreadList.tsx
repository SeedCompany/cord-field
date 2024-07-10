import { Box, List, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useListQuery } from '../List';
import { CommentReply as CreateNewThread } from './CommentReply';
import { useCommentsContext } from './CommentsBarContext';
import {
  CommentThreadPropsFragment,
  CommentThreadsListDocument,
} from './CommentsThreadList.graphql';
import { CommentThread } from './CommentThread';

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
        count: 10,
      },
    },
  });

  useEffect(() => {
    const totalComments = (data?.items ?? [])
      .flatMap((thread: CommentThreadPropsFragment) => thread.comments.total)
      .reduce((prev, total) => prev + total, 0);

    setResourceCommentsTotal(totalComments);
  }, [data, setResourceCommentsTotal]);

  return (
    <List aria-label="comments-list" sx={{ width: 1 }}>
      <Box sx={{ padding: 2, pt: 0 }}>
        <CreateNewThread resourceId={resourceId} />
      </Box>

      {data?.items.map((thread: CommentThreadPropsFragment) => (
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
          <Typography onClick={loadMore} variant="body2">
            Load More
          </Typography>
        </Box>
      )}
    </List>
  );
};
