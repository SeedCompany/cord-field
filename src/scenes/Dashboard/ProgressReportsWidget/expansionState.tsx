import { GridRowId } from '@mui/x-data-grid-pro';
import { createContext, useContext } from 'react';
import { SetHook } from '~/hooks';

export const ExpansionContext = createContext<SetHook<GridRowId>>(
  new Set() as any
);

export const useExpanded = () => useContext(ExpansionContext);
