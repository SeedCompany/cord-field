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

interface Position {
  x: number;
  y: number;
}
const isPosClose = (a: Position, b: Position) =>
  Math.abs(a.x - b.x) < MOVEMENT_THRESHOLD &&
  Math.abs(a.y - b.y) < MOVEMENT_THRESHOLD;
const eventPos = (e: MouseEvent) => ({ x: e.clientX, y: e.clientY });

export const useExpandedSetup = () => {
  const expanded = useSet<GridRowId>();

  const { current: lastDownPositions } = useRef(new Set<Position>());
  const { current: collapseTimers } = useRef(new Map<GridRowId, number>());

  const onMouseDown = useCallback((e: MouseEvent) => {
    if (!(e.target instanceof HTMLElement)) {
      return;
    }
    const id = e.target.closest('[role="row"]')?.getAttribute('data-id');
    if (!id) {
      return;
    }
    const pos = eventPos(e);

    const hasPrev = [...lastDownPositions].some((prev) =>
      isPosClose(prev, pos)
    );
    if (hasPrev) {
      const prevTimer = collapseTimers.get(id);
      if (prevTimer) {
        // console.log('cancelling collapse', id);
        clearTimeout(prevTimer);
        collapseTimers.delete(id);
      }
    }
    // console.log('marking down pos');
    lastDownPositions.add(pos);
    setTimeout(() => {
      // console.log('removing down pos');
      lastDownPositions.delete(pos);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRowClick = useCallback<GridProps['onRowClick'] & {}>(
    ({ id }, event) => {
      const now = eventPos(event);
      const prev = [...lastDownPositions].at(-1);
      if (!prev || !isPosClose(prev, now)) {
        // console.log('up, but dragging');
        // This click (up) event appears to be a drag, not a click.
        return;
      }
      if (event.detail > 1) {
        // console.log('double click', event.detail);
        const timer = collapseTimers.get(id);
        clearTimeout(timer);
        collapseTimers.delete(id);
        return;
      }
      // console.log('single click');
      if (!expanded.has(id)) {
        expanded.add(id);
      } else if (!collapseTimers.has(id)) {
        const timer = window.setTimeout(() => {
          collapseTimers.delete(id);
          expanded.remove(id);
        }, 500);
        collapseTimers.set(id, timer);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [expanded]
  );

  return { expanded, onMouseDown, onRowClick };
};
