import { SxProps, Theme } from '@mui/material/styles';

export type Sx = SxProps<Theme>;

/**
 * Normalize sx prop for extension
 * @example
 *     sx={[
 *       { ... }, // defaults
 *       ...extendSx(props.sx),
 *       { ... }, // overrides
 *     ]}
 */
export const extendSx = <Theme extends object>(
  sx: SxProps<Theme> | undefined
) =>
  (Array.isArray(sx) ? sx : sx ? [sx] : []) as Extract<SxProps<Theme>, any[]>;
