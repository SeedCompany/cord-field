import {
  Breakpoint,
  Breakpoints,
  CSSObject as CSSProperties,
} from '@mui/material';
import { lowerCase } from './case';

export const square = (size: string | number) => ({
  width: size,
  height: size,
});

export type BreakpointAt = `${Breakpoint}${'Up' | 'Down'}` | boolean;

export const applyBreakpoint = (
  breakpoints: Breakpoints,
  bpProp: BreakpointAt | undefined,
  css: CSSProperties
) =>
  bpProp === true
    ? css
    : !bpProp
    ? {}
    : {
        [breakpoints[lowerCase(bpProp.slice(2) as 'Up' | 'Down')](
          bpProp.slice(0, 2) as Breakpoint
        )]: css,
      };
