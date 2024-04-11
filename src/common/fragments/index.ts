import {
  Id_InternshipProject_Fragment as InternshipProjectIdFragment,
  Id_MomentumTranslationProject_Fragment as MomentumProjectIdFragment,
  Id_MultiplicationTranslationProject_Fragment as MultiplicationProjectIdFragment,
} from './identity.graphql';

export * from './common';
export * from './identity.graphql';
export * from './changeset.graphql';
export * from './lists.graphql';
export * from './prompt.graphql';
export * from './promptResponse.graphql';
export * from './variant.graphql';

export type ProjectIdFragment =
  | MomentumProjectIdFragment
  | MultiplicationProjectIdFragment
  | InternshipProjectIdFragment;
