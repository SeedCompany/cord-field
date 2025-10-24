import {
  ApolloLink,
  FetchResult,
  HttpOptions,
  Observable,
  Operation,
  UriFunction,
} from '@apollo/client';
import { isLiveQueryOperationDefinitionNode } from '@n1ru4l/graphql-live-query';
import { applyLiveQueryJSONDiffPatch } from '@n1ru4l/graphql-live-query-patch-jsondiffpatch';
import { applyAsyncIterableIteratorToSink } from '@n1ru4l/push-pull-async-iterable-iterator';
import { getOperationAST, print } from 'graphql';
import {
  Client,
  ClientOptions,
  createClient,
  RequestParams,
} from 'graphql-sse';

type SSELinkOptions = { uri: UriFunction } & Pick<HttpOptions, 'print'> &
  Pick<ClientOptions, 'credentials'>;

export class SseLink extends ApolloLink {
  private readonly client: Client;
  private readonly operationsByRequest = new WeakMap<
    RequestParams,
    Operation
  >();

  constructor(private readonly options: SSELinkOptions) {
    super();
    this.client = createClient({
      url: (request) => options.uri(this.operationsByRequest.get(request)!),
      credentials: options.credentials,
      headers: (request) =>
        this.operationsByRequest.get(request)!.getContext().headers,
    });
  }

  request(op: Operation): Observable<FetchResult> {
    const ctx = op.getContext();

    const request: RequestParams = {
      operationName: op.operationName,
      variables: op.variables,
      extensions: op.extensions,
      query: ctx.http.includeQuery
        ? this.options.print?.(op.query, print) ?? print(op.query)
        : undefined!,
    };
    this.operationsByRequest.set(request, op);

    return new Observable<FetchResult>((subscriber) =>
      applyAsyncIterableIteratorToSink(
        applyLiveQueryJSONDiffPatch(
          this.client.iterate(request) as AsyncIterable<FetchResult>
        ),
        subscriber
      )
    );
  }
}

export const isLive = ({ query, operationName, variables }: Operation) => {
  const operation = getOperationAST(query, operationName);
  if (!operation) {
    return false;
  }
  return (
    operation.operation === 'subscription' ||
    isLiveQueryOperationDefinitionNode(operation, variables)
  );
};
