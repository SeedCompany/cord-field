import { Close as CloseIcon } from '@mui/icons-material';
import { Drawer, Stack, Typography } from '@mui/material';
import { IconButton } from '../IconButton';
import { CreateComment } from './CommentForm/CreateComment';
import { useCommentsContext } from './CommentsContext';
import { CommentsThreadList } from './CommentsThreadList';

// thinking of possibly exposing this for a resize elsewhere? Might remove it though
export const CommentsDrawerWidth = 300;

export const CommentsBar = () => {
  const { isCommentsBarOpen, toggleCommentsBar, resourceId } =
    useCommentsContext();
  const open = isCommentsBarOpen && !!resourceId;

  return (
    <Drawer
      variant="persistent"
      open={open}
      anchor="right"
      elevation={0}
      PaperProps={{
        sx: {
          width: CommentsDrawerWidth,
          // Artificially position this below the app header
          // Still up for consideration.
          // And maybe doable in another way without magic numbers.
          // top: 65,
          // height: 'calc(100vh - 65px)',
        },
      }}
      sx={[
        !open && { display: 'none' },
        { overflowY: 'auto', display: 'flex' },
        open && { width: CommentsDrawerWidth, flexShrink: 0 },
      ]}
    >
      <Stack p={2} spacing={1}>
        <IconButton
          onClick={() => toggleCommentsBar(false)}
          sx={{ alignSelf: 'start' }}
        >
          <CloseIcon />
        </IconButton>

        <CreateComment />

        {resourceId ? (
          <CommentsThreadList resourceId={resourceId} />
        ) : (
          <Typography variant="h6">Comments not available here</Typography>
        )}
      </Stack>
    </Drawer>
  );
};
