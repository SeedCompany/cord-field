import { GridSlotsComponent } from '@mui/x-data-grid';
import { ChangesetCell } from './ChangesetCell';
import { ChangesetRow } from './ChangesetRow';

export * from './ChangesetCell';
export * from './ChangesetRow';

export const changesetGridSlots = {
  row: ChangesetRow,
  cell: ChangesetCell,
} satisfies Partial<GridSlotsComponent>;
