/* eslint-disable no-restricted-imports */
import { createMuiTheme, Theme } from '@material-ui/core';
import { ThemeOptions as MuiThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { Overrides } from '@material-ui/core/styles/overrides';
import { ComponentsProps } from '@material-ui/core/styles/props';
import { isFunction, merge } from 'lodash';
import { Except } from 'type-fest';
import { appOverrides, appProps } from './overrides';
import { createPalette } from './palette';
import { typography } from './typography';

type ThemeToOverride = Except<Theme, 'props' | 'overrides'>;
type ResultOrThemeFn<T> = T | ((theme: ThemeToOverride) => T);
export type ThemeOptions = Except<MuiThemeOptions, 'props' | 'overrides'> & {
  dark?: boolean;
  props?: ResultOrThemeFn<ComponentsProps>;
  overrides?: ResultOrThemeFn<Overrides>;
};

const applyTheme = <T>(theme: ThemeToOverride, input: ResultOrThemeFn<T>): T =>
  isFunction(input) ? input(theme) : input;

export const createTheme = ({
  dark = false,
  props: propsInput,
  overrides: overridesInput,
  palette: paletteInput,
  ...options
}: ThemeOptions = {}) => {
  const palette = createPalette({
    ...paletteInput,
    type: dark ? 'dark' : 'light',
  });
  const theme = createMuiTheme(
    {
      shape: {
        borderRadius: 6,
      },
      ...options,
      palette,
      typography,
    },
    { dark }
  );

  const final = merge(
    theme,
    {
      props: applyTheme(theme, appProps),
      overrides: applyTheme(theme, appOverrides),
    },
    {
      props: applyTheme(theme, propsInput),
      overrides: applyTheme(theme, overridesInput),
    }
  );

  return final;
};

// Augment Material UI's theme (if/when needed)
declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    dark: boolean;
  }
}

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    dark: boolean;
  }
}
