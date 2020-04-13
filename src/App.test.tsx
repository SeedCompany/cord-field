import { render } from '@testing-library/react';
import React from 'react';
import { App } from './App';

test('renders HOME', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/HOME/i);
  expect(linkElement).toBeInTheDocument();
});
