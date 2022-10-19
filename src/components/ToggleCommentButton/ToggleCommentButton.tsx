import { CommentBank, CommentBankOutlined } from '@mui/icons-material';
import { Except } from 'type-fest';
import { useCommentsContext } from '~/scenes/Root/CommentsBar/CommentsBarContext';
import { IconButton, IconButtonProps } from '../IconButton';

export type ToggleCommentsButtonProps = Except<IconButtonProps, 'children'>;

export const ToggleCommentsButton = ({
  ...rest
}: ToggleCommentsButtonProps) => {
  const { toggleCommentsBar, isCommentsBarOpen } = useCommentsContext();
  const Icon = isCommentsBarOpen ? CommentBank : CommentBankOutlined;

  return (
    <IconButton onClick={() => toggleCommentsBar()} {...rest}>
      <Icon />
    </IconButton>
  );
};
