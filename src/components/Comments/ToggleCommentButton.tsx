import { Comment } from '@mui/icons-material';
import { Badge } from '@mui/material';
import { Except } from 'type-fest';
import { Feature } from '../Feature';
import { IconButton, IconButtonProps } from '../IconButton';
import { useCommentsContext } from './CommentsContext';

export type ToggleCommentsButtonProps = Except<IconButtonProps, 'children'>;

export const ToggleCommentsButton = ({
  ...rest
}: ToggleCommentsButtonProps) => {
  const { toggleCommentsBar, resourceCommentsTotal } = useCommentsContext();

  return (
    <Feature flag="comments" match={true}>
      <IconButton onClick={() => toggleCommentsBar()} {...rest}>
        <Badge badgeContent={resourceCommentsTotal} color="primary">
          <Comment />
        </Badge>
      </IconButton>
    </Feature>
  );
};
