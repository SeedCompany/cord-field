import { buildEnum } from './enum';

export enum Role {
  Admin = 'adm',
  AreaDirector = 'ad',
  AssociateFieldCoordinator = 'afc',
  BibleTranslationLiaison = 'btl',
  Consultant = 'c',
  ConsultantManager = 'cm',
  Controller = 'con',
  Development = 'd',
  ExecutiveDevelopmentRepresentative = 'edr',
  ExecutiveLeadership = 'el',
  FieldCoordinator = 'fc',
  FieldPartner = 'fp',
  FinancialAnalyst = 'fa',
  Intern = 'i',
  Liaison = 'l',
  LeadFinancialAnalyst = 'lfa',
  Mentor = 'm',
  OfficeOfThePresident = 'ootp',
  RegionalCommunicationsCoordinator = 'rcc',
  RegionalDirector = 'rd',
  Translator = 't',
  Writer = 'w',
}

export namespace Role {
  const Enum = Role;
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum<Role>(Enum, {
    [Enum.Admin]: 'Admin',
    [Enum.AssociateFieldCoordinator]: 'Associate Field Coordinator',
    [Enum.BibleTranslationLiaison]: 'Bible Translation Liaison',
    [Enum.Consultant]: 'Consultant',
    [Enum.ConsultantManager]: 'Consultant Manager',
    [Enum.Controller]: 'Controller',
    [Enum.Development]: 'Development',
    [Enum.ExecutiveDevelopmentRepresentative]: 'Executive Development Representative',
    [Enum.ExecutiveLeadership]: 'Executive Leadership',
    [Enum.FieldCoordinator]: 'Field Coordinator',
    [Enum.FieldPartner]: 'Field Partner',
    [Enum.FinancialAnalyst]: 'Financial Analyst',
    [Enum.Intern]: 'Intern',
    [Enum.Liaison]: 'Liaison',
    [Enum.LeadFinancialAnalyst]: 'Lead Financial Analyst',
    [Enum.Mentor]: 'Mentor',
    [Enum.OfficeOfThePresident]: 'Office of the President',
    [Enum.Translator]: 'Translator',
    [Enum.Writer]: 'Writer',
    [Enum.AreaDirector]: 'Area Director',
    [Enum.RegionalCommunicationsCoordinator]: 'Regional Communication Coordinator',
    [Enum.RegionalDirector]: 'Regional Director',
  });

  export const implicit = [
    Enum.AreaDirector,
    Enum.RegionalDirector,
  ];

  export const unique = [
    Enum.AreaDirector,
    Enum.RegionalDirector,
    Enum.FieldCoordinator,
    Enum.FinancialAnalyst,
    Enum.LeadFinancialAnalyst,
    Enum.ConsultantManager,
  ];

  export const needsLocations = [
    Enum.AreaDirector,
    Enum.AssociateFieldCoordinator,
    Enum.RegionalDirector,
    Enum.Consultant,
    Enum.ConsultantManager,
    Enum.Controller,
    Enum.FieldCoordinator,
    Enum.FieldPartner,
    Enum.FinancialAnalyst,
    Enum.Intern,
    Enum.LeadFinancialAnalyst,
    Enum.Translator,
    Enum.Writer,
  ];
}
