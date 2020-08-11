/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import type * as Types from '../../../api/schema.generated';
import type { SsFragment } from '../../Users/UserForm/UserForm.generated';
import { SsFragmentDoc } from '../../Users/UserForm/UserForm.generated';

export type ProductForm_DirectScriptureProduct_Fragment = {
  readonly __typename?: 'DirectScriptureProduct';
} & Pick<Types.DirectScriptureProduct, 'id' | 'legacyType' | 'approach'> & {
    readonly scriptureReferences: {
      readonly __typename?: 'SecuredScriptureRanges';
    } & Pick<Types.SecuredScriptureRanges, 'canRead' | 'canEdit'> & {
        readonly value: ReadonlyArray<
          { readonly __typename?: 'ScriptureRange' } & {
            readonly start: {
              readonly __typename?: 'ScriptureReference';
            } & Pick<Types.ScriptureReference, 'book' | 'chapter' | 'verse'>;
            readonly end: { readonly __typename?: 'ScriptureReference' } & Pick<
              Types.ScriptureReference,
              'book' | 'chapter' | 'verse'
            >;
          }
        >;
      };
    readonly mediums: { readonly __typename?: 'SecuredProductMediums' } & Pick<
      Types.SecuredProductMediums,
      'canRead' | 'canEdit' | 'value'
    >;
    readonly purposes: {
      readonly __typename?: 'SecuredProductPurposes';
    } & Pick<Types.SecuredProductPurposes, 'canRead' | 'canEdit' | 'value'>;
    readonly methodology: { readonly __typename?: 'SecuredMethodology' } & Pick<
      Types.SecuredMethodology,
      'canRead' | 'canEdit' | 'value'
    >;
  };

export type ProductForm_DerivativeScriptureProduct_Fragment = {
  readonly __typename?: 'DerivativeScriptureProduct';
} & Pick<Types.DerivativeScriptureProduct, 'id' | 'legacyType' | 'approach'> & {
    readonly produces: { readonly __typename?: 'SecuredProducible' } & Pick<
      Types.SecuredProducible,
      'canRead' | 'canEdit'
    > & {
        readonly value?: Types.Maybe<
          | ({
              readonly __typename?: 'DirectScriptureProduct';
            } & Producible_DirectScriptureProduct_Fragment)
          | ({
              readonly __typename?: 'DerivativeScriptureProduct';
            } & Producible_DerivativeScriptureProduct_Fragment)
          | ({ readonly __typename?: 'Film' } & Producible_Film_Fragment)
          | ({
              readonly __typename?: 'LiteracyMaterial';
            } & Producible_LiteracyMaterial_Fragment)
          | ({ readonly __typename?: 'Story' } & Producible_Story_Fragment)
          | ({ readonly __typename?: 'Song' } & Producible_Song_Fragment)
        >;
      };
    readonly scriptureReferencesOverride?: Types.Maybe<
      { readonly __typename?: 'SecuredScriptureRanges' } & Pick<
        Types.SecuredScriptureRanges,
        'canRead' | 'canEdit'
      > & {
          readonly value: ReadonlyArray<
            { readonly __typename?: 'ScriptureRange' } & {
              readonly start: {
                readonly __typename?: 'ScriptureReference';
              } & Pick<Types.ScriptureReference, 'book' | 'chapter' | 'verse'>;
              readonly end: {
                readonly __typename?: 'ScriptureReference';
              } & Pick<Types.ScriptureReference, 'book' | 'chapter' | 'verse'>;
            }
          >;
        }
    >;
    readonly scriptureReferences: {
      readonly __typename?: 'SecuredScriptureRanges';
    } & Pick<Types.SecuredScriptureRanges, 'canRead' | 'canEdit'> & {
        readonly value: ReadonlyArray<
          { readonly __typename?: 'ScriptureRange' } & {
            readonly start: {
              readonly __typename?: 'ScriptureReference';
            } & Pick<Types.ScriptureReference, 'book' | 'chapter' | 'verse'>;
            readonly end: { readonly __typename?: 'ScriptureReference' } & Pick<
              Types.ScriptureReference,
              'book' | 'chapter' | 'verse'
            >;
          }
        >;
      };
    readonly mediums: { readonly __typename?: 'SecuredProductMediums' } & Pick<
      Types.SecuredProductMediums,
      'canRead' | 'canEdit' | 'value'
    >;
    readonly purposes: {
      readonly __typename?: 'SecuredProductPurposes';
    } & Pick<Types.SecuredProductPurposes, 'canRead' | 'canEdit' | 'value'>;
    readonly methodology: { readonly __typename?: 'SecuredMethodology' } & Pick<
      Types.SecuredMethodology,
      'canRead' | 'canEdit' | 'value'
    >;
  };

