import { Comment } from '@mui/icons-material';
import { Badge } from '@mui/material';
import { Except } from 'type-fest';
import { IconButton, IconButtonProps } from '../IconButton';
import { useCommentsContext } from './CommentsBarContext';

export type ToggleCommentsButtonProps = Except<IconButtonProps, 'children'>;

export const ToggleCommentsButton = ({
  ...rest
}: ToggleCommentsButtonProps) => {
  const { toggleCommentsBar, resourceCommentsTotal } = useCommentsContext();

  return (
    <IconButton onClick={() => toggleCommentsBar()} {...rest}>
      <Badge badgeContent={resourceCommentsTotal} color="error">
        <Comment />
      </Badge>
    </IconButton>
  );
};
