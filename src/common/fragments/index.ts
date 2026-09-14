import {
  Id_InternshipProject_Fragment as InternshipProjectIdFragment,
  Id_MomentumTranslationProject_Fragment as MomentumProjectIdFragment,
  Id_MultiplicationTranslationProject_Fragment as MultiplicationProjectIdFragment,
} from './identity.graphql.ts';

export * from './common';
export * from './identity.graphql.ts';
export * from './changeset.graphql.ts';
export * from './lists.graphql.ts';
export * from './prompt.graphql.ts';
export * from './promptResponse.graphql.ts';
export * from './variant.graphql.ts';
export * from './tool.graphql.ts';

export type ProjectIdFragment =
  | MomentumProjectIdFragment
  | MultiplicationProjectIdFragment
  | InternshipProjectIdFragment;
