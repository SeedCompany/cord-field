import { EnumParam, makeQueryHandler, withDefault } from '../../../hooks';

export const useUserFilters = makeQueryHandler({
  tab: withDefault(EnumParam(['all', 'pinned']), 'all'),
});
