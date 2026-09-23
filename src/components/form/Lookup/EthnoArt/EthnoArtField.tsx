import { CreateEthnoArt as CreateEthnoArtInput } from '~/api/schema.graphql.ts';
import { LookupField } from '../..';
import { CreateEthnoArt } from '../../../../scenes/Engagement/LanguageEngagement/Product/Producibles/EthnoArt/CreateEthnoArt';
import {
  EthnoArtLookupItemFragment as EthnoArt,
  EthnoArtLookupDocument,
} from './EthnoArtLookup.graphql.ts';

export const EthnoArtField = LookupField.createFor<
  EthnoArt,
  CreateEthnoArtInput
>({
  resource: 'EthnoArt',
  lookupDocument: EthnoArtLookupDocument,
  label: 'EthnoArt',
  placeholder: 'Search for an EthnoArt by name',
  CreateDialogForm: CreateEthnoArt,
  getInitialValues: (name) => ({ name }),
});
