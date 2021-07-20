// eslint-disable-next-line no-restricted-imports
import {
  Breakpoint,
  Breakpoints,
} from '@material-ui/core/styles/createBreakpoints';
// eslint-disable-next-line no-restricted-imports
import { CSSProperties } from '@material-ui/styles';
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
