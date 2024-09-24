import { Close } from '@mui/icons-material';
import { Box, Divider, Drawer, DrawerProps, Typography } from '@mui/material';
import { extendSx } from '~/common';
import { IconButton } from '~/components/IconButton';

export const WorkflowEventsDrawer = ({
  TransitionProps,
  ...props
}: DrawerProps & { TransitionProps?: DrawerProps['SlideProps'] }) => (
  <Drawer
    SlideProps={TransitionProps} // normalize with Dialog
    {...props}
    anchor="right"
    sx={[
      {
        '.MuiPaper-root': {
          p: 2,
          maxWidth: '100vw',
        },
      },
      ...extendSx(props.sx),
    ]}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="h3">Status History Log</Typography>
      <IconButton onClick={(e) => props.onClose?.(e, 'backdropClick')}>
        <Close />
      </IconButton>
    </Box>
    <Divider sx={{ pt: 1 }} />
    {props.children}
  </Drawer>
);
