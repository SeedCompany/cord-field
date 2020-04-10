import { render } from '@testing-library/react';
import React from 'react';
import { App } from './App';

test('renders hello world', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/hello world/i);
  expect(linkElement).toBeInTheDocument();
});
