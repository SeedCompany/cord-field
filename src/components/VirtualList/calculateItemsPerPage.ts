import { useEffect, useState } from 'react';

export function calculateItemsPerPage(
  containerHeight: number,
  itemHeight: number
) {
  // Throwing on an extra `1` just to play it safe
  return Math.ceil(containerHeight / itemHeight) + 1;
}

export const useItemsPerPage = (
  itemHeight: number
): [number, (height: number) => void] => {
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const updatedItemsPerPage = containerHeight
      ? calculateItemsPerPage(containerHeight, itemHeight)
      : 5;
    setItemsPerPage(updatedItemsPerPage);
  }, [itemHeight, containerHeight, setItemsPerPage]);
  return [itemsPerPage, setContainerHeight];
};
