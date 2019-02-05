import { buildEnum } from '@app/core/models/enum';

export enum InternshipEngagementPosition {
  ExegeticalFacilitator = 'exegetical_facilitator',
  TranslationConsultantInTraining = 'translation_consultant_in_training',
  AdministrativeSupportSpecialist = 'administrative_support_specialist',
  BusinessSupportSpecialist = 'business_support_specialist',
  CommunicationSpecialistInternal = 'communication_specialist_internal',
  CommunicationSpecialistMarketing = 'communication_specialist_marketing',
  LanguageProgramManager = 'language_program_manager',
  LanguageProgramManagerOrFieldOperations = 'language_program_manager_field_operations',
  LanguageSoftwareSupportSpecialist = 'language_software_support_specialist',
  LeadershipDevelopment = 'leadership_development',
  LiteracySpecialist = 'literacy_specialist',
  LukePartnershipFacilitatorOrSpecialist = 'luke_partnership_facilitator_specialist',
  MobilizerOrPartnershipSupportSpecialist = 'mobilizer_partnership_support_specialist',
  OralFacilitatorOrSpecialist = 'oral_facilitator_specialist',
  PersonnelOrHrSpecialist = 'personnel_hr_specialist',
  ScriptureUseSpecialist = 'scripture_use_specialist',
  TechnicalSupportSpecialist = 'technical_support_specialist',
  TranslationFacilitator = 'translation_facilitator',
  Translator = 'translator',
}

export namespace InternshipEngagementPosition {
  const Enum = InternshipEngagementPosition;
  export const {entries, forUI, values, length, trackEntryBy, trackValueBy} = buildEnum<InternshipEngagementPosition>(Enum, {
    [Enum.ExegeticalFacilitator]: 'Exegetical Facilitator',
    [Enum.TranslationConsultantInTraining]: 'Translation Consultant in Training',
    [Enum.AdministrativeSupportSpecialist]: 'Administrative Support Specialist',
    [Enum.BusinessSupportSpecialist]: 'Business Support Specialist',
    [Enum.CommunicationSpecialistInternal]: 'Communication Specialist (Internal)',
    [Enum.CommunicationSpecialistMarketing]: 'Communication Specialist (Marketing)',
    [Enum.LanguageProgramManager]: 'Language Program Manager',
    [Enum.LanguageProgramManagerOrFieldOperations]: 'Language Program Manager/Field Operations',
    [Enum.LanguageSoftwareSupportSpecialist]: 'Language Software Support Specialist',
    [Enum.LeadershipDevelopment]: 'Leadership Development',
    [Enum.LiteracySpecialist]: 'Literacy Specialist',
    [Enum.LukePartnershipFacilitatorOrSpecialist]: 'Luke Partnership Facilitator/Specialist',
    [Enum.MobilizerOrPartnershipSupportSpecialist]: 'Mobilizer/Partnership Support Specialist',
    [Enum.OralFacilitatorOrSpecialist]: 'Oral Facilitator/Specialist',
    [Enum.PersonnelOrHrSpecialist]: 'Personnel/HR Specialist',
    [Enum.ScriptureUseSpecialist]: 'Scripture Use Specialist',
    [Enum.TechnicalSupportSpecialist]: 'Technical Support Specialist',
    [Enum.TranslationFacilitator]: 'Translation Facilitator',
    [Enum.Translator]: 'Translator',
  });
}
