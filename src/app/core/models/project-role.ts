import { buildEnum } from './enum';

export enum ProjectRole {
  Consultant = 'c',
  ConsultantManager = 'cm',
  Controller = 'con',
  FieldCoordinator = 'fc',
  FieldPartner = 'fp',
  FinancialAnalyst = 'fa',
  LeadFinancialAnalyst = 'lfa',
  Writer = 'w',

  // implicit roles (these are calculated, not explicitly added to a Project.team):
  AreaDirector = 'ad',
  BIAnalyst = 'bi',
  RegionalDirector = 'rd',
  SystemsAdmin = 'sys'
}
export namespace ProjectRole {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum(ProjectRole, {
    [ProjectRole.Consultant]: 'Consultant',
    [ProjectRole.ConsultantManager]: 'Consultant Manager',
    [ProjectRole.Controller]: 'Controller',
    [ProjectRole.FieldCoordinator]: 'Field Coordinator',
    [ProjectRole.FieldPartner]: 'Field Partner',
    [ProjectRole.FinancialAnalyst]: 'Financial Analyst',
    [ProjectRole.LeadFinancialAnalyst]: 'Lead Financial Analyst',
    [ProjectRole.Writer]: 'Writer',
    [ProjectRole.AreaDirector]: 'Area Director',
    [ProjectRole.BIAnalyst]: 'BI Analyst',
    [ProjectRole.RegionalDirector]: 'Regional Director',
    [ProjectRole.SystemsAdmin]: 'Systems Admin'
  });
  export const addable = [
    ProjectRole.Consultant,
    ProjectRole.ConsultantManager,
    ProjectRole.Controller,
    ProjectRole.FieldCoordinator,
    ProjectRole.FieldPartner,
    ProjectRole.FinancialAnalyst,
    ProjectRole.LeadFinancialAnalyst,
    ProjectRole.Writer
  ];
}
