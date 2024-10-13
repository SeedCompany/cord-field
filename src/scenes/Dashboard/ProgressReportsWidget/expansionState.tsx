import {
  UnfoldLess as CollapseIcon,
  UnfoldMore as ExpandIcon,
} from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { GridRowId, useGridApiContext } from '@mui/x-data-grid-pro';
import { createContext, useContext } from 'react';
import { SetHook } from '~/hooks';

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
