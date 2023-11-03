import { fromPromise, RequestHandler } from '@apollo/client';
import { delay } from '@seedcompany/common';
import { GQLOperations } from '../../operationsList';

let API_DEBUG = {
  delay: 0,
};
if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  let privateDelay = 0;
  API_DEBUG = {
    get delay() {
      return privateDelay;
    },
    set delay(newDelay) {
      privateDelay = newDelay;
      saveState();
    },
  };
  (globalThis as any).API_DEBUG = API_DEBUG;
  const saveState = () =>
    window.history.replaceState({ API_DEBUG }, window.document.title);
  const prev = window.history.state?.API_DEBUG;
  if (prev) {
    API_DEBUG.delay = prev.delay;
  }
}

export const delayLink: RequestHandler = (operation, forward) => {
  const currentDelay = API_DEBUG.delay;
  if (
    !currentDelay ||
    operation.operationName === GQLOperations.Query.Session
  ) {
    return forward(operation);
  }
  return fromPromise(delay(currentDelay)).flatMap(() => forward(operation));
};
