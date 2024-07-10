import { Close as CloseIcon } from '@mui/icons-material';
import { Box, Drawer, Stack, Typography } from '@mui/material';
import { IconButton } from '../IconButton';
import { useCommentsContext } from './CommentsBarContext';
import { CommentsThreadList } from './CommentsThreadList';

interface CommentsBarProps {
  resourceId?: string;
}

export const CommentsBar = ({ resourceId }: CommentsBarProps) => {
  const { isCommentsBarOpen, toggleCommentsBar } = useCommentsContext();
  const open = isCommentsBarOpen && !!resourceId;
  const width = 350;

  return (
    <Drawer
      variant="persistent"
      open={open}
      anchor="right"
      elevation={0}
      PaperProps={{
        sx: { width, top: 65, height: 'calc(100vh - 65px)' },
      }}
      sx={[
        !open && { display: 'none' },
        { overflowY: 'auto', display: 'flex' },
        open && { width: width, flexShrink: 0 },
      ]}
    >
      <Stack alignItems="start" spacing={1}>
        <IconButton size="small" onClick={() => toggleCommentsBar(false)}>
          <CloseIcon />
        </IconButton>
        {resourceId ? (
          <CommentsThreadList resourceId={resourceId} />
        ) : (
          <Box height={1} width={1} pt={1} px={2}>
            <Typography variant="h6">Comments not available here</Typography>
          </Box>
        )}
      </Stack>
    </Drawer>
  );
};
