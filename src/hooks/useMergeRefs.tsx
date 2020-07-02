// taken from https://github.com/jaredLunde/react-hook/blob/master/packages/merged-ref/src/index.tsx

import { MutableRefObject, Ref, RefCallback } from 'react';

export const useMergeRefs = <T extends any>(
  ...refs: Array<Ref<T>>
): RefCallback<T> => (element: T) =>
  refs.forEach((ref) => {
    if (typeof ref === 'function') ref(element);
    else if (ref && typeof ref === 'object')
      (ref as MutableRefObject<T>).current = element;
  });
