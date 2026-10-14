import type * as Types from '~/api/schema.graphql';

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type LoginWithAuth0MutationVariables = Types.Exact<{
  input: Types.LoginWithAuth0Input;
}>;


export type LoginWithAuth0Mutation = { readonly loginWithAuth0: (
    { readonly __typename?: 'LoggedIn' }
    & Pick<Types.LoggedIn, 'powers'>
    & { readonly user: (
      { readonly __typename?: 'User' }
      & Pick<Types.User, 'id' | 'fullName'>
      & { readonly email: (
        { readonly __typename?: 'SecuredStringNullable' }
        & Pick<Types.SecuredStringNullable, 'value'>
      ), readonly timezone: (
        { readonly __typename?: 'SecuredTimeZone' }
        & { readonly value?: Types.Maybe<(
          { readonly __typename?: 'TimeZone' }
          & Pick<Types.TimeZone, 'name'>
        )> }
      ), readonly roles: (
        { readonly __typename?: 'SecuredRoles' }
        & Pick<Types.SecuredRoles, 'value' | 'assignableRoles'>
      ), readonly realFirstName: (
        { readonly __typename?: 'SecuredString' }
        & Pick<Types.SecuredString, 'value'>
      ), readonly realLastName: (
        { readonly __typename?: 'SecuredString' }
        & Pick<Types.SecuredString, 'value'>
      ), readonly displayFirstName: (
        { readonly __typename?: 'SecuredString' }
        & Pick<Types.SecuredString, 'value'>
      ), readonly displayLastName: (
        { readonly __typename?: 'SecuredString' }
        & Pick<Types.SecuredString, 'value'>
      ) }
    ) }
  ) };


export const LoginWithAuth0Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginWithAuth0"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginWithAuth0Input"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginWithAuth0"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LoggedInUser"}}]}},{"kind":"Field","name":{"kind":"Name","value":"powers"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LoggedInUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timezone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"assignableRoles"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"realFirstName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"realLastName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayFirstName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"displayLastName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<LoginWithAuth0Mutation, LoginWithAuth0MutationVariables>;