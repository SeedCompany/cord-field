import { DisplayLocationFragment as MarketingRegionLookupItem } from '~/common';
import { LookupField } from '../LookupField';
import {
  InitialMarketingRegionOptionsQuery,
  InitialMarketingRegionOptionsDocument as InitialMarketingRegions,
} from './InitialMarketingRegionOptions.graphql';
import { MarketingRegionLookupDocument } from './MarketingRegionLookup.graphql';

export const MarketingRegionField = LookupField.createFor<
  MarketingRegionLookupItem,
  never,
  InitialMarketingRegionOptionsQuery
>({
  resource: 'Location',
  initial: [InitialMarketingRegions, ({ locations }) => locations.items],
  lookupDocument: MarketingRegionLookupDocument,
  label: 'Marketing Region',
  placeholder: 'Search for a marketing region',
});
