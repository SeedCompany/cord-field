export function calculateItemsPerPage(
  containerHeight: number,
  itemHeight: number
) {
  // Throwing on an extra `1` just to play it safe
  return Math.ceil(containerHeight / itemHeight) + 1;
}
