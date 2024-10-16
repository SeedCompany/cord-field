import { useQuery } from '@apollo/client';
import { Badge, SvgIcon, SvgIconProps, Tooltip } from '@mui/material';
import { forwardRef } from 'react';
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

  const Icon = total === 0 ? NewCommentIcon : CommentIcon;

  return (
    <Feature flag="comments" match={true}>
      <Tooltip title={`${isCommentsBarOpen ? 'Hide' : 'Show'} Comments`}>
        <IconButton onClick={() => toggleCommentsBar()} {...rest}>
          <Badge badgeContent={total} color="primary">
            <Icon />
          </Badge>
        </IconButton>
      </Tooltip>
    </Feature>
  );
};

const NewCommentIcon = forwardRef<SVGSVGElement, SvgIconProps>(
  function NewCommentIcon(props, ref) {
    return (
      <SvgIcon {...props} ref={ref} viewBox="0 0 20 20">
        <path d="M10.43 1.95a7.52 7.52 0 1 1-3.6 14.11L4.3 17.27c-1.06.5-2.17-.6-1.66-1.66l1.2-2.55a7.5 7.5 0 0 1 6.6-11.11Zm0 0v.75-.75Zm2.7 2.13a6 6 0 0 0-7.8 8.55c.13.22.14.49.03.72L4.3 15.62l2.26-1.08c.23-.11.5-.1.72.04a6.02 6.02 0 1 0 5.85-10.5Z" />
        <path d="M11.25 6.5a.75.75 0 0 0-1.5 0v2.25H7.5a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25h2.25a.75.75 0 0 0 0-1.5h-2.25V6.5Z" />
      </SvgIcon>
    );
  }
);

const CommentIcon = forwardRef<SVGSVGElement, SvgIconProps>(
  function CommentIcon(props, ref) {
    return (
      <SvgIcon {...props} ref={ref} viewBox="0 0 20 20">
        <path d="M10.43 1.95a7.52 7.52 0 1 1-3.6 14.11L4.3 17.27c-1.06.5-2.17-.6-1.66-1.66l1.2-2.55a7.5 7.5 0 0 1 6.6-11.11Zm0 0v.75-.75Zm2.7 2.13a6 6 0 0 0-7.8 8.55c.13.22.14.49.03.72L4.3 15.62l2.26-1.08c.23-.11.5-.1.72.04a6.02 6.02 0 1 0 5.85-10.5Z" />
      </SvgIcon>
    );
  }
);
