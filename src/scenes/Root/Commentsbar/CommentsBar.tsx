import { useQuery } from '@apollo/client';
import { Drawer, List, ListSubheader } from '@mui/material';
import { useParams } from 'react-router-dom';
import { getResourceId } from '~/common';
import { BooleanParam, makeQueryHandler } from '../../../hooks';
import {
  CommentThreadPropsFragment,
  CommentThreadsDocument,
} from './CommentsBar.graphql';
import { CommentThread } from './CommentThread';

export const CommentsBar = () => {
  const useShowComments = makeQueryHandler({
    comments: BooleanParam(),
  });
  const [isShowing] = useShowComments();

  const minWidth = 300;
  const width = 300;

  const resourceId = getResourceId(useParams());

  const { data } = useQuery(CommentThreadsDocument, {
    variables: {
      resourceId,
      input: {
        order: 'ASC',
      },
    },
  });
  const navList = (
    <List
      component="nav"
      aria-label="sidebar"
      subheader={<ListSubheader component="div">COMMENTS</ListSubheader>}
    >
      {data?.commentThreads.items.map((thread: CommentThreadPropsFragment) => (
        <CommentThread
          thread={thread}
          key={thread.id}
          resourceId={resourceId}
        />
      ))}
    </List>
  );

  return (
    <Drawer
      variant="persistent"
      open={isShowing.comments}
      anchor="right"
      sx={[
        !isShowing.comments && {
          display: 'none',
        },
        {
          minWidth,
          width,
          overflowY: 'auto',
          display: 'flex',
        },
      ]}
      PaperProps={{
        elevation: 3,
        sx: {
          width,
          minWidth,
        },
      }}
    >
      {navList}
    </Drawer>
  );
};
