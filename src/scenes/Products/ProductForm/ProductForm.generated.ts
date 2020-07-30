/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';

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
          | ({ readonly __typename: 'DirectScriptureProduct' } & Pick<
              Types.DirectScriptureProduct,
              'createdAt'
            >)
          | ({ readonly __typename: 'DerivativeScriptureProduct' } & Pick<
              Types.DerivativeScriptureProduct,
              'createdAt'
            >)
          | ({ readonly __typename: 'Film' } & Pick<Types.Film, 'createdAt'>)
          | ({ readonly __typename: 'LiteracyMaterial' } & Pick<
              Types.LiteracyMaterial,
              'createdAt'
            >)
          | ({ readonly __typename: 'Story' } & Pick<Types.Story, 'createdAt'>)
          | ({ readonly __typename: 'Song' } & Pick<Types.Song, 'createdAt'>)
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

export const ProductFormFragmentDoc = gql`
  fragment ProductForm on Product {
    ... on DerivativeScriptureProduct {
      produces {
        canRead
        canEdit
        value {
          __typename
          createdAt
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
`;
