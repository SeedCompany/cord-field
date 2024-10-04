import { Alert, Divider, Stack } from '@mui/material';
import { useEffect } from 'react';
import { isNetworkRequestInFlight } from '../../api';
import { renderError } from '../Error/error-handling';
import { useListQuery } from '../List';
import { ProgressButton } from '../ProgressButton';
import { useCommentsContext } from './CommentsContext';
import { CommentThreadsListDocument } from './CommentsThreadList.graphql';
import { CommentThread } from './CommentThread';

interface CommentThreadListProps {
  resourceId: string;
}

export const CommentsThreadList = ({ resourceId }: CommentThreadListProps) => {
  const { setResourceCommentsTotal } = useCommentsContext();

  const list = useListQuery(CommentThreadsListDocument, {
    listAt: (data) => data.commentThreads,
    variables: {
      resourceId,
      input: {
        order: 'ASC',
      },
    },
  });
  const { data, error, loadMore, networkStatus } = list;

  useEffect(() => {
    const totalComments = (data?.items ?? [])
      .flatMap((thread) => thread.comments.total)
      .reduce((prev, total) => prev + total, 0);

    setResourceCommentsTotal(totalComments);
  }, [data, setResourceCommentsTotal]);

  if (error) {
    const renderedError = renderError(error, {
      Unauthorized: (ex) => ex.message,
      Default: 'Something went wrong',
    });
    return (
      <Alert color="error" icon={false} sx={{ mt: 'var(--gap)' }}>
        {renderedError}
      </Alert>
    );
  }

  return (
    <>
      <Stack
        role="list"
        divider={<Divider sx={{ mx: 'calc(var(--gutter) * -1)' }} />}
        sx={{ gap: 'var(--gap)' }}
      >
        {data?.items.map((thread) => (
          <CommentThread thread={thread} key={thread.id} />
        ))}
      </Stack>
      {data?.hasMore && (
        <ProgressButton
          onClick={loadMore}
          progress={isNetworkRequestInFlight(networkStatus)}
        >
          Load More
        </ProgressButton>
      )}
    </>
  );
};
