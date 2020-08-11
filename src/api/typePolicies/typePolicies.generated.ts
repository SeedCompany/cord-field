import { TypePolicies } from '@apollo/client';
import { optional, Parsers } from './scalars/scalars.parser';
import { mergeObjects } from './secured/secured';

export const typePolicies: TypePolicies = {
  SecuredDateTime: {
    fields: {
      value: {
        read: optional(Parsers.DateTime),
      },
    },
    keyFields: false,
  },
  SecuredDate: {
    fields: {
      value: {
        read: optional(Parsers.Date),
      },
    },
    keyFields: false,
  },
  Organization: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      name: {
        merge: mergeObjects,
      },
    },
  },
  User: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      email: {
        merge: mergeObjects,
      },
      realFirstName: {
        merge: mergeObjects,
      },
      realLastName: {
        merge: mergeObjects,
      },
      displayFirstName: {
        merge: mergeObjects,
      },
      displayLastName: {
        merge: mergeObjects,
      },
      phone: {
        merge: mergeObjects,
      },
      bio: {
        merge: mergeObjects,
      },
      status: {
        merge: mergeObjects,
      },
      roles: {
        merge: mergeObjects,
      },
      timezone: {
        merge: mergeObjects,
      },
      unavailabilities: {
        merge: mergeObjects,
      },
      organizations: {
        merge: mergeObjects,
      },
      education: {
        merge: mergeObjects,
      },
    },
  },
  Education: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      degree: {
        merge: mergeObjects,
      },
      major: {
        merge: mergeObjects,
      },
      institution: {
        merge: mergeObjects,
      },
    },
  },
  Unavailability: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      start: {
        read: Parsers.DateTime,
      },
      end: {
        read: Parsers.DateTime,
      },
      description: {
        merge: mergeObjects,
      },
    },
  },
  Zone: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      name: {
        merge: mergeObjects,
      },
      director: {
        merge: mergeObjects,
      },
    },
  },
  Region: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      name: {
        merge: mergeObjects,
      },
      zone: {
        merge: mergeObjects,
      },
      director: {
        merge: mergeObjects,
      },
    },
  },
  Country: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      name: {
        merge: mergeObjects,
      },
      region: {
        merge: mergeObjects,
      },
    },
  },
  FileVersion: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
    },
  },
  File: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      modifiedAt: {
        read: Parsers.DateTime,
      },
    },
  },
  Directory: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
    },
  },
  Ceremony: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      planned: {
        merge: mergeObjects,
      },
      estimatedDate: {
        merge: mergeObjects,
      },
      actualDate: {
        merge: mergeObjects,
      },
    },
  },
  TranslationProject: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      modifiedAt: {
        read: Parsers.DateTime,
      },
      name: {
        merge: mergeObjects,
      },
      deptId: {
        merge: mergeObjects,
      },
      step: {
        merge: mergeObjects,
      },
      location: {
        merge: mergeObjects,
      },
      mouStart: {
        merge: mergeObjects,
      },
      mouEnd: {
        merge: mergeObjects,
      },
      estimatedSubmission: {
        merge: mergeObjects,
      },
      budget: {
        merge: mergeObjects,
      },
      engagements: {
        merge: mergeObjects,
      },
      team: {
        merge: mergeObjects,
      },
      partnerships: {
        merge: mergeObjects,
      },
    },
  },
  InternshipProject: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      modifiedAt: {
        read: Parsers.DateTime,
      },
      name: {
        merge: mergeObjects,
      },
      deptId: {
        merge: mergeObjects,
      },
      step: {
        merge: mergeObjects,
      },
      location: {
        merge: mergeObjects,
      },
      mouStart: {
        merge: mergeObjects,
      },
      mouEnd: {
        merge: mergeObjects,
      },
      estimatedSubmission: {
        merge: mergeObjects,
      },
      budget: {
        merge: mergeObjects,
      },
      engagements: {
        merge: mergeObjects,
      },
      team: {
        merge: mergeObjects,
      },
      partnerships: {
        merge: mergeObjects,
      },
    },
  },
  Language: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      name: {
        merge: mergeObjects,
      },
      displayName: {
        merge: mergeObjects,
      },
      displayNamePronunciation: {
        merge: mergeObjects,
      },
      isDialect: {
        merge: mergeObjects,
      },
      populationOverride: {
        merge: mergeObjects,
      },
      registryOfDialectsCode: {
        merge: mergeObjects,
      },
      leastOfThese: {
        merge: mergeObjects,
      },
      leastOfTheseReason: {
        merge: mergeObjects,
      },
      sponsorDate: {
        merge: mergeObjects,
      },
      beginFiscalYear: {
        merge: mergeObjects,
      },
      population: {
        merge: mergeObjects,
      },
      locations: {
        merge: mergeObjects,
      },
      projects: {
        merge: mergeObjects,
      },
    },
  },
  BudgetRecord: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      fiscalYear: {
        merge: mergeObjects,
      },
      amount: {
        merge: mergeObjects,
      },
      organization: {
        merge: mergeObjects,
      },
    },
  },
  Budget: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
    },
  },
  DirectScriptureProduct: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      scriptureReferences: {
        merge: mergeObjects,
      },
      mediums: {
        merge: mergeObjects,
      },
      purposes: {
        merge: mergeObjects,
      },
      methodology: {
        merge: mergeObjects,
      },
    },
  },
  DerivativeScriptureProduct: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      scriptureReferences: {
        merge: mergeObjects,
      },
      mediums: {
        merge: mergeObjects,
      },
      purposes: {
        merge: mergeObjects,
      },
      methodology: {
        merge: mergeObjects,
      },
      produces: {
        merge: mergeObjects,
      },
      scriptureReferencesOverride: {
        merge: mergeObjects,
      },
    },
  },
  LanguageEngagement: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      modifiedAt: {
        read: Parsers.DateTime,
      },
      completeDate: {
        merge: mergeObjects,
      },
      disbursementCompleteDate: {
        merge: mergeObjects,
      },
      communicationsCompleteDate: {
        merge: mergeObjects,
      },
      startDate: {
        merge: mergeObjects,
      },
      endDate: {
        merge: mergeObjects,
      },
      startDateOverride: {
        merge: mergeObjects,
      },
      endDateOverride: {
        merge: mergeObjects,
      },
      initialEndDate: {
        merge: mergeObjects,
      },
      lastSuspendedAt: {
        merge: mergeObjects,
      },
      lastReactivatedAt: {
        merge: mergeObjects,
      },
      statusModifiedAt: {
        merge: mergeObjects,
      },
      ceremony: {
        merge: mergeObjects,
      },
      firstScripture: {
        merge: mergeObjects,
      },
      lukePartnership: {
        merge: mergeObjects,
      },
      sentPrintingDate: {
        merge: mergeObjects,
      },
      paraTextRegistryId: {
        merge: mergeObjects,
      },
      language: {
        merge: mergeObjects,
      },
      products: {
        merge: mergeObjects,
      },
      pnp: {
        merge: mergeObjects,
      },
    },
  },
  InternshipEngagement: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      modifiedAt: {
        read: Parsers.DateTime,
      },
      completeDate: {
        merge: mergeObjects,
      },
      disbursementCompleteDate: {
        merge: mergeObjects,
      },
      communicationsCompleteDate: {
        merge: mergeObjects,
      },
      startDate: {
        merge: mergeObjects,
      },
      endDate: {
        merge: mergeObjects,
      },
      startDateOverride: {
        merge: mergeObjects,
      },
      endDateOverride: {
        merge: mergeObjects,
      },
      initialEndDate: {
        merge: mergeObjects,
      },
      lastSuspendedAt: {
        merge: mergeObjects,
      },
      lastReactivatedAt: {
        merge: mergeObjects,
      },
      statusModifiedAt: {
        merge: mergeObjects,
      },
      ceremony: {
        merge: mergeObjects,
      },
      position: {
        merge: mergeObjects,
      },
      methodologies: {
        merge: mergeObjects,
      },
      growthPlan: {
        merge: mergeObjects,
      },
      intern: {
        merge: mergeObjects,
      },
      mentor: {
        merge: mergeObjects,
      },
      countryOfOrigin: {
        merge: mergeObjects,
      },
    },
  },
  Partnership: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      agreementStatus: {
        merge: mergeObjects,
      },
      mouStatus: {
        merge: mergeObjects,
      },
      mouStart: {
        merge: mergeObjects,
      },
      mouEnd: {
        merge: mergeObjects,
      },
      mouStartOverride: {
        merge: mergeObjects,
      },
      mouEndOverride: {
        merge: mergeObjects,
      },
      types: {
        merge: mergeObjects,
      },
      mou: {
        merge: mergeObjects,
      },
      agreement: {
        merge: mergeObjects,
      },
    },
  },
  ProjectMember: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      modifiedAt: {
        read: Parsers.DateTime,
      },
      user: {
        merge: mergeObjects,
      },
      roles: {
        merge: mergeObjects,
      },
    },
  },
  Film: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      scriptureReferences: {
        merge: mergeObjects,
      },
      name: {
        merge: mergeObjects,
      },
    },
  },
  LiteracyMaterial: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      scriptureReferences: {
        merge: mergeObjects,
      },
      name: {
        merge: mergeObjects,
      },
    },
  },
  Story: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      scriptureReferences: {
        merge: mergeObjects,
      },
      name: {
        merge: mergeObjects,
      },
    },
  },
  Favorite: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
    },
  },
  Song: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      scriptureReferences: {
        merge: mergeObjects,
      },
      name: {
        merge: mergeObjects,
      },
    },
  },
  SecuredString: {
    keyFields: false,
  },
  SecuredInt: {
    keyFields: false,
  },
  SecuredFloat: {
    keyFields: false,
  },
  SecuredBoolean: {
    keyFields: false,
  },
  SecuredOrganization: {
    keyFields: false,
  },
  SecuredOrganizationList: {
    keyFields: false,
  },
  SecuredRoles: {
    keyFields: false,
  },
  SecuredUserStatus: {
    keyFields: false,
  },
  SecuredUser: {
    keyFields: false,
  },
  SecuredDegree: {
    keyFields: false,
  },
  SecuredEducationList: {
    keyFields: false,
  },
  SecuredUnavailabilityList: {
    keyFields: false,
  },
  SecuredTimeZone: {
    keyFields: false,
  },
  SecuredZone: {
    keyFields: false,
  },
  SecuredRegion: {
    keyFields: false,
  },
  SecuredCountry: {
    keyFields: false,
  },
  SecuredLocationList: {
    keyFields: false,
  },
  SecuredFile: {
    keyFields: false,
  },
  SecuredCeremony: {
    keyFields: false,
  },
  SecuredProjectStep: {
    keyFields: false,
  },
  SecuredProjectList: {
    keyFields: false,
  },
  EthnologueLanguage: {
    fields: {
      id: {
        merge: mergeObjects,
      },
      code: {
        merge: mergeObjects,
      },
      provisionalCode: {
        merge: mergeObjects,
      },
      name: {
        merge: mergeObjects,
      },
      population: {
        merge: mergeObjects,
      },
    },
  },
  SecuredLanguage: {
    keyFields: false,
  },
  SecuredBudget: {
    keyFields: false,
  },
  SecuredInternPosition: {
    keyFields: false,
  },
  SecuredProductMediums: {
    keyFields: false,
  },
  SecuredMethodology: {
    keyFields: false,
  },
  SecuredMethodologies: {
    keyFields: false,
  },
  SecuredProductPurposes: {
    keyFields: false,
  },
  SecuredScriptureRanges: {
    keyFields: false,
  },
  SecuredProducible: {
    keyFields: false,
  },
  SecuredProductList: {
    keyFields: false,
  },
  SecuredEngagementList: {
    keyFields: false,
  },
  SecuredPartnershipAgreementStatus: {
    keyFields: false,
  },
  SecuredPartnershipTypes: {
    keyFields: false,
  },
  SecuredPartnershipList: {
    keyFields: false,
  },
  SecuredProjectMemberList: {
    keyFields: false,
  },
};
