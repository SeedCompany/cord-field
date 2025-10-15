import {
  ApolloLink,
  FetchResult,
  Observable,
  Operation,
  UriFunction,
} from '@apollo/client';
import { Printer } from '@apollo/client/link/http/selectHttpOptionsAndBody';
import { isLiveQueryOperationDefinitionNode } from '@n1ru4l/graphql-live-query';
import { applyLiveQueryJSONDiffPatch } from '@n1ru4l/graphql-live-query-patch-jsondiffpatch';
import { applyAsyncIterableIteratorToSink } from '@n1ru4l/push-pull-async-iterable-iterator';
import { Repeater } from '@repeaterjs/repeater';
import { getOperationAST, print } from 'graphql';

type SSELinkOptions = EventSourceInit & { uri: UriFunction; print?: Printer };

export class SseLink extends ApolloLink {
  constructor(private readonly options: SSELinkOptions) {
    super();
  }

  request(operation: Operation): Observable<FetchResult> {
    const ctx = operation.getContext();
    const url = new URL(this.options.uri(operation));
    url.searchParams.set('operationName', operation.operationName);
    url.searchParams.set('variables', JSON.stringify(operation.variables));
    url.searchParams.set('extensions', JSON.stringify(operation.extensions));
    if (ctx.http.includeQuery) {
      url.searchParams.set(
        'query',
        this.options.print?.(operation.query, print) ?? print(operation.query)
      );
    }

    return new Observable<FetchResult>((subscriber) =>
      applyAsyncIterableIteratorToSink(
        applyLiveQueryJSONDiffPatch(
          makeEventStreamSource(url.toString(), this.options)
        ),
        subscriber
      )
    );
  }
}

export const isLive = ({ query, operationName, variables }: Operation) => {
  const definition = getOperationAST(query, operationName);
  const isSubscription =
    definition?.kind === 'OperationDefinition' &&
    definition.operation === 'subscription';

  const isLiveQuery =
    !!definition && isLiveQueryOperationDefinitionNode(definition, variables);

  return isSubscription || isLiveQuery;
};

function makeEventStreamSource(url: string, options: SSELinkOptions) {
  return new Repeater<FetchResult>(async (push, stop) => {
    const source = new EventSource(url, options);
    source.addEventListener('next', (event) => {
      const data = JSON.parse(event.data);
      if (data.patch) {
        console.debug('LiveQuery patch', data);
      }
      void push(data);
      if (source.readyState === 2) {
        stop();
      }
    });
    source.addEventListener('error', (_eventNotError) => {
      stop();
    });
    source.addEventListener('complete', () => {
      stop();
    });
    await stop;
    source.close();
  });
}
