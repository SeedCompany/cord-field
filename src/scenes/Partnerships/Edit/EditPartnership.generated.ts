/* eslint-disable import/no-duplicates, @typescript-eslint/no-empty-interface */
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
import gql from 'graphql-tag';
import * as Types from '../../../api/schema.generated';
import { PartnershipCardFragment } from '../../../components/PartnershipCard/PartnershipCard.generated';
import { PartnershipCardFragmentDoc } from '../../../components/PartnershipCard/PartnershipCard.generated';

export type UpdatePartnershipMutationVariables = Types.Exact<{
  input: Types.UpdatePartnershipInput;
}>;

export interface UpdatePartnershipMutation {
  updatePartnership: { __typename?: 'UpdatePartnershipOutput' } & {
    partnership: { __typename?: 'Partnership' } & PartnershipCardFragment;
  };
}

export type DeletePartnershipMutationVariables = Types.Exact<{
  input: Types.Scalars['ID'];
}>;

export type DeletePartnershipMutation = Pick<
  Types.Mutation,
  'deletePartnership'
>;

export type EditPartnershipFragment = { __typename?: 'Partnership' } & Pick<
  Types.Partnership,
  'id'
> & {
    types: { __typename?: 'SecuredPartnershipTypes' } & Pick<
      Types.SecuredPartnershipTypes,
      'value' | 'canEdit'
    >;
    agreementStatus: {
      __typename?: 'SecuredPartnershipAgreementStatus';
    } & Pick<Types.SecuredPartnershipAgreementStatus, 'value' | 'canEdit'>;
    mouStatus: { __typename?: 'SecuredPartnershipAgreementStatus' } & Pick<
      Types.SecuredPartnershipAgreementStatus,
      'value' | 'canEdit'
    >;
    organization: { __typename?: 'Organization' } & {
      name: { __typename?: 'SecuredString' } & Pick<
        Types.SecuredString,
        'value'
      >;
    };
  };

export const EditPartnershipFragmentDoc = gql`
  fragment EditPartnership on Partnership {
    id
    types {
      value
      canEdit
    }
    agreementStatus {
      value
      canEdit
    }
    mouStatus {
      value
      canEdit
    }
    organization {
      name {
        value
      }
    }
  }
`;
export const UpdatePartnershipDocument = gql`
  mutation UpdatePartnership($input: UpdatePartnershipInput!) {
    updatePartnership(input: $input) {
      partnership {
        ...PartnershipCard
      }
    }
  }
  ${PartnershipCardFragmentDoc}
`;
export type UpdatePartnershipMutationFn = ApolloReactCommon.MutationFunction<
  UpdatePartnershipMutation,
  UpdatePartnershipMutationVariables
>;

/**
 * __useUpdatePartnershipMutation__
 *
 * To run a mutation, you first call `useUpdatePartnershipMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePartnershipMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePartnershipMutation, { data, loading, error }] = useUpdatePartnershipMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePartnershipMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdatePartnershipMutation,
    UpdatePartnershipMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    UpdatePartnershipMutation,
    UpdatePartnershipMutationVariables
  >(UpdatePartnershipDocument, baseOptions);
}
export type UpdatePartnershipMutationHookResult = ReturnType<
  typeof useUpdatePartnershipMutation
>;
export type UpdatePartnershipMutationResult = ApolloReactCommon.MutationResult<
  UpdatePartnershipMutation
>;
export type UpdatePartnershipMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdatePartnershipMutation,
  UpdatePartnershipMutationVariables
>;
export const DeletePartnershipDocument = gql`
  mutation DeletePartnership($input: ID!) {
    deletePartnership(id: $input)
  }
`;
export type DeletePartnershipMutationFn = ApolloReactCommon.MutationFunction<
  DeletePartnershipMutation,
  DeletePartnershipMutationVariables
>;

/**
 * __useDeletePartnershipMutation__
 *
 * To run a mutation, you first call `useDeletePartnershipMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePartnershipMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePartnershipMutation, { data, loading, error }] = useDeletePartnershipMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeletePartnershipMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DeletePartnershipMutation,
    DeletePartnershipMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    DeletePartnershipMutation,
    DeletePartnershipMutationVariables
  >(DeletePartnershipDocument, baseOptions);
}
export type DeletePartnershipMutationHookResult = ReturnType<
  typeof useDeletePartnershipMutation
>;
export type DeletePartnershipMutationResult = ApolloReactCommon.MutationResult<
  DeletePartnershipMutation
>;
export type DeletePartnershipMutationOptions = ApolloReactCommon.BaseMutationOptions<
  DeletePartnershipMutation,
  DeletePartnershipMutationVariables
>;
