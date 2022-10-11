import { Box, List, ListSubheader, Typography } from '@mui/material';
import { useListQuery } from '~/components/List';
import { CommentReply } from './CommentReply';
import {
  CommentThreadPropsFragment,
  CommentThreadsListDocument,
} from './CommentsBar.graphql';
import { CommentThread } from './CommentThread';

interface CommentThreadListProps {
  resourceId: string;
}

export const CommentsThreadList = ({ resourceId }: CommentThreadListProps) => {
  const commentThreads = useListQuery(CommentThreadsListDocument, {
    listAt: (data) => data.commentThreads,
    variables: {
      resourceId,
    },
  });

  return (
    <List
      component="nav"
      aria-label="sidebar"
      subheader={<ListSubheader component="div">COMMENTS</ListSubheader>}
    >
      <Box sx={{ padding: [4, 2] }}>
        <Typography variant="h6">Create a comment</Typography>
        <CommentReply resourceId={resourceId} />
      </Box>

      {commentThreads.data?.items.map((thread: CommentThreadPropsFragment) => (
        <CommentThread
          thread={thread}
          key={thread.id}
          resourceId={resourceId}
        />
      ))}
    </List>
  );
};
