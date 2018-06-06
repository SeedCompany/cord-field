import { buildEnum } from './enum';

export enum ProjectRole {
  AreaDirector = 'ad',
  Consultant = 'c',
  ConsultantManager = 'cm',
  Controller = 'con',
  FieldCoordinator = 'fc',
  FieldPartner = 'fp',
  FinancialAnalyst = 'fa',
  LeadFinancialAnalyst = 'lfa',
  RegionalDirector = 'rd',
  Writer = 'w'
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
    [ProjectRole.RegionalDirector]: 'Regional Director'
  });

  export const implicit = [
    ProjectRole.AreaDirector,
    ProjectRole.RegionalDirector
  ];
}
