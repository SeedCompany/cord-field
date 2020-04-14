import { buildEnum } from '@app/core/models/enum';

export enum InternshipEngagementPosition {
  ExegeticalFacilitator = 'exegetical_facilitator',
  ConsultantInTraining = 'translation_consultant_in_training',
  Administration = 'administrative_support_specialist',
  Communication = 'communication_specialist_internal',
  LanguageProgramManager = 'language_program_manager',
  LeadershipDevelopment = 'leadership_development',
  Literacy = 'literacy_specialist',
  Mobilization = 'mobilizer_partnership_support_specialist',
  OralFacilitator = 'oral_facilitator_specialist',
  Personnel = 'personnel_hr_specialist',
  ScriptureEngagement = 'scripture_use_specialist',
  Technology = 'technical_support_specialist',
  TranslationFacilitator = 'translation_facilitator',
}

export namespace InternshipEngagementPosition {
  const Enum = InternshipEngagementPosition;
  type Enum = InternshipEngagementPosition;
  export const {entries, forUI, values, length, trackEntryBy, trackValueBy} = buildEnum<InternshipEngagementPosition>(Enum, {
    [Enum.ExegeticalFacilitator]: 'Exegetical Facilitator',
    [Enum.ConsultantInTraining]: 'Consultant in Training',
    [Enum.Administration]: 'Administration',
    [Enum.Communication]: 'Communication',
    [Enum.LanguageProgramManager]: 'Language Program Manager',
    [Enum.LeadershipDevelopment]: 'Leadership Development',
    [Enum.Literacy]: 'Literacy',
    [Enum.Mobilization]: 'Mobilization',
    [Enum.OralFacilitator]: 'Oral Facilitator',
    [Enum.Personnel]: 'Personnel',
    [Enum.ScriptureEngagement]: 'Scripture Engagement',
    [Enum.Technology]: 'Technology',
    [Enum.TranslationFacilitator]: 'Translation Facilitator',
  });

  const mapping = {
    business_support_specialist: Enum.Administration,
    communication_specialist_marketing: Enum.Communication,
    language_program_manager_field_operations: Enum.LanguageProgramManager,
    language_software_support_specialist: Enum.Technology,
    luke_partnership_facilitator_specialist: Enum.LanguageProgramManager,
    translator: Enum.TranslationFacilitator,
  };
  export const parse = (val: string): Enum =>
    val in mapping ? (mapping as any)[val] : val;

  export const Groups = {
    'Quality Assurance': [
      Enum.ConsultantInTraining,
      Enum.ExegeticalFacilitator,
    ],
    'Capacity Building - Leadership': [
      Enum.LeadershipDevelopment,
      Enum.Mobilization,
      Enum.Personnel,
    ],
    'Capacity Building - Operations': [
      Enum.Communication,
      Enum.Administration,
      Enum.Technology,
      // TODO Finance
    ],
    'Capacity Building - Field Programs': [
      Enum.LanguageProgramManager,
      Enum.Literacy,
      Enum.TranslationFacilitator,
      Enum.OralFacilitator,
      Enum.ScriptureEngagement,
    ],
  };

  export const groupEntries = Object.entries(Groups);
}
