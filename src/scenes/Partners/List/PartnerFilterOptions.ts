import { EnumParam, makeQueryHandler, withDefault } from '../../../hooks';

export const usePartnerFilters = makeQueryHandler({
  tab: withDefault(EnumParam(['all', 'pinned']), 'all'),
});
