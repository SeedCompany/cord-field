/**
 * @example
 * const goodIndex = unmatchedIndexThrow([1, 2, 3].indexOf(4)); // throws Error('Not found')
 * @example With custom error
 * const goodIndex = unmatchedIndexNil([1, 2, 3].indexOf(4)) ??
 *  (() => { throw new CustomError('could not find number') })();
 */
export const unmatchedIndexThrow = (index: number) => {
  if (index === -1) {
    throw new Error('Not found');
  }
  return index;
};

/**
 * @example
 * const index: number | undefined = unmatchedIndexNil([1, 2, 3].indexOf(4));
 * @example With custom error
 * const goodIndex = unmatchedIndexNil([1, 2, 3].indexOf(4)) ??
 *  (() => { throw new CustomError('could not find number') })();
 */
export const unmatchedIndexNil = (index: number) =>
  index === -1 ? undefined : index;
