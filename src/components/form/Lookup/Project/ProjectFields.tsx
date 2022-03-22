import { LookupField } from '../../index';
import {
  InternshipProjectLookupDocument,
  ProjectLookupItemFragment as Project,
  ProjectLookupDocument,
  TranslationProjectLookupDocument,
} from './ProjectLookup.graphql';

// translation and internship projects together
export const ProjectField = LookupField.createFor<Project>({
  resource: 'Project',
  lookupDocument: ProjectLookupDocument,
  label: 'Project',
  placeholder: 'Search for a project by name',
});

export const TranslationProjectField = LookupField.createFor<Project>({
  resource: 'TranslationProject',
  lookupDocument: TranslationProjectLookupDocument,
  label: 'Project',
  placeholder: 'Search for a project by name',
});

export const InternshipProjectField = LookupField.createFor<Project>({
  resource: 'InternshipProject',
  lookupDocument: InternshipProjectLookupDocument,
  label: 'Project',
  placeholder: 'Search for a project by name',
});
