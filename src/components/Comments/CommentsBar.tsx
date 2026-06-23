import { ChevronRight as CloseIcon } from '@mui/icons-material';
import { Drawer, Stack, Tooltip, Typography } from '@mui/material';
import { useIsMobile } from '~/common';
import { IconButton } from '../IconButton';
import { useCommentsContext } from './CommentsContext';
import { CommentsThreadList } from './CommentsThreadList';

// thinking of possibly exposing this for a resize elsewhere? Might remove it though
export const CommentsDrawerWidth = 300;

export const CommentsBar = () => {
  const { isCommentsBarOpen, toggleCommentsBar, resourceId } =
    useCommentsContext();
  const open = isCommentsBarOpen && !!resourceId;
  // On mobile the bar overlays content (temporary) instead of squeezing the
  // layout (persistent), and widens to be usable on a small screen.
  const isMobile = useIsMobile();

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      anchor="right"
      elevation={0}
      onClose={() => toggleCommentsBar(false)}
      PaperProps={{
        sx: (theme) => ({
          width: isMobile ? 'min(360px, 90vw)' : CommentsDrawerWidth,
          '--gutter': theme.spacing(2),
          padding: 'var(--gutter)',
          '--gap': theme.spacing(1),
          gap: 'var(--gap)',
        }),
      }}
      sx={[
        !open && { display: 'none' },
        { overflowY: 'auto', display: 'flex' },
        open && !isMobile && { width: CommentsDrawerWidth, flexShrink: 0 },
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
