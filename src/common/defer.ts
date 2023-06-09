export interface Deferred<T> extends Promise<T> {
  resolve: (value: T) => void;
  reject: (reason: Error) => void;
  /**
   * @example
   * .then(...deferred.tap)
   */
  tap: [
    onFullfilled: <S>(value: S) => S | PromiseLike<S>,
    onRejected: <S = never>(reason: any) => S | PromiseLike<S>
  ];
}

export const defer = <T>(): Deferred<T> => {
  const bag = {} as any;
  const deferred: Deferred<T> = Object.assign(
    new Promise<T>((resolve, reject) =>
      Object.assign(bag, { resolve, reject })
    ),
    bag
  );
  return Object.defineProperty(deferred, 'tap', {
    get() {
      return [
        (res) => {
          bag.resolve(res);
          return res;
        },
        (reason) => {
          bag.reject(reason);
          throw reason;
        },
      ] satisfies Parameters<Promise<unknown>['then']>;
    },
  });
};
