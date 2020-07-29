/* eslint-disable import/no-default-export */

export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[];
  };
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    FileNode: ['FileVersion', 'File', 'Directory'],
    Project: ['TranslationProject', 'InternshipProject'],
    Producible: [
      'DirectScriptureProduct',
      'DerivativeScriptureProduct',
      'Film',
      'LiteracyMaterial',
      'Story',
      'Song',
    ],
    Product: ['DirectScriptureProduct', 'DerivativeScriptureProduct'],
    Engagement: ['LanguageEngagement', 'InternshipEngagement'],
    Readable: [
      'SecuredString',
      'SecuredInt',
      'SecuredFloat',
      'SecuredBoolean',
      'SecuredDateTime',
      'SecuredDate',
      'SecuredOrganization',
      'SecuredOrganizationList',
      'SecuredUserStatus',
      'SecuredUser',
      'SecuredDegree',
      'SecuredEducationList',
      'SecuredUnavailabilityList',
      'SecuredTimeZone',
      'SecuredZone',
      'SecuredRegion',
      'SecuredCountry',
      'SecuredLocationList',
      'SecuredFile',
      'SecuredCeremony',
      'SecuredProjectStep',
      'SecuredProjectList',
      'SecuredLanguage',
      'SecuredBudget',
      'SecuredInternPosition',
      'SecuredProductMediums',
      'SecuredMethodology',
      'SecuredMethodologies',
      'SecuredProductPurposes',
      'SecuredScriptureRanges',
      'SecuredProducible',
      'SecuredProductList',
      'SecuredEngagementList',
      'SecuredPartnershipAgreementStatus',
      'SecuredPartnershipTypes',
      'SecuredPartnershipList',
      'SecuredRoles',
      'SecuredProjectMemberList',
    ],
    Editable: [
      'SecuredString',
      'SecuredInt',
      'SecuredFloat',
      'SecuredBoolean',
      'SecuredDateTime',
      'SecuredDate',
      'SecuredOrganization',
      'SecuredUserStatus',
      'SecuredUser',
      'SecuredDegree',
      'SecuredTimeZone',
      'SecuredZone',
      'SecuredRegion',
      'SecuredCountry',
      'SecuredFile',
      'SecuredCeremony',
      'SecuredProjectStep',
      'SecuredLanguage',
      'SecuredBudget',
      'SecuredInternPosition',
      'SecuredProductMediums',
      'SecuredMethodology',
      'SecuredMethodologies',
      'SecuredProductPurposes',
      'SecuredScriptureRanges',
      'SecuredProducible',
      'SecuredPartnershipAgreementStatus',
      'SecuredPartnershipTypes',
      'SecuredRoles',
    ],
    Resource: [
      'Organization',
      'User',
      'Education',
      'Unavailability',
      'Zone',
      'Region',
      'Country',
      'FileVersion',
      'File',
      'Directory',
      'Ceremony',
      'TranslationProject',
      'InternshipProject',
      'Language',
      'BudgetRecord',
      'Budget',
      'DirectScriptureProduct',
      'DerivativeScriptureProduct',
      'LanguageEngagement',
      'InternshipEngagement',
      'Partnership',
      'ProjectMember',
      'Film',
      'LiteracyMaterial',
      'Story',
      'Favorite',
      'Song',
    ],
    Place: ['Zone', 'Region', 'Country'],
    Location: ['Country', 'Region', 'Zone'],
    SearchResult: [
      'Organization',
      'Country',
      'Region',
      'Zone',
      'Language',
      'TranslationProject',
      'InternshipProject',
      'User',
    ],
  },
};
export default result;

export const possibleTypes = result.possibleTypes;
