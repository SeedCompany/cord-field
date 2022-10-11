import { Drawer } from '@mui/material';
import { useLocalStorageState } from 'ahooks';
import { BooleanParam, makeQueryHandler } from '../../../hooks';
import { CommentsThreadList } from './CommentsThreadList';

interface CommentsBarProps {
  resourceId: string;
}

export const CommentsBar = ({ resourceId }: CommentsBarProps) => {
  const useShowComments = makeQueryHandler({
    comments: BooleanParam(),
  });
  const [isShowing, _setShowing] = useShowComments();

  const [_commentsLocalStorageState] = useLocalStorageState<boolean>(
    'show-comments',
    {
      defaultValue: false,
    }
  );

  const minWidth = 300;
  const width = 300;

  return (
    <Drawer
      variant="persistent"
      // open={!!resourceId && isShowing.comments}
      open={!!resourceId && true}
      anchor="right"
      sx={[
        !isShowing.comments && {
          display: 'none',
        },
        {
          overflowY: 'auto',
          display: 'flex',
        },
        isShowing.comments && {
          width,
          flexShrink: 0,
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
      <CommentsThreadList resourceId={resourceId} />
    </Drawer>
  );
};
