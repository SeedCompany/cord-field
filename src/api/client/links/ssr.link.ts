import { ApolloLink } from '@apollo/client';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

export interface SsrLinkProps {
  req: ExpressRequest;
  res: ExpressResponse;
}

export const createSsrLink = ({ req, res }: SsrLinkProps) =>
  new ApolloLink((op, forward) => {
    op.setContext({
      headers: {
        ...op.getContext().headers,
        cookie: req.header('cookie'),
      },
    });

    return forward(op).map((result) => {
      // If response has new cookie values forward them on so the client can save them
      const { response } = op.getContext() as { response: Response };
      const newCookie = response.headers.get('set-cookie');
      if (newCookie) {
        res.setHeader('set-cookie', newCookie);
      }

      return result;
    });
  });
