import { TypePolicies } from '@apollo/client';
import { optional, Parsers } from './scalars/scalars.parser';

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
        merge: true,
      },
    },
  },
  User: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      email: {
        merge: true,
      },
      realFirstName: {
        merge: true,
      },
      realLastName: {
        merge: true,
      },
      displayFirstName: {
        merge: true,
      },
      displayLastName: {
        merge: true,
      },
      phone: {
        merge: true,
      },
      bio: {
        merge: true,
      },
      status: {
        merge: true,
      },
      roles: {
        merge: true,
      },
      timezone: {
        merge: true,
      },
      unavailabilities: {
        merge: true,
      },
      organizations: {
        merge: true,
      },
      education: {
        merge: true,
      },
    },
  },
  Education: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      degree: {
        merge: true,
      },
      major: {
        merge: true,
      },
      institution: {
        merge: true,
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
        merge: true,
      },
    },
  },
  Zone: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      name: {
        merge: true,
      },
      director: {
        merge: true,
      },
    },
  },
  Region: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      name: {
        merge: true,
      },
      zone: {
        merge: true,
      },
      director: {
        merge: true,
      },
    },
  },
  Country: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      name: {
        merge: true,
      },
      region: {
        merge: true,
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
        merge: true,
      },
      estimatedDate: {
        merge: true,
      },
      actualDate: {
        merge: true,
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
        merge: true,
      },
      deptId: {
        merge: true,
      },
      step: {
        merge: true,
      },
      location: {
        merge: true,
      },
      mouStart: {
        merge: true,
      },
      mouEnd: {
        merge: true,
      },
      estimatedSubmission: {
        merge: true,
      },
      budget: {
        merge: true,
      },
      engagements: {
        merge: true,
      },
      team: {
        merge: true,
      },
      partnerships: {
        merge: true,
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
        merge: true,
      },
      deptId: {
        merge: true,
      },
      step: {
        merge: true,
      },
      location: {
        merge: true,
      },
      mouStart: {
        merge: true,
      },
      mouEnd: {
        merge: true,
      },
      estimatedSubmission: {
        merge: true,
      },
      budget: {
        merge: true,
      },
      engagements: {
        merge: true,
      },
      team: {
        merge: true,
      },
      partnerships: {
        merge: true,
      },
    },
  },
  Language: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      name: {
        merge: true,
      },
      displayName: {
        merge: true,
      },
      displayNamePronunciation: {
        merge: true,
      },
      isDialect: {
        merge: true,
      },
      populationOverride: {
        merge: true,
      },
      registryOfDialectsCode: {
        merge: true,
      },
      leastOfThese: {
        merge: true,
      },
      leastOfTheseReason: {
        merge: true,
      },
      sponsorDate: {
        merge: true,
      },
      beginFiscalYear: {
        merge: true,
      },
      population: {
        merge: true,
      },
      locations: {
        merge: true,
      },
      projects: {
        merge: true,
      },
    },
  },
  BudgetRecord: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      fiscalYear: {
        merge: true,
      },
      amount: {
        merge: true,
      },
      organization: {
        merge: true,
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
        merge: true,
      },
      mediums: {
        merge: true,
      },
      purposes: {
        merge: true,
      },
      methodology: {
        merge: true,
      },
    },
  },
  DerivativeScriptureProduct: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      scriptureReferences: {
        merge: true,
      },
      mediums: {
        merge: true,
      },
      purposes: {
        merge: true,
      },
      methodology: {
        merge: true,
      },
      produces: {
        merge: true,
      },
      scriptureReferencesOverride: {
        merge: true,
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
        merge: true,
      },
      disbursementCompleteDate: {
        merge: true,
      },
      communicationsCompleteDate: {
        merge: true,
      },
      startDate: {
        merge: true,
      },
      endDate: {
        merge: true,
      },
      startDateOverride: {
        merge: true,
      },
      endDateOverride: {
        merge: true,
      },
      initialEndDate: {
        merge: true,
      },
      lastSuspendedAt: {
        merge: true,
      },
      lastReactivatedAt: {
        merge: true,
      },
      statusModifiedAt: {
        merge: true,
      },
      ceremony: {
        merge: true,
      },
      firstScripture: {
        merge: true,
      },
      lukePartnership: {
        merge: true,
      },
      sentPrintingDate: {
        merge: true,
      },
      paraTextRegistryId: {
        merge: true,
      },
      language: {
        merge: true,
      },
      products: {
        merge: true,
      },
      pnp: {
        merge: true,
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
        merge: true,
      },
      disbursementCompleteDate: {
        merge: true,
      },
      communicationsCompleteDate: {
        merge: true,
      },
      startDate: {
        merge: true,
      },
      endDate: {
        merge: true,
      },
      startDateOverride: {
        merge: true,
      },
      endDateOverride: {
        merge: true,
      },
      initialEndDate: {
        merge: true,
      },
      lastSuspendedAt: {
        merge: true,
      },
      lastReactivatedAt: {
        merge: true,
      },
      statusModifiedAt: {
        merge: true,
      },
      ceremony: {
        merge: true,
      },
      position: {
        merge: true,
      },
      methodologies: {
        merge: true,
      },
      growthPlan: {
        merge: true,
      },
      intern: {
        merge: true,
      },
      mentor: {
        merge: true,
      },
      countryOfOrigin: {
        merge: true,
      },
    },
  },
  Partnership: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      agreementStatus: {
        merge: true,
      },
      mouStatus: {
        merge: true,
      },
      mouStart: {
        merge: true,
      },
      mouEnd: {
        merge: true,
      },
      mouStartOverride: {
        merge: true,
      },
      mouEndOverride: {
        merge: true,
      },
      types: {
        merge: true,
      },
      mou: {
        merge: true,
      },
      agreement: {
        merge: true,
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
        merge: true,
      },
      roles: {
        merge: true,
      },
    },
  },
  Film: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      scriptureReferences: {
        merge: true,
      },
      name: {
        merge: true,
      },
    },
  },
  LiteracyMaterial: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      scriptureReferences: {
        merge: true,
      },
      name: {
        merge: true,
      },
    },
  },
  Story: {
    fields: {
      createdAt: {
        read: Parsers.DateTime,
      },
      scriptureReferences: {
        merge: true,
      },
      name: {
        merge: true,
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
        merge: true,
      },
      name: {
        merge: true,
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
        merge: true,
      },
      code: {
        merge: true,
      },
      provisionalCode: {
        merge: true,
      },
      name: {
        merge: true,
      },
      population: {
        merge: true,
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
