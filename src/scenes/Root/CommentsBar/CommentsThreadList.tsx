import { Close } from '@mui/icons-material';
import { Box, List, ListSubheader, Typography } from '@mui/material';
import { IconButton } from '~/components/IconButton';
import { useListQuery } from '~/components/List';
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
  const { toggleCommentsBar } = useCommentsContext();
  const commentThreads = useListQuery(CommentThreadsListDocument, {
    listAt: (data) => data.commentThreads.parent.commentThreads,
    variables: {
      resourceId,
    },
  });

  return (
    <List
      component="nav"
      aria-label="sidebar"
      subheader={
        <ListSubheader
          component="div"
          sx={{
            pl: 0,
          }}
        >
          <IconButton
            onClick={() => toggleCommentsBar(false)}
            sx={{
              mr: 'auto',
              pl: 2,
              pr: 1,
              pb: 0,
              pt: 0,
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <Close />
          </IconButton>
        </ListSubheader>
      }
    >
      <Box sx={{ padding: 2, pt: 0 }}>
        <Typography variant="h6">Write a comment</Typography>
        <CreateNewThread resourceId={resourceId} />
      </Box>

      {commentThreads.data?.items.map((thread: CommentThreadPropsFragment) => (
        <CommentThread
          thread={thread}
          key={thread.id}
          resourceId={resourceId}
        />
      ))}
      {commentThreads.data?.hasMore && (
        <Box
          sx={{
            padding: 1,
            textAlign: 'center',
            '&:hover': {
              backgroundColor: 'transparent',
              textDecoration: 'underline',
              cursor: 'pointer',
            },
          }}
        >
          <Typography onClick={() => commentThreads.loadMore()} variant="body2">
            Load More
          </Typography>
        </Box>
      )}
    </List>
  );
};
