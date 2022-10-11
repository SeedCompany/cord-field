import { Drawer } from '@mui/material';
import { useCookieState } from 'ahooks';
import { CommentsThreadList } from './CommentsThreadList';

interface CommentsBarProps {
  resourceId: string;
}

export const CommentsBar = ({ resourceId }: CommentsBarProps) => {
  const [isShowingCookie] = useCookieState('showComments', {
    defaultValue: 'false',
  });

  const minWidth = 300;
  const width = 300;
  const open = !!resourceId && Boolean(isShowingCookie);

  return (
    <Drawer
      variant="persistent"
      open={open}
      anchor="right"
      sx={[
        !open && {
          display: 'none',
        },
        {
          overflowY: 'auto',
          display: 'flex',
        },
        open && {
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
