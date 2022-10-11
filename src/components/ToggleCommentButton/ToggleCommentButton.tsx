import { CommentBank, CommentBankOutlined } from '@mui/icons-material';
import { useLocalStorageState } from 'ahooks';
import { Except } from 'type-fest';
import { BooleanParam, makeQueryHandler } from '~/hooks';
import { IconButton, IconButtonProps } from '../IconButton';

export type ToggleCommentsButtonProps = Except<IconButtonProps, 'children'>;

export const ToggleCommentsButton = ({
  ...rest
}: ToggleCommentsButtonProps) => {
  const useShowComments = makeQueryHandler({
    comments: BooleanParam(),
  });
  const [isShowing, setShow] = useShowComments();

  const [_commentsLocalStorage, _setCommentLocalStorageState] =
    useLocalStorageState<boolean>('show-comments', {
      defaultValue: false,
    });

  const Icon = isShowing.comments ? CommentBank : CommentBankOutlined;

  return (
    <IconButton
      onClick={() => {
        setShow({ comments: !isShowing.comments });
        // setCommentLocalStorageState(!isShowing.comments);
      }}
      {...rest}
      disabled={rest.disabled}
      loading={rest.loading}
      // {...rest}
    >
      <Icon />
    </IconButton>
  );
};
