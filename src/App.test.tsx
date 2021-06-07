import { ApolloProvider } from '@apollo/client';
import { render } from '@testing-library/react';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';
import React, { FC, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server';
import { App } from './App';
import { Nest } from './components/Nest';
import { ServerDataProvider } from './components/ServerData';
import { RequestContext } from './hooks';
import { createServerApolloClient } from './server/renderServerSideApp';

const TestContext: FC<{ url: string }> = ({ url, children }) => {
  // @ts-expect-error yes the type doesn't match we are faking it.
  const req: ExpressRequest = new Request(url);
  const res = new Response() as unknown as ExpressResponse;
  const [client] = useState(() => createServerApolloClient(req, res, {}));
  return (
    <Nest
      elements={[
        <HelmetProvider context={{}} children={<></>} />,
        <ServerDataProvider value={{}} />,
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
