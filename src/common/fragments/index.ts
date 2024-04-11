import {
  Id_InternshipProject_Fragment as InternshipProjectIdFragment,
  Id_TranslationProject_Fragment as TranslationProjectIdFragment,
} from './identity.graphql';

export * from './common';
export * from './identity.graphql';
export * from './changeset.graphql';
export * from './lists.graphql';
export * from './prompt.graphql';
export * from './promptResponse.graphql';
export * from './variant.graphql';

export type ProjectIdFragment =
  | TranslationProjectIdFragment
  | InternshipProjectIdFragment;
