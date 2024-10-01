import { Close as CloseIcon } from '@mui/icons-material';
import { Box, Drawer, Stack, Typography } from '@mui/material';
import { IconButton } from '../IconButton';
import { useCommentsContext } from './CommentsContext';
import { CommentsThreadList } from './CommentsThreadList';

// thinking of possibly exposing this for a resize elsewhere? Might remove it though
export const CommentsDrawerWidth = 300;

interface CommentsBarProps {
  resourceId?: string;
}

export const CommentsBar = ({ resourceId }: CommentsBarProps) => {
  const { isCommentsBarOpen, toggleCommentsBar } = useCommentsContext();
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
      <Stack alignItems="start" spacing={1}>
        <IconButton onClick={() => toggleCommentsBar(false)}>
          <CloseIcon />
        </IconButton>
        {resourceId ? (
          <CommentsThreadList resourceId={resourceId} />
        ) : (
          <Box height={1} width={1} pt={1} px={2}>
            <Typography variant="h6" pt={1} px={2}>
              Comments not available here
            </Typography>
          </Box>
        )}
      </Stack>
    </Drawer>
  );
};
