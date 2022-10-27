import { Resource, SecuredRichText } from '~/api/schema.graphql';
import { PromptVariant } from '../../../../ProgressReportContext';
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
  variants: PromptVariant[];
}
export interface Prompt extends Resource {
  prompt: SecuredRichText;
}
