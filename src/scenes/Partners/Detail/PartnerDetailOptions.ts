import { EnumParam, makeQueryHandler, withDefault } from '~/hooks';

export const usePartnerDetailsFilters = makeQueryHandler({
  tab: withDefault(EnumParam(['profile', 'people', 'projects']), 'profile'),
});
