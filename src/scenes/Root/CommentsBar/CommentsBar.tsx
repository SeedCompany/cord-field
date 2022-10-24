import { Drawer } from '@mui/material';
import { useCommentsContext } from './CommentsBarContext';
import { CommentsThreadList } from './CommentsThreadList';

interface CommentsBarProps {
  resourceId: string;
}

export const CommentsBar = ({ resourceId }: CommentsBarProps) => {
  const { isCommentsBarOpen } = useCommentsContext();

  const minWidth = 350;

  return (
    <Drawer
      variant="persistent"
      open={isCommentsBarOpen && !!resourceId}
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
          width: minWidth,
          flexShrink: 0,
        },
      ]}
      PaperProps={{
        elevation: 3,
        sx: {
          width: minWidth,
          minWidth,
        },
      }}
    >
      <CommentsThreadList resourceId={resourceId} />
    </Drawer>
  );
};
