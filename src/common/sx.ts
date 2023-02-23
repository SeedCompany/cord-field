import { SxProps, Theme } from '@mui/material/styles';
// eslint-disable-next-line @seedcompany/no-restricted-imports
import { SystemStyleObject } from '@mui/system';
import { Many } from './array-helpers';

// eslint-disable-next-line @typescript-eslint/ban-types
type StyleObject = SystemStyleObject<Theme> & {};

type SxStyles = StyleObject | ((theme: Theme) => StyleObject);

/**
 * Use this type when you are defining styles as a variable.
 * @example
 * const itemSx: Sx = { m: 1, color: 'primary.main' };
 */
export type Sx = Many<SxStyles | boolean | null | undefined | SxProps<Theme>>;

export interface StyleProps {
  sx?: SxProps<Theme>;
  className?: string;
}

/**
 * A helper to compile multiple sx styles together.
 *
 * With this function the items first given take precedence over the later ones.
 * This is the opposite of sx={[]} and even classNames if you think about each
 * entry as a CSS class.
 * This keeps formatting with Prettier nice for the main use-case which is to
 * pass through the sx prop given to the component, and then declare a single
 * object/function with the default styles for the element.
 * In general, the external styles should not conflict with the internal ones, so
 * this reversal should not be a big deal.
 *
 * @example
 * sx={defaultSx(props.sx, {
 *   gap: 1
 * })}
 *
 * @example
 * sx={defaultSx([
 *   { display: 'none' },           // override
 *   props.sx,                      // component input
 *   condition && { color: 'red' }, // conditional
 *   { gap: 1 },                    // defaults
 * ])}
 */
export const defaultSx = (...styles: Sx[]): readonly SxStyles[] =>
  styles
    .flatMap((style): Many<SxStyles> => {
      if (!style || style === true) {
        return [];
      }
      if (Array.isArray(style)) {
        return defaultSx(...style);
      }
      return style as SxStyles;
    })
    .reverse();

/**
 * Normalize sx prop for extension
 * @example
 *     sx={[
 *       { ... }, // defaults
 *       ...extendSx(props.sx),
 *       { ... }, // overrides
 *     ]}
 *
 * @deprecated Use `defaultSx` instead
 */
export const extendSx = (sx?: SxProps<Theme>) => defaultSx(sx);
