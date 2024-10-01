import { Alert, Box, Button, List } from '@mui/material';
import { useEffect } from 'react';
import { renderError } from '../Error/error-handling';
import { useListQuery } from '../List';
import { CommentForm } from './CommentForm';
import { useCommentsContext } from './CommentsContext';
import { CommentThreadsListDocument } from './CommentsThreadList.graphql';
import { CommentThread } from './CommentThread';
import { CommentThreadFragment } from './CommentThread/commentThread.graphql';

interface CommentThreadListProps {
  resourceId: string;
}

export const CommentsThreadList = ({ resourceId }: CommentThreadListProps) => {
  const { setResourceCommentsTotal } = useCommentsContext();

  const { data, error, loadMore } = useListQuery(CommentThreadsListDocument, {
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

  if (error) {
    const renderedError = renderError(error, {
      Unauthorized: (ex) => ex.message,
      Default: 'Something went wrong',
    });
    return (
      <Alert color="error" icon={false} sx={{ mx: 2, alignSelf: 'normal' }}>
        {renderedError}
      </Alert>
    );
  }

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
