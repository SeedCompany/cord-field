import { addDecorator, addParameters } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { HashRouter } from 'react-router-dom';
import React, { createElement } from 'react';
import { appProviders } from '../src/App';
import { Nest } from '../src/components/Nest';

addDecorator(withInfo);

const storybookProviders = [
  createElement(HashRouter),
  ...appProviders,
];

addDecorator(story => createElement(
  Nest,
  { elements: storybookProviders },
  story()
));

addParameters({
  options: {
    showRoots: true,
  },
});
