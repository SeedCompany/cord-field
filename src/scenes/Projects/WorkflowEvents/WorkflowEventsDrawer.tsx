import { Close } from '@mui/icons-material';
import { Box, Divider, Drawer, DrawerProps, Typography } from '@mui/material';
import { useSize } from 'ahooks';
import { useEffect, useRef, useState } from 'react';
import { extendSx } from '~/common';
import { IconButton } from '~/components/IconButton';
import { ProjectWorkflowEventFragment as WorkflowEvent } from './projectWorkflowEvent.graphql';
import { WorkflowEventsList } from './WorkflowEventsList';

type WorkflowEventsDrawerProps = DrawerProps & {
  TransitionProps?: DrawerProps['SlideProps'];
  events: readonly WorkflowEvent[];
};
export const WorkflowEventsDrawer = ({
  events,
  TransitionProps,
  ...props
}: WorkflowEventsDrawerProps) => {
  const listRef = useRef();
  const listSize = useSize(listRef);
  const windowSize = useSize(() => document.querySelector('body'));
  const [needsWidthCalc, setNeedsWidthCalc] = useState(false);

  const isFullWidth =
    !!windowSize?.width &&
    !!listSize?.width &&
    windowSize.width <= listSize.width;

  useEffect(() => setNeedsWidthCalc(true), [events]);
  useEffect(() => {
    listSize?.width && setNeedsWidthCalc(false);
  }, [listSize?.width]);

  return (
    <>
      <Drawer
        SlideProps={TransitionProps} // normalize with Dialog
        {...props}
        anchor="right"
        sx={[
          {
            '.MuiPaper-root': {
              p: 2,
              maxWidth: '100vw',
              // Even if the smaller "full width" event list layout
              // is narrower than the larger desktop layout, keep the drawer
              // full width so the width doesn't snap around.
              width: isFullWidth ? '100vw' : undefined,
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

        {/* Actual list shown in UI */}
        <WorkflowEventsList events={events} fullWidth={isFullWidth} />
      </Drawer>

      {/*
        Hidden list to track intrinsic size to calculate full width.
        Outside the drawer so it is in DOM when needed regardless of drawer state.
      */}
      {needsWidthCalc && (
        <WorkflowEventsList
          events={events}
          ref={listRef}
          sx={{
            p: 2, // matches above
            visibility: 'hidden',
            position: 'absolute',
            top: 0,
            right: 0,
            width: 'fit-content',
          }}
        />
      )}
    </>
  );
};
