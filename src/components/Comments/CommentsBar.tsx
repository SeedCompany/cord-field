import { ChevronRight as CloseIcon } from '@mui/icons-material';
import { Drawer, Stack, Tooltip, Typography } from '@mui/material';
import { IconButton } from '../IconButton';
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
        sx: (theme) => ({
          width: CommentsDrawerWidth,
          // Artificially position this below the app header
          // Still up for consideration.
          // And maybe doable in another way without magic numbers.
          // top: 65,
          // height: 'calc(100vh - 65px)',

          '--gutter': theme.spacing(2),
          padding: 'var(--gutter)',
          '--gap': theme.spacing(1),
          gap: 'var(--gap)',
        }),
      }}
      sx={[
        !open && { display: 'none' },
        { overflowY: 'auto', display: 'flex' },
        open && { width: CommentsDrawerWidth, flexShrink: 0 },
      ]}
    >
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h3">Comments</Typography>
        <Tooltip title="Hide Comments">
          <IconButton onClick={() => toggleCommentsBar()}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {resourceId ? (
        <CommentsThreadList resourceId={resourceId} />
      ) : (
        <Typography variant="h6">Comments not available here</Typography>
      )}
    </Drawer>
  );
};
