import { buildEnum } from './enum';

export enum ProjectRole {
  Admin = 'adm',
  AreaDirector = 'ad',
  Consultant = 'c',
  ConsultantManager = 'cm',
  Controller = 'con',
  FieldCoordinator = 'fc',
  FieldPartner = 'fp',
  FinancialAnalyst = 'fa',
  Intern = 'i',
  LeadFinancialAnalyst = 'lfa',
  RegionalDirector = 'rd',
  Translator = 't',
  Writer = 'w',
}

export namespace ProjectRole {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum<ProjectRole>(ProjectRole, {
    [ProjectRole.Admin]: 'Admin',
    [ProjectRole.Consultant]: 'Consultant',
    [ProjectRole.ConsultantManager]: 'Consultant Manager',
    [ProjectRole.Controller]: 'Controller',
    [ProjectRole.FieldCoordinator]: 'Field Coordinator',
    [ProjectRole.FieldPartner]: 'Field Partner',
    [ProjectRole.FinancialAnalyst]: 'Financial Analyst',
    [ProjectRole.Intern]: 'Intern',
    [ProjectRole.LeadFinancialAnalyst]: 'Lead Financial Analyst',
    [ProjectRole.Translator]: 'Translator',
    [ProjectRole.Writer]: 'Writer',
    [ProjectRole.AreaDirector]: 'Area Director',
    [ProjectRole.RegionalDirector]: 'Regional Director',
  });

  export const implicit = [
    ProjectRole.AreaDirector,
    ProjectRole.RegionalDirector,
  ];

  export const unique = [
    ProjectRole.AreaDirector,
    ProjectRole.RegionalDirector,
    ProjectRole.FieldCoordinator,
    ProjectRole.FinancialAnalyst,
    ProjectRole.LeadFinancialAnalyst,
    ProjectRole.ConsultantManager,
  ];

  export const needsLocations = [
    ProjectRole.Consultant,
    ProjectRole.ConsultantManager,
    ProjectRole.Controller,
    ProjectRole.FieldCoordinator,
    ProjectRole.FieldPartner,
    ProjectRole.FinancialAnalyst,
    ProjectRole.Intern,
    ProjectRole.LeadFinancialAnalyst,
    ProjectRole.Translator,
    ProjectRole.Writer,
  ];
}
