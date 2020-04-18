import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { addDecorator, addParameters } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import React, { createElement } from 'react';
import { createTheme } from '../src/theme';

addDecorator(withInfo);

const theme = createTheme();
addDecorator(story => createElement(
  ThemeProvider,
  { theme },
  createElement(CssBaseline),
  story()
));

addParameters({
  options: {
    showRoots: true,
  },
});
