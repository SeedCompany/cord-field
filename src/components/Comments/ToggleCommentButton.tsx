import { useQuery } from '@apollo/client';
import { Comment } from '@mui/icons-material';
import { Badge, Tooltip } from '@mui/material';
import { Except } from 'type-fest';
import { Feature } from '../Feature';
import { IconButton, IconButtonProps } from '../IconButton';
import { useCommentsContext } from './CommentsContext';
import { ThreadCountDocument } from './ThreadCount.graphql';

export type ToggleCommentsButtonProps = Except<IconButtonProps, 'children'>;

export const ToggleCommentsButton = ({
  ...rest
}: ToggleCommentsButtonProps) => {
  const { resourceId, isCommentsBarOpen, toggleCommentsBar } =
    useCommentsContext();

  const { data } = useQuery(ThreadCountDocument, {
    variables: { id: resourceId! },
    skip: !resourceId,
    fetchPolicy: isCommentsBarOpen ? 'cache-only' : 'cache-first',
  });
  const total = data?.commentable.commentThreads.total ?? 0;

  return (
    <Feature flag="comments" match={true}>
      <Tooltip title={`${isCommentsBarOpen ? 'Hide' : 'Show'} Comments`}>
        <IconButton onClick={() => toggleCommentsBar()} {...rest}>
          <Badge badgeContent={total} color="primary">
            <Comment />
          </Badge>
        </IconButton>
      </Tooltip>
    </Feature>
  );
};
