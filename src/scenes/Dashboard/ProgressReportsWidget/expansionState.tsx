import {
  UnfoldLess as CollapseIcon,
  UnfoldMore as ExpandIcon,
} from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import {
  DataGridProProps as GridProps,
  GridRowId,
  useGridApiContext,
} from '@mui/x-data-grid-pro';
import {
  createContext,
  MouseEvent,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { SetHook, useSet } from '~/hooks';

export const ExpansionContext = createContext<SetHook<GridRowId>>(
  new Set() as any
);

export const useExpanded = () => useContext(ExpansionContext);

export const CollapseAllButton = () => {
  const expanded = useExpanded();
  return (
    <Tooltip title="Collapse All Rows">
      <IconButton color="primary" size="small" onClick={expanded.clear}>
        <CollapseIcon />
      </IconButton>
    </Tooltip>
  );
};

export const ExpandAllButton = () => {
  const apiRef = useGridApiContext();
  const expanded = useExpanded();
  const expandAll = () => {
    expanded.set(apiRef.current.state.rows.dataRowIds);
  };
  return (
    <Tooltip title="Expand All Rows">
      <IconButton color="primary" size="small" onClick={expandAll}>
        <ExpandIcon />
      </IconButton>
    </Tooltip>
  );
};

// if moving more than this many pixels, will consider the click event
// to be movement rather than a click.
// i.e. to select the text within.
const MOVEMENT_THRESHOLD = 10;

export const useExpandedSetup = () => {
  const expanded = useSet<GridRowId>();

  const lastDownPos = useRef({ x: 0, y: 0 });
  const onMouseDown = useCallback((e: MouseEvent) => {
    lastDownPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onRowClick = useCallback<GridProps['onRowClick'] & {}>(
    ({ id }, event) => {
      const now = { x: event.clientX, y: event.clientY };
      const prev = lastDownPos.current;
      if (
        Math.abs(now.x - prev.x) > MOVEMENT_THRESHOLD ||
        Math.abs(now.y - prev.y) > MOVEMENT_THRESHOLD
      ) {
        // This click (up) event appears to be a drag, not a click.
        return;
      }
      expanded.toggle(id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return { expanded, onMouseDown, onRowClick };
};
