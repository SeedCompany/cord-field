import { css } from '@emotion/react';
import { Breakpoint, Breakpoints } from '@mui/material';
import { decomposeColor, recomposeColor } from '@mui/material/styles';
import { clamp } from 'lodash';
import { CSSObject as CSSProperties } from 'tss-react';
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

/**
 * A helper to format the grid-template-areas CSS prop.
 * @example
 * <Box
 *   sx={{
 *     display: 'grid',
 *     ...gridTemplateAreas`
 *       row1 col2
 *       row2 col2
 *     `,
 *     }} />
 */
export const gridTemplateAreas = (...args: Parameters<typeof String.raw>) => ({
  gridTemplateAreas: String.raw(...args)
    .trim()
    .split('\n')
    .map((q) => `"${q.trim()}"`)
    .join('\n'),
});

/**
 * Add this amount to the alpha channel of a color.
 */
export const increaseAlpha = (color: string, amount: number) => {
  const parts = decomposeColor(color);
  const alpha = parts.values[3];
  if (!alpha) return color;
  parts.values[3] = clamp(clamp(amount, 0, 1) + alpha, 0, 1);
  return recomposeColor(parts);
};

export const flexColumn = css({
  display: 'flex',
  flexDirection: 'column',
});
