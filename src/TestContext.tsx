import { ApolloProvider } from '@apollo/client';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';
import { useMemo, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server';
import { ChildrenProp } from '~/common';
import { createClient } from './api/client/createClient';
import { Nest } from './components/Nest';
import { RequestContext } from './hooks';

export const TestContext = ({
  url,
  children,
}: { url: string } & ChildrenProp) => {
  // @ts-expect-error yes the type doesn't match we are faking it.
  const req: ExpressRequest = useMemo(() => new Request(url), [url]);
  const res = new Response() as unknown as ExpressResponse;
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
