import {
  Alert,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { isNetworkRequestInFlight } from '../../api';
import { renderError } from '../Error/error-handling';
import { useListQuery } from '../List';
import { ProgressButton } from '../ProgressButton';
import { CreateComment } from './CommentForm/CreateComment';
import { CommentThreadsListDocument } from './CommentsThreadList.graphql';
import { CommentThread } from './CommentThread';

interface CommentThreadListProps {
  resourceId: string;
}

export const CommentsThreadList = ({ resourceId }: CommentThreadListProps) => {
  const list = useListQuery(CommentThreadsListDocument, {
    listAt: (data) => data.commentable.commentThreads,
    variables: {
      resourceId,
    },
  });
  const { data, error, loadMore, networkStatus } = list;

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
      {data?.canCreate && (
        <>
          <CreateComment />
          <Divider sx={{ mx: 'calc(var(--gutter) * -1)', mt: 'var(--gap)' }} />
        </>
      )}

      <Stack
        role="list"
        divider={<Divider sx={{ mx: 'calc(var(--gutter) * -1)' }} />}
        sx={{ gap: 'var(--gap)' }}
      >
        {data?.items.map((thread) => (
          <CommentThread thread={thread} key={thread.id} />
        ))}
      </Stack>
      {!data && (
        <Stack flex={1} justifyContent="space-evenly">
          <Stack alignItems="center">
            <CircularProgress />
          </Stack>
          <div />
        </Stack>
      )}
      {data && data.items.length === 0 && (
        <Typography color="text.secondary" align="center">
          None yet
        </Typography>
      )}
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
