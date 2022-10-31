import { Resource, Role, SecuredRichText } from '~/api/schema.graphql';
import { VariantPromptResponse } from './progressReport.fixture';

export interface ProgressReport {
  highlights: {
    available: SecuredVariantPromptResponseList;
  };
}

export interface SecuredVariantPromptResponseList {
  canRead: boolean;
  canCreate: boolean;
  total: number;
  items: VariantPromptResponse[];
  options: VariantPromptList;
}

export interface VariantPromptList {
  prompts: Prompt[];
  variants: Role[];
}
export interface Prompt extends Resource {
  prompt: SecuredRichText;
}
