import { Drawer } from '@mui/material';
import { useCommentsContext } from './CommentsBarContext';
import { CommentsThreadList } from './CommentsThreadList';

interface CommentsBarProps {
  resourceId: string;
}

export const CommentsBar = ({ resourceId }: CommentsBarProps) => {
  const { isCommentsBarOpen } = useCommentsContext();

  const minWidth = 300;
  const width = 300;

  console.log('isCommentsBarOpen', isCommentsBarOpen);

  return (
    <Drawer
      variant="persistent"
      open={isCommentsBarOpen}
      anchor="right"
      sx={[
        !isCommentsBarOpen && {
          display: 'none',
        },
        {
          overflowY: 'auto',
          display: 'flex',
        },
        isCommentsBarOpen && {
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
