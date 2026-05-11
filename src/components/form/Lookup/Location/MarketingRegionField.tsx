import { DisplayMarketingRegionFragment as MarketingRegionLookupItem } from '~/common';
import { LookupField } from '../LookupField';
import { MarketingRegionLookupDocument } from './MarketingRegionLookup.graphql';

export const MarketingRegionField =
  LookupField.createFor<MarketingRegionLookupItem>({
    resource: 'Location',
    lookupDocument: MarketingRegionLookupDocument,
    label: 'Marketing Region',
    placeholder: 'Search for a marketing region by name',
    // Guardrail: keep results Region-only.
    resultFilter: (item) => item.type.value === 'Region',
  });
