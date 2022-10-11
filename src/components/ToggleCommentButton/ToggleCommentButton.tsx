import { CommentBank, CommentBankOutlined } from '@mui/icons-material';
import { useCookieState } from 'ahooks';
import { Except } from 'type-fest';
import { IconButton, IconButtonProps } from '../IconButton';

export type ToggleCommentsButtonProps = Except<IconButtonProps, 'children'>;

export const ToggleCommentsButton = ({
  ...rest
}: ToggleCommentsButtonProps) => {
  const [isShowingCookie, setShowingCookie] = useCookieState('showComments', {
    defaultValue: 'false',
  });
  const open = isShowingCookie === 'true';
  const Icon = open ? CommentBank : CommentBankOutlined;

  return (
    <IconButton
      onClick={() => setShowingCookie(!open ? 'true' : 'false')}
      {...rest}
      disabled={rest.disabled}
      loading={rest.loading}
      {...rest}
    >
      <Icon />
    </IconButton>
  );
};
