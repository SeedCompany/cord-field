import { Palette, PaletteColor } from '@mui/material';
import { ConditionalKeys } from 'type-fest';
import { DiffMode } from './ChangesetDiffContext';

export const modeToPalette: Record<
  DiffMode,
  ConditionalKeys<Palette, PaletteColor>
> = {
  added: 'success',
  changed: 'info',
  removed: 'error',
};
