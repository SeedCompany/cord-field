import { createMuiTheme, ThemeProvider, Typography } from '@material-ui/core';
import { select, text } from '@storybook/addon-knobs';
import React from 'react';
import { ProgressButton } from '../ProgressButton';

export default { title: 'Components/Typography' };

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Arial',
    button: {
      fontSize: 10,
    },
  },
});

export const Story = () => (
  <ThemeProvider theme={theme}>
    <Typography
      variant={select(
        'Variant',
        ['body1', 'caption', 'h1', 'h5', 'subtitle1'],
        'body1'
      )}
      color={select(
        'Color',
        ['primary', 'secondary', 'error', 'textPrimary'],
        'secondary'
      )}
      align={select(
        'Align',
        ['left', 'right', 'center', 'justify', 'inherit'],
        'left'
      )}
    >
      {text('Children', 'Children')}
    </Typography>
    <ProgressButton color="secondary" variant="contained">
      ProgressButton
    </ProgressButton>
  </ThemeProvider>
);