export type ProductFormFragment =
  | ProductForm_DirectScriptureProduct_Fragment
  | ProductForm_DerivativeScriptureProduct_Fragment;

export type Producible_DirectScriptureProduct_Fragment = {
  readonly __typename: 'DirectScriptureProduct';
} & Pick<Types.DirectScriptureProduct, 'id' | 'createdAt'>;

export type Producible_DerivativeScriptureProduct_Fragment = {
  readonly __typename: 'DerivativeScriptureProduct';
} & Pick<Types.DerivativeScriptureProduct, 'id' | 'createdAt'>;

export type Producible_Film_Fragment = { readonly __typename: 'Film' } & Pick<
  Types.Film,
  'id' | 'createdAt'
> & { readonly name: { readonly __typename?: 'SecuredString' } & SsFragment };

export type Producible_LiteracyMaterial_Fragment = {
  readonly __typename: 'LiteracyMaterial';
} & Pick<Types.LiteracyMaterial, 'id' | 'createdAt'> & {
    readonly name: { readonly __typename?: 'SecuredString' } & SsFragment;
  };

export type Producible_Story_Fragment = { readonly __typename: 'Story' } & Pick<
  Types.Story,
  'id' | 'createdAt'
> & { readonly name: { readonly __typename?: 'SecuredString' } & SsFragment };

export type Producible_Song_Fragment = { readonly __typename: 'Song' } & Pick<
  Types.Song,
  'id' | 'createdAt'
> & { readonly name: { readonly __typename?: 'SecuredString' } & SsFragment };

export type ProducibleFragment =
  | Producible_DirectScriptureProduct_Fragment
  | Producible_DerivativeScriptureProduct_Fragment
  | Producible_Film_Fragment
  | Producible_LiteracyMaterial_Fragment
  | Producible_Story_Fragment
  | Producible_Song_Fragment;

export const ProducibleFragmentDoc = gql`
  fragment Producible on Producible {
    id
    __typename
    createdAt
    ... on Film {
      name {
        ...ss
      }
    }
    ... on LiteracyMaterial {
      name {
        ...ss
      }
    }
    ... on Story {
      name {
        ...ss
      }
    }
    ... on Song {
      name {
        ...ss
      }
    }
  }
  ${SsFragmentDoc}
`;
export const ProductFormFragmentDoc = gql`
  fragment ProductForm on Product {
    ... on DerivativeScriptureProduct {
      produces {
        canRead
        canEdit
        value {
          ...Producible
        }
      }
      scriptureReferencesOverride {
        canRead
        canEdit
        value {
          start {
            book
            chapter
            verse
          }
          end {
            book
            chapter
            verse
          }
        }
      }
    }
    id
    legacyType
    scriptureReferences {
      canRead
      canEdit
      value {
        start {
          book
          chapter
          verse
        }
        end {
          book
          chapter
          verse
        }
      }
    }
    mediums {
      canRead
      canEdit
      value
    }
    purposes {
      canRead
      canEdit
      value
    }
    methodology {
      canRead
      canEdit
      value
    }
    approach
    legacyType
  }
  ${ProducibleFragmentDoc}
`;
