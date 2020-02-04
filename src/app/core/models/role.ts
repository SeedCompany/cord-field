import { buildEnum } from './enum';

export enum Role {
  Admin = 'adm',
  RegionalDirector = 'ad',
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
  FieldOperationsDirector = 'rd',
  Translator = 't',
  Writer = 'w',
}

export namespace Role {
  const Enum = Role;
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum<Role>(Enum, {
    [Enum.Admin]: 'Admin',
    [Enum.AssociateFieldCoordinator]: 'Supporting Field Project Manager',
    [Enum.BibleTranslationLiaison]: 'Bible Translation Liaison',
    [Enum.Consultant]: 'Consultant',
    [Enum.ConsultantManager]: 'Consultant Manager',
    [Enum.Controller]: 'Controller',
    [Enum.Development]: 'Development',
    [Enum.ExecutiveDevelopmentRepresentative]: 'Executive Development Representative',
    [Enum.ExecutiveLeadership]: 'Executive Leadership',
    [Enum.FieldCoordinator]: 'Field Project Manager',
    [Enum.FieldPartner]: 'Field Partner',
    [Enum.FinancialAnalyst]: 'Financial Analyst',
    [Enum.Intern]: 'Intern',
    [Enum.Liaison]: 'Liaison',
    [Enum.LeadFinancialAnalyst]: 'Lead Financial Analyst',
    [Enum.Mentor]: 'Mentor',
    [Enum.OfficeOfThePresident]: 'Office of the President',
    [Enum.Translator]: 'Translator',
    [Enum.Writer]: 'Writer',
    [Enum.RegionalDirector]: 'Regional Director',
    [Enum.RegionalCommunicationsCoordinator]: 'Regional Communication Coordinator',
    [Enum.FieldOperationsDirector]: 'Field Operations Director',
  });

  export const implicit = [
    Enum.RegionalDirector,
    Enum.FieldOperationsDirector,
  ];

  export const unique = [
    Enum.RegionalDirector,
    Enum.FieldOperationsDirector,
    Enum.FieldCoordinator,
    Enum.FinancialAnalyst,
    Enum.LeadFinancialAnalyst,
    Enum.ConsultantManager,
  ];

  export const needsLocations = [
    Enum.RegionalDirector,
    Enum.AssociateFieldCoordinator,
    Enum.FieldOperationsDirector,
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
