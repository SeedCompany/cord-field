import { LookupField } from '../../index';
import {
  ProjectLookupItemFragment as Project,
  useInternshipProjectLookupLazyQuery,
  useProjectLookupLazyQuery,
  useTranslationProjectLookupLazyQuery,
} from './ProjectLookup.generated';

// translation and internship projects together
export const ProjectField = LookupField.createFor<Project>({
  resource: 'Project',
  useLookup: useProjectLookupLazyQuery,
});

export const TranslationProjectField = LookupField.createFor<Project>({
  resource: 'TranslationProject',
  useLookup: useTranslationProjectLookupLazyQuery,
});

export const InternshipProjectField = LookupField.createFor<Project>({
  resource: 'InternshipProject',
  useLookup: useInternshipProjectLookupLazyQuery,
});
