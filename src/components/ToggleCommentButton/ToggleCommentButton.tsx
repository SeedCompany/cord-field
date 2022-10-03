import { CommentBank, CommentBankOutlined } from '@mui/icons-material';
import { IconButton, IconButtonProps } from '@mui/material';
import { Except } from 'type-fest';
import { BooleanParam, makeQueryHandler } from '~/hooks';

export type ToggleCommentsButtonProps = Except<IconButtonProps, 'children'>;

export const ToggleCommentsButton = ({
  ...rest
}: ToggleCommentsButtonProps) => {
  const useShowComments = makeQueryHandler({
    comments: BooleanParam(),
  });
  const [isShowing, setShow] = useShowComments();

  const Icon = isShowing.comments ? CommentBank : CommentBankOutlined;

  return (
    <IconButton
      onClick={() => {
        setShow({ comments: !isShowing.comments });
        localStorage.setItem('comments', `${!isShowing.comments}`);
      }}
      {...rest}
    >
      <Icon />
    </IconButton>
  );
};
