// ============================================================================
// TEMPORARY HAND-AUTHORED FILE — DO NOT USE AS A CODEGEN TEMPLATE
// ============================================================================
// `loginWithAuth0` is being added to the GraphQL schema in parallel, in the
// sibling `cord-api-v3` repo (branch `spike-on-auth0-setup`). Until that
// lands and this repo's `yarn gql-gen` can reach a schema that defines it,
// `callback.graphql` can't be run through codegen — `yarn gql-gen` would fail
// schema validation on an unknown mutation/input type.
//
// This file hand-rolls the types + TypedDocumentNode that `yarn gql-gen`
// would normally generate from `callback.graphql`, matching the exact style
// of the real generated files in this folder (e.g. `Login/Login.graphql.ts`,
// `Register/register.graphql.ts`) so the swap-over is mechanical:
//
//   1. Delete this file.
//   2. Run `yarn gql-gen` (now that the backend schema has `loginWithAuth0`).
//   3. In `Callback.tsx`, nothing else changes — the import path
//      `'./callback.graphql'` resolves to the real generated file instead.
//
// The shape below mirrors `LoginMutation` in `Login/Login.graphql.ts`
// (same `LoggedIn` output type, same `LoggedInUser` fragment) per the backend
// plan's decision to reuse `LoggedIn` rather than invent a new DTO.
// ============================================================================
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import type { Power } from '~/api/schema.graphql';
import type { LoggedInUserFragment } from '~/components/Session/session.graphql';

// Not yet in `~/api/schema.graphql` — hand-defined to match the planned
// `LoginWithAuth0Input { idToken: String! }` backend DTO
// (`cord-api-v3/src/core/authentication/dto/login-with-auth0.dto.ts`).
export type LoginWithAuth0Input = {
  readonly idToken: string;
};

export type LoginWithAuth0MutationVariables = {
  readonly input: LoginWithAuth0Input;
};

export type LoginWithAuth0Mutation = {
  readonly loginWithAuth0: {
    readonly __typename?: 'LoggedIn';
    readonly user: LoggedInUserFragment;
    readonly powers: ReadonlyArray<Power>;
  };
};

export const LoginWithAuth0Document = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'LoginWithAuth0' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'LoginWithAuth0Input' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'loginWithAuth0' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'FragmentSpread',
                        name: { kind: 'Name', value: 'LoggedInUser' },
                      },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'powers' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'LoggedInUser' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'User' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'email' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'value' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'timezone' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'value' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'roles' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'value' } },
                { kind: 'Field', name: { kind: 'Name', value: 'assignableRoles' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'realFirstName' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'value' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'realLastName' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'value' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'displayFirstName' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'value' } }],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'displayLastName' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'value' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  LoginWithAuth0Mutation,
  LoginWithAuth0MutationVariables
>;
