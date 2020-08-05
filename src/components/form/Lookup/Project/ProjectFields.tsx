import { ProjectLookupItem } from '.';
import { LookupField } from '../../index';
import {
  useInternshipProjectLookupLazyQuery,
  useProjectLookupLazyQuery,
  useTranslationProjectLookupLazyQuery,
} from './ProjectLookup.generated';
// translation and internship projects together
export const ProjectField = LookupField.createFor<ProjectLookupItem>({
  resource: 'Project',
  useLookup: useProjectLookupLazyQuery,
  getOptionLabel: (option) => option?.name?.value ?? '',
});

export const TranslationProjectField = LookupField.createFor<ProjectLookupItem>(
  {
    resource: 'TranslationProject',
    useLookup: useTranslationProjectLookupLazyQuery,
    getOptionLabel: (option) => option?.name?.value ?? '',
  }
);

export const InternshipProjectField = LookupField.createFor<ProjectLookupItem>({
  resource: 'InternshipProject',
  useLookup: useInternshipProjectLookupLazyQuery,
  getOptionLabel: (option) => option?.name?.value ?? '',
});
