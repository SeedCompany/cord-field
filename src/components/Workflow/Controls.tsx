import {
  Fullscreen,
  Lock,
  LockOpen as Unlock,
  Add as ZoomIn,
  Remove as ZoomOut,
} from '@mui/icons-material';
import { Button, ButtonGroup, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useToggle } from 'ahooks';
import { useEffect } from 'react';
import {
  FitViewOptions,
  Panel,
  ReactFlowState,
  useReactFlow,
  useStore,
  useStoreApi,
  ViewportHelperFunctionOptions,
} from 'reactflow';
import { shallow } from 'zustand/shallow';

const selector = (s: ReactFlowState) => ({
  isInteractive: s.nodesDraggable || s.elementsSelectable,
  minZoomReached: s.transform[2] <= s.minZoom,
  maxZoomReached: s.transform[2] >= s.maxZoom,
});

export const Controls = () => {
  const theme = useTheme();
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

  const zoomOptions = {
    duration: theme.transitions.duration.complex,
  } satisfies FitViewOptions & ViewportHelperFunctionOptions;

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
          <Button onClick={() => zoomIn(zoomOptions)} disabled={maxZoomReached}>
            <ZoomIn />
          </Button>
        </Tooltip>
        <Tooltip title="Zoom Out" placement="right">
          <Button
            onClick={() => zoomOut(zoomOptions)}
            disabled={minZoomReached}
          >
            <ZoomOut />
          </Button>
        </Tooltip>
        <Tooltip title="Fit View" placement="right">
          <Button onClick={() => fitView(zoomOptions)}>
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
