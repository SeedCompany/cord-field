import { ApolloProvider } from '@apollo/client';
import { render } from '@testing-library/react';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';
import React, { useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server';
import { ChildrenProp } from '~/util';
import { createClient } from './api/client/createClient';
import { App } from './App';
import { Nest } from './components/Nest';
import { RequestContext } from './hooks';

const TestContext = ({ url, children }: { url: string } & ChildrenProp) => {
  // @ts-expect-error yes the type doesn't match we are faking it.
  const req: ExpressRequest = new Request(url);
  const res = new Response() as unknown as ExpressResponse;
  const [client] = useState(() => createClient({ ssr: { req, res } }));
  return (
    <Nest
      elements={[
        <HelmetProvider context={{}} children={<></>} />,
        <RequestContext.Provider value={req} children={<></>} />,
        <StaticRouter location={req.originalUrl} />,
        <ApolloProvider client={client} children={<></>} />,
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
