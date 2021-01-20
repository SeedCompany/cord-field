import { identity } from 'lodash';
import { ReactNode } from 'react';
import { ErrorMap, getErrorInfo } from '../../api/error.types';

export type ErrorRenderers = {
  [Code in keyof ErrorMap]?: ErrorRenderer<ErrorMap[Code]> | undefined;
};
export type ErrorRenderer<E> =
  | ReactNode
  | ((e: E, next: NextRenderer) => ReactNode);
export type NextRenderer<E = ErrorMap[keyof ErrorMap]> = (e: E) => ReactNode;

export const renderError = (e: unknown, renderers?: ErrorRenderers) => {
  const error = getErrorInfo(e);

  const mergedRenderers: ErrorRenderers = { ...renderers };
  const renderer = error.codes
    // get renderer for each code
    .map((c) => mergedRenderers[c])
    // remove unhandled codes
    .filter(identity)
    // normalize renderers to a standard function shape
    .map((r) => resolveRenderer(r))
    // In order to build the next function for each renderer we need to start
    // from the end and work backwards
    .reverse()
    // Compose the chain of renderers into a single function.
    // In a way, this converts [a, b, c] into a(b(c()))
    .reduce(
      (prev: NextRenderer<any>, renderer) =>
        // Return a new function with the renderer's next function scoped into it
        (e) => (typeof renderer === 'function' ? renderer(e, prev) : renderer),
      // Start with a noop next renderer
      () => undefined
    );
  return renderer(error);
};

const resolveRenderer = <E>(renderer: ErrorRenderer<E>) => (
  error: E,
  next: NextRenderer
): ReactNode =>
  typeof renderer === 'function' ? renderer(error, next) : renderer;
