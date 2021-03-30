import { SortableListInput } from './types';

export const sortingFromArgs = (
  args: any,
  defaults?: SortableListInput
): SortableListInput => ({
  sort: args?.input?.sort ?? defaults?.sort,
  order: args?.input?.order ?? defaults?.order,
});
