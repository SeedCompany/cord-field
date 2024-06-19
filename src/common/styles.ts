import { css } from '@emotion/react';
import { Breakpoint, Breakpoints } from '@mui/material';
import { decomposeColor, recomposeColor } from '@mui/material/styles';
import { clamp } from 'lodash';
import { CSSObject as CSSProperties } from 'tss-react';
import { LiteralUnion } from 'type-fest';

export const square = (size: string | number) => ({
  width: size,
  height: size,
});

export type BreakpointAt =
  | LiteralUnion<`${Breakpoint}${'Up' | 'Down'}`, string>
  | boolean;

export const applyBreakpoint = (
  breakpoints: Breakpoints,
  bpProp: BreakpointAt | undefined,
  css: CSSProperties
) => {
  if (bpProp === true) {
    return css;
  }
  if (!bpProp) {
    return {};
  }
  const [bp, dir] = bpProp.endsWith('Up')
    ? ([bpProp.slice(0, -2), 'up'] as const)
    : bpProp.endsWith('Down')
    ? ([bpProp.slice(0, -4), 'down'] as const)
    : ([bpProp, 'up'] as const);
  if (bp in breakpoints.values) {
    return { [breakpoints[dir](bp as Breakpoint)]: css };
  }
  // Assume css query
  return { [bpProp]: css };
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
