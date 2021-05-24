export const logFn =
  <T extends (...args: any) => any>(fn: T, fnName?: string, ...extra: any) =>
  (...args: Parameters<T>): ReturnType<T> => {
    const res = fn(...(args as any));
    console.debug(fnName ?? fn.name, ...extra, ...(args as any), res);
    return res;
  };
