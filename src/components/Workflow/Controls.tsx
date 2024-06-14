import {
  Fullscreen,
  Lock,
  LockOpen as Unlock,
  Add as ZoomIn,
  Remove as ZoomOut,
} from '@mui/icons-material';
import { Button, ButtonGroup, Tooltip } from '@mui/material';
import { useToggle } from 'ahooks';
import { useEffect } from 'react';
import {
  Panel,
  ReactFlowState,
  useReactFlow,
  useStore,
  useStoreApi,
} from 'reactflow';
import { shallow } from 'zustand/shallow';

const selector = (s: ReactFlowState) => ({
  isInteractive: s.nodesDraggable || s.elementsSelectable,
  minZoomReached: s.transform[2] <= s.minZoom,
  maxZoomReached: s.transform[2] >= s.maxZoom,
});

export const Controls = () => {
  const store = useStoreApi();
  const { isInteractive, minZoomReached, maxZoomReached } = useStore(
    selector,
    shallow
  );
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  // Don't show the panel until the bundle (with styles) is loaded
  const [isVisible, setIsVisible] = useToggle();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(setIsVisible.setRight, []);
  if (!isVisible) {
    return null;
  }

  const ToggleLock = isInteractive ? Unlock : Lock;

  return (
    <Panel position="bottom-left">
      <ButtonGroup
        orientation="vertical"
        color="secondary"
        variant="text"
        sx={(theme) => ({
          x: theme.transitions.duration.complex,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[4],
          '.MuiButton-root': {
            minWidth: 'initial',
            p: '5px',
          },
          svg: {
            fontSize: '1.5rem',
          },
        })}
      >
        <Tooltip title="Zoom In" placement="right">
          <Button onClick={() => zoomIn()} disabled={maxZoomReached}>
            <ZoomIn />
          </Button>
        </Tooltip>
        <Tooltip title="Zoom Out" placement="right">
          <Button onClick={() => zoomOut()} disabled={minZoomReached}>
            <ZoomOut />
          </Button>
        </Tooltip>
        <Tooltip title="Fit View" placement="right">
          <Button onClick={() => fitView()}>
            <Fullscreen />
          </Button>
        </Tooltip>
        <Tooltip
          title={isInteractive ? 'Lock Layout' : 'Unlock Layout'}
          placement="right"
        >
          <Button
            onClick={() => {
              store.setState({
                nodesDraggable: !isInteractive,
                elementsSelectable: !isInteractive,
              });
            }}
          >
            <ToggleLock />
          </Button>
        </Tooltip>
      </ButtonGroup>
    </Panel>
  );
};
