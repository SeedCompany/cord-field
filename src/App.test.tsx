import { ApolloProvider } from '@apollo/client';
import { render } from '@testing-library/react';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { useMemo, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server';
import { ChildrenProp } from '~/common';
import { createClient } from './api/client/createClient';
import { App } from './App';
import { Nest } from './components/Nest';
import { RequestContext } from './hooks';

/**
 * Just enough of Express' Request for the tree under test: the router reads
 * `originalUrl`, `useLocale` calls `acceptsLanguages()`, `useUserAgent` and the
 * SSR Apollo link call `header()`, and `useDateFormatter` reads `cookies`.
 */
const fakeRequest = (url: string) =>
  ({
    originalUrl: url,
    url,
    method: 'GET',
    headers: {},
    cookies: {},
    header: () => undefined,
    get: () => undefined,
    acceptsLanguages: () => [],
    // Faked, not implemented — the real type is much wider.
  } as unknown as ExpressRequest);

/** Likewise for Response: the SSR Apollo link may call `setHeader`. */
const fakeResponse = () =>
  ({
    setHeader: () => undefined,
    getHeader: () => undefined,
  } as unknown as ExpressResponse);

const TestContext = ({ url, children }: { url: string } & ChildrenProp) => {
  const req = useMemo(() => fakeRequest(url), [url]);
  const res = fakeResponse();
  const [client] = useState(() => createClient({ ssr: { req, res } }));
  return (
    <Nest
      elements={[
        <HelmetProvider key="helmet" context={{}} children={[]} />,
        <RequestContext.Provider key="req" value={req} />,
        <StaticRouter key="router" location={req.originalUrl} />,
        <ApolloProvider key="apollo" client={client} children={[]} />,
      ]}
      children={children}
    />
  );
};

test('renders HOME', () => {
  const { getByRole } = render(
    <TestContext url="/">
      <App />
    </TestContext>
  );
  const spinner = getByRole('progressbar');
  expect(spinner).toBeInTheDocument();
});
