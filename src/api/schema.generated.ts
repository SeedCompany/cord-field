import { DateTime } from 'luxon';
import { CalendarDate } from '../util';

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** An ISO-8601 date time string */
  DateTime: DateTime;
  /**
   * An ISO-8601 date string.
   * Time should be ignored for this field.
   */
  Date: CalendarDate;
}

export interface FileNode {
  readonly id: Scalars['ID'];
  readonly createdAt: Scalars['DateTime'];
  readonly type: FileNodeType;
  readonly category: FileNodeCategory;
  /**
   * The name of the node.
   * This is user defined but does not necessarily need to be url safe.
   */
  readonly name: Scalars['String'];
  /**
   * The user who created this node.
   * For files, this is the user who uploaded the first version of the file.
   */
  readonly createdBy: User;
  /**
   * A list of the parents all the way up the tree.
   * This can be used to populate a path-like UI,
   * without having to fetch each parent serially.
   */
  readonly parents: readonly FileNode[];
}

/** The type of node in the file tree. A file, directory or file version. */
export type FileNodeType = 'Directory' | 'File' | 'FileVersion';

/**
 * The category of the node.
 * This is intended to be a simplified version of the MIME type.
 * For example, it can be used to show different icons in a list view.
 */
export type FileNodeCategory =
  | 'Audio'
  | 'Directory'
  | 'Document'
  | 'Image'
  | 'Other'
  | 'Spreadsheet'
  | 'Video';

export interface Project {
  readonly id: Scalars['ID'];
  readonly createdAt: Scalars['DateTime'];
  readonly type: ProjectType;
  readonly sensitivity: Sensitivity;
  readonly name: SecuredString;
  /** The legacy department ID */
  readonly deptId: SecuredString;
  readonly step: SecuredProjectStep;
  readonly status: ProjectStatus;
  readonly location: SecuredCountry;
  readonly mouStart: SecuredDate;
  readonly mouEnd: SecuredDate;
  readonly estimatedSubmission: SecuredDate;
  readonly modifiedAt: Scalars['DateTime'];
  readonly avatarLetters?: Maybe<Scalars['String']>;
  /** The project's current budget */
  readonly budget: SecuredBudget;
  readonly engagements: SecuredEngagementList;
  /** The project members */
  readonly team: SecuredProjectMemberList;
  readonly partnerships: SecuredPartnershipList;
  /** The root filesystem directory of this project */
  readonly rootDirectory: Directory;
}

export interface ProjectEngagementsArgs {
  input?: Maybe<EngagementListInput>;
}

export interface ProjectTeamArgs {
  input?: Maybe<ProjectMemberListInput>;
}

export interface ProjectPartnershipsArgs {
  input?: Maybe<PartnershipListInput>;
}

export type ProjectType = 'Translation' | 'Internship';

export type Sensitivity = 'Low' | 'Medium' | 'High';

/** A alias for a group of project steps */
export type ProjectStatus =
  | 'InDevelopment'
  | 'Pending'
  | 'Active'
  | 'Stopped'
  | 'Finished';

export interface EngagementListInput {
  /** The number of items to return in a single page */
  readonly count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  readonly page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  readonly sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  readonly order?: Maybe<Order>;
  readonly filter?: Maybe<EngagementFilters>;
}

/** A sort order either ascending or descending */
export type Order = 'ASC' | 'DESC';

export interface EngagementFilters {
  /** Only engagements matching this type */
  readonly type?: Maybe<Scalars['String']>;
  /** Only engagements matching this projectId */
  readonly projectId?: Maybe<Scalars['ID']>;
}

export interface ProjectMemberListInput {
  /** The number of items to return in a single page */
  readonly count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  readonly page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  readonly sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  readonly order?: Maybe<Order>;
  readonly filter?: Maybe<ProjectMemberFilters>;
}

export interface ProjectMemberFilters {
  /** Only members with these roles */
  readonly roles?: Maybe<readonly Role[]>;
  /** Only members of this project */
  readonly projectId?: Maybe<Scalars['ID']>;
}

export type Role =
  | 'BibleTranslationLiaison'
  | 'Consultant'
  | 'ConsultantManager'
  | 'Controller'
  | 'Development'
  | 'ExecutiveDevelopmentRepresentative'
  | 'ExecutiveLeadership'
  | 'FieldOperationsDirector'
  | 'FieldPartner'
  | 'FinancialAnalyst'
  | 'Intern'
  | 'Liaison'
  | 'LeadFinancialAnalyst'
  | 'Mentor'
  | 'OfficeOfThePresident'
  | 'ProjectManager'
  | 'RegionalCommunicationsCoordinator'
  | 'RegionalDirector'
  | 'SupportingProjectManager'
  | 'Translator'
  | 'Writer';

export interface PartnershipListInput {
  /** The number of items to return in a single page */
  readonly count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  readonly page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  readonly sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  readonly order?: Maybe<Order>;
  readonly filter?: Maybe<PartnershipFilters>;
}

export interface PartnershipFilters {
  /** Find all partnerships in a project */
  readonly projectId?: Maybe<Scalars['ID']>;
}

/** Something that is _producible_ via a Product */
export interface Producible {
  readonly id: Scalars['ID'];
  readonly createdAt: Scalars['DateTime'];
  readonly scriptureReferences: SecuredScriptureRanges;
}

export interface Product {
  readonly id: Scalars['ID'];
  readonly createdAt: Scalars['DateTime'];
  readonly scriptureReferences: SecuredScriptureRanges;
  readonly mediums: SecuredProductMediums;
  readonly purposes: SecuredProductPurposes;
  readonly methodology: SecuredMethodology;
  readonly approach?: Maybe<ProductApproach>;
  /** Provide what would be the "type" of product in the old schema. */
  readonly legacyType: ProductType;
}

/** This is a roll up of methodology, for easier querying */
export type ProductApproach =
  | 'Written'
  | 'OralTranslation'
  | 'OralStories'
  | 'Visual';

export type ProductType =
  | 'BibleStories'
  | 'JesusFilm'
  | 'Songs'
  | 'LiteracyMaterials'
  | 'OldTestamentPortions'
  | 'OldTestamentFull'
  | 'Gospel'
  | 'NewTestamentPortions'
  | 'NewTestamentFull'
  | 'FullBible'
  | 'IndividualBooks'
  | 'Genesis';

export interface Engagement {
  readonly id: Scalars['ID'];
  readonly createdAt: Scalars['DateTime'];
  readonly status: EngagementStatus;
  /** Translation / Growth Plan complete date */
  readonly completeDate: SecuredDate;
  readonly disbursementCompleteDate: SecuredDate;
  readonly communicationsCompleteDate: SecuredDate;
  readonly startDate: SecuredDate;
  readonly endDate: SecuredDate;
  readonly initialEndDate: SecuredDate;
  readonly lastSuspendedAt: SecuredDateTime;
  readonly lastReactivatedAt: SecuredDateTime;
  /** The last time the engagement status was modified */
  readonly statusModifiedAt: SecuredDateTime;
  readonly modifiedAt: Scalars['DateTime'];
  readonly ceremony: SecuredCeremony;
}

export type EngagementStatus =
  | 'Active'
  | 'Completed'
  | 'Converted'
  | 'InDevelopment'
  | 'Rejected'
  | 'Suspended'
  | 'Terminated'
  | 'Unapproved'
  | 'NotRenewed'
  | 'AwaitingDedication'
  | 'Transferred';

/**
 * An object with a string `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredString = Readable &
  Editable & {
    readonly __typename?: 'SecuredString';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value?: Maybe<Scalars['String']>;
  };

/** Entities that are readable */
export interface Readable {
  /** Whether the current user can read this object */
  readonly canRead: Scalars['Boolean'];
}

/** Entities that are editable */
export interface Editable {
  /** Whether the current user can edit this object */
  readonly canEdit: Scalars['Boolean'];
}

/**
 * An object with an integer `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredInt = Readable &
  Editable & {
    readonly __typename?: 'SecuredInt';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value?: Maybe<Scalars['Int']>;
  };

/**
 * An object with a float `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredFloat = Readable &
  Editable & {
    readonly __typename?: 'SecuredFloat';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value?: Maybe<Scalars['Float']>;
  };

/**
 * An object with a boolean `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredBoolean = Readable &
  Editable & {
    readonly __typename?: 'SecuredBoolean';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value?: Maybe<Scalars['Boolean']>;
  };

export type SecuredDateTime = Readable &
  Editable & {
    readonly __typename?: 'SecuredDateTime';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value?: Maybe<Scalars['DateTime']>;
  };

export type SecuredDate = Readable &
  Editable & {
    readonly __typename?: 'SecuredDate';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value?: Maybe<Scalars['Date']>;
  };

export interface CreatePermissionOutput {
  readonly __typename?: 'CreatePermissionOutput';
  readonly success: Scalars['Boolean'];
  readonly id?: Maybe<Scalars['ID']>;
}

export interface CreateSecurityGroupOutput {
  readonly __typename?: 'CreateSecurityGroupOutput';
  readonly success: Scalars['Boolean'];
  readonly id?: Maybe<Scalars['ID']>;
}

export interface Permission {
  readonly __typename?: 'Permission';
  readonly id: Scalars['ID'];
  readonly property: Scalars['String'];
  readonly read: Scalars['Boolean'];
  readonly write: Scalars['Boolean'];
}

export interface ListPermissionOutput {
  readonly __typename?: 'ListPermissionOutput';
  readonly items: readonly Permission[];
}

export interface SecurityGroup {
  readonly __typename?: 'SecurityGroup';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
}

export interface ListSecurityGroupOutput {
  readonly __typename?: 'ListSecurityGroupOutput';
  readonly items: readonly SecurityGroup[];
}

export interface UpdateSecurityGroupNameOutput {
  readonly __typename?: 'UpdateSecurityGroupNameOutput';
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
}

export type Organization = Resource & {
  readonly __typename?: 'Organization';
  readonly id: Scalars['ID'];
  readonly createdAt: Scalars['DateTime'];
  readonly name: SecuredString;
  readonly avatarLetters?: Maybe<Scalars['String']>;
};

export interface Resource {
  readonly id: Scalars['ID'];
  readonly createdAt: Scalars['DateTime'];
}

/**
 * An object with an organization `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredOrganization = Readable &
  Editable & {
    readonly __typename?: 'SecuredOrganization';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value?: Maybe<Organization>;
  };

export interface CreateOrganizationOutput {
  readonly __typename?: 'CreateOrganizationOutput';
  readonly organization: Organization;
}

export interface OrganizationListOutput {
  readonly __typename?: 'OrganizationListOutput';
  /**
   * The page of organization.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly Organization[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
}

/**
 * An object whose `items` is a list of organizations and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is an empty list.
 * The `can*` properties are specific to the user making the request.
 */
export type SecuredOrganizationList = Readable & {
  readonly __typename?: 'SecuredOrganizationList';
  /**
   * The page of organization.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly Organization[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
  /** Whether the current user can read the list of items */
  readonly canRead: Scalars['Boolean'];
  /** Whether the current user can add items to this list via the appropriate mutation */
  readonly canCreate: Scalars['Boolean'];
};

export interface UpdateOrganizationOutput {
  readonly __typename?: 'UpdateOrganizationOutput';
  readonly organization: Organization;
}

/**
 * An object with a user status `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredUserStatus = Readable &
  Editable & {
    readonly __typename?: 'SecuredUserStatus';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value?: Maybe<UserStatus>;
  };

export type UserStatus = 'Active' | 'Disabled';

export type User = Resource & {
  readonly __typename?: 'User';
  readonly id: Scalars['ID'];
  readonly createdAt: Scalars['DateTime'];
  readonly email: SecuredString;
  readonly realFirstName: SecuredString;
  readonly realLastName: SecuredString;
  readonly displayFirstName: SecuredString;
  readonly displayLastName: SecuredString;
  readonly phone: SecuredString;
  readonly bio: SecuredString;
  readonly status: SecuredUserStatus;
  readonly fullName?: Maybe<Scalars['String']>;
  readonly firstName?: Maybe<Scalars['String']>;
  readonly avatarLetters?: Maybe<Scalars['String']>;
  readonly timezone: SecuredTimeZone;
  readonly unavailabilities: SecuredUnavailabilityList;
  readonly organizations: SecuredOrganizationList;
  readonly education: SecuredEducationList;
};

export interface UserUnavailabilitiesArgs {
  input?: Maybe<UnavailabilityListInput>;
}

export interface UserOrganizationsArgs {
  input?: Maybe<OrganizationListInput>;
}

export interface UserEducationArgs {
  input?: Maybe<EducationListInput>;
}

export interface UnavailabilityListInput {
  /** The number of items to return in a single page */
  readonly count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  readonly page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  readonly sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  readonly order?: Maybe<Order>;
  readonly filter?: Maybe<UnavailabilityFilters>;
}

export interface UnavailabilityFilters {
  /** Unavailabilities for UserId */
  readonly userId?: Maybe<Scalars['ID']>;
}

export interface OrganizationListInput {
  /** The number of items to return in a single page */
  readonly count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  readonly page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  readonly sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  readonly order?: Maybe<Order>;
  readonly filter?: Maybe<OrganizationFilters>;
}

export interface OrganizationFilters {
  /** Only organizations matching this name */
  readonly name?: Maybe<Scalars['String']>;
  /** User IDs ANY of which must belong to the organizations */
  readonly userId?: Maybe<ReadonlyArray<Scalars['ID']>>;
}

export interface EducationListInput {
  /** The number of items to return in a single page */
  readonly count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  readonly page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  readonly sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  readonly order?: Maybe<Order>;
  readonly filter?: Maybe<EducationFilters>;
}

export interface EducationFilters {
  /** Educations for UserId */
  readonly userId?: Maybe<Scalars['ID']>;
}

/**
 * An object with a user `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredUser = Readable &
  Editable & {
    readonly __typename?: 'SecuredUser';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value?: Maybe<User>;
  };

export interface UserListOutput {
  readonly __typename?: 'UserListOutput';
  /**
   * The page of user.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly User[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
}

export interface CreatePersonOutput {
  readonly __typename?: 'CreatePersonOutput';
  readonly user: User;
}

export interface UpdateUserOutput {
  readonly __typename?: 'UpdateUserOutput';
  readonly user: User;
}

/**
 * An object with a string `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredDegree = Readable &
  Editable & {
    readonly __typename?: 'SecuredDegree';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value?: Maybe<Scalars['String']>;
  };

export type Education = Resource & {
  readonly __typename?: 'Education';
  readonly id: Scalars['ID'];
  readonly createdAt: Scalars['DateTime'];
  readonly degree: SecuredDegree;
  readonly major: SecuredString;
  readonly institution: SecuredString;
};

export interface CreateEducationOutput {
  readonly __typename?: 'CreateEducationOutput';
  readonly education: Education;
}

export interface EducationListOutput {
  readonly __typename?: 'EducationListOutput';
  /**
   * The page of education.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly Education[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
}

/**
 * An object whose `items` is a list of education objects and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is an empty list.
 * The `can*` properties are specific to the user making the request.
 */
export type SecuredEducationList = Readable & {
  readonly __typename?: 'SecuredEducationList';
  /**
   * The page of education.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly Education[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
  /** Whether the current user can read the list of items */
  readonly canRead: Scalars['Boolean'];
  /** Whether the current user can add items to this list via the appropriate mutation */
  readonly canCreate: Scalars['Boolean'];
};

export interface UpdateEducationOutput {
  readonly __typename?: 'UpdateEducationOutput';
  readonly education: Education;
}

export type Unavailability = Resource & {
  readonly __typename?: 'Unavailability';
  readonly id: Scalars['ID'];
  readonly createdAt: Scalars['DateTime'];
  readonly description: SecuredString;
  readonly start: Scalars['DateTime'];
  readonly end: Scalars['DateTime'];
};

export interface CreateUnavailabilityOutput {
  readonly __typename?: 'CreateUnavailabilityOutput';
  readonly unavailability: Unavailability;
}

export interface UnavailabilityListOutput {
  readonly __typename?: 'UnavailabilityListOutput';
  /**
   * The page of unavailability.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly Unavailability[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
}

/**
 * An object whose `items` is a list of unavailabilities and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is an empty list.
 * The `can*` properties are specific to the user making the request.
 */
export type SecuredUnavailabilityList = Readable & {
  readonly __typename?: 'SecuredUnavailabilityList';
  /**
   * The page of unavailability.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly Unavailability[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
  /** Whether the current user can read the list of items */
  readonly canRead: Scalars['Boolean'];
  /** Whether the current user can add items to this list via the appropriate mutation */
  readonly canCreate: Scalars['Boolean'];
};

export interface UpdateUnavailabilityOutput {
  readonly __typename?: 'UpdateUnavailabilityOutput';
  readonly unavailability: Unavailability;
}

export interface RegisterOutput {
  readonly __typename?: 'RegisterOutput';
  readonly user: User;
}

/** An IANA Time Zone */
export interface TimeZone {
  readonly __typename?: 'TimeZone';
  readonly name: Scalars['String'];
  readonly lat: Scalars['Float'];
  readonly long: Scalars['Float'];
  readonly countries: readonly IanaCountry[];
}

/** An IANA Country associated with timezones */
export interface IanaCountry {
  readonly __typename?: 'IanaCountry';
  readonly code: Scalars['String'];
  readonly name: Scalars['String'];
  readonly zones: readonly TimeZone[];
}

/**
 * An object with a timezone `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredTimeZone = Readable &
  Editable & {
    readonly __typename?: 'SecuredTimeZone';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value?: Maybe<TimeZone>;
  };

export interface SessionOutput {
  readonly __typename?: 'SessionOutput';
  /**
   * Use this token in future requests in the Authorization header.
   * Authorization: Bearer {token}.
   * This token is only returned when the `browser` argument is not set to `true`.
   */
  readonly token?: Maybe<Scalars['String']>;
  /** Only returned if there is a logged-in user tied to the current session. */
  readonly user?: Maybe<User>;
}

export interface LoginOutput {
  readonly __typename?: 'LoginOutput';
  /** The logged-in user */
  readonly user: User;
}

export type Zone = Resource &
  Place & {
    readonly __typename?: 'Zone';
    readonly id: Scalars['ID'];
    readonly createdAt: Scalars['DateTime'];
    readonly name: SecuredString;
    readonly director: SecuredUser;
  };

export interface Place {
  readonly name: SecuredString;
}

/**
 * An object with a zone `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredZone = Readable &
  Editable & {
    readonly __typename?: 'SecuredZone';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value?: Maybe<Zone>;
  };

export type Region = Resource &
  Place & {
    readonly __typename?: 'Region';
    readonly id: Scalars['ID'];
    readonly createdAt: Scalars['DateTime'];
    readonly name: SecuredString;
    readonly zone: SecuredZone;
    readonly director: SecuredUser;
  };

/**
 * An object with a region `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredRegion = Readable &
  Editable & {
    readonly __typename?: 'SecuredRegion';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value?: Maybe<Region>;
  };

export type Country = Resource &
  Place & {
    readonly __typename?: 'Country';
    readonly id: Scalars['ID'];
    readonly createdAt: Scalars['DateTime'];
    readonly name: SecuredString;
    readonly region: SecuredRegion;
  };

/**
 * An object with a country `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredCountry = Readable &
  Editable & {
    readonly __typename?: 'SecuredCountry';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value?: Maybe<Country>;
  };

export interface CreateZoneOutput {
  readonly __typename?: 'CreateZoneOutput';
  readonly zone: Zone;
}

export interface CreateRegionOutput {
  readonly __typename?: 'CreateRegionOutput';
  readonly region: Region;
}

export interface CreateCountryOutput {
  readonly __typename?: 'CreateCountryOutput';
  readonly country: Country;
}

export interface UpdateZoneOutput {
  readonly __typename?: 'UpdateZoneOutput';
  readonly zone: Zone;
}

export interface UpdateRegionOutput {
  readonly __typename?: 'UpdateRegionOutput';
  readonly region: Region;
}

export interface UpdateCountryOutput {
  readonly __typename?: 'UpdateCountryOutput';
  readonly country: Country;
}

export interface LocationListOutput {
  readonly __typename?: 'LocationListOutput';
  /**
   * The page of locations.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly Location[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
}

export type Location = Country | Region | Zone;

export type SecuredLocationList = Readable & {
  readonly __typename?: 'SecuredLocationList';
  /**
   * An object whose `items` is a list of locations and additional authorization information.
   * The value is only given if `canRead` is `true` otherwise it is an empty list.
   * The `can*` properties are specific to the user making the request.
   */
  readonly items: readonly Location[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
  /** Whether the current user can read the list of items */
  readonly canRead: Scalars['Boolean'];
  /** Whether the current user can add items to this list via the appropriate mutation */
  readonly canCreate: Scalars['Boolean'];
};

export interface RequestUploadOutput {
  readonly __typename?: 'RequestUploadOutput';
  readonly id: Scalars['ID'];
  /** A pre-signed url to upload the file to */
  readonly url: Scalars['String'];
}

export type FileVersion = FileNode &
  Resource & {
    readonly __typename?: 'FileVersion';
    readonly mimeType: Scalars['String'];
    readonly size: Scalars['Int'];
    readonly id: Scalars['ID'];
    readonly createdAt: Scalars['DateTime'];
    readonly type: FileNodeType;
    readonly category: FileNodeCategory;
    /**
     * The name of the node.
     * This is user defined but does not necessarily need to be url safe.
     */
    readonly name: Scalars['String'];
    /**
     * The user who created this node.
     * For files, this is the user who uploaded the first version of the file.
     */
    readonly createdBy: User;
    /**
     * A list of the parents all the way up the tree.
     * This can be used to populate a path-like UI,
     * without having to fetch each parent serially.
     */
    readonly parents: readonly FileNode[];
    /** A direct url to download the file version */
    readonly downloadUrl: Scalars['String'];
  };

export type File = FileNode &
  Resource & {
    readonly __typename?: 'File';
    readonly mimeType: Scalars['String'];
    readonly size: Scalars['Int'];
    readonly id: Scalars['ID'];
    readonly createdAt: Scalars['DateTime'];
    readonly type: FileNodeType;
    readonly category: FileNodeCategory;
    /**
     * The name of the node.
     * This is user defined but does not necessarily need to be url safe.
     */
    readonly name: Scalars['String'];
    /**
     * The user who created this node.
     * For files, this is the user who uploaded the first version of the file.
     */
    readonly createdBy: User;
    /**
     * A list of the parents all the way up the tree.
     * This can be used to populate a path-like UI,
     * without having to fetch each parent serially.
     */
    readonly parents: readonly FileNode[];
    readonly modifiedAt: Scalars['DateTime'];
    /** The user who uploaded the most recent version of this file */
    readonly modifiedBy: User;
    /** Return the versions of this file */
    readonly children: FileListOutput;
    /** A direct url to download the file */
    readonly downloadUrl: Scalars['String'];
  };

export interface FileChildrenArgs {
  input?: Maybe<FileListInput>;
}

export interface FileListInput {
  /** The number of items to return in a single page */
  readonly count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  readonly page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  readonly sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  readonly order?: Maybe<Order>;
  readonly filter?: Maybe<FileFilters>;
}

export interface FileFilters {
  /** Only file nodes matching this name */
  readonly name?: Maybe<Scalars['String']>;
  /** Only file nodes matching this type */
  readonly type?: Maybe<FileNodeType>;
  /** Only file nodes matching these categories */
  readonly category?: Maybe<readonly FileNodeCategory[]>;
}

export type Directory = FileNode &
  Resource & {
    readonly __typename?: 'Directory';
    readonly id: Scalars['ID'];
    readonly createdAt: Scalars['DateTime'];
    readonly type: FileNodeType;
    readonly category: FileNodeCategory;
    /**
     * The name of the node.
     * This is user defined but does not necessarily need to be url safe.
     */
    readonly name: Scalars['String'];
    /**
     * The user who created this node.
     * For files, this is the user who uploaded the first version of the file.
     */
    readonly createdBy: User;
    /**
     * A list of the parents all the way up the tree.
     * This can be used to populate a path-like UI,
     * without having to fetch each parent serially.
     */
    readonly parents: readonly FileNode[];
    /** Return the file nodes of this directory */
    readonly children: FileListOutput;
  };

export interface DirectoryChildrenArgs {
  input?: Maybe<FileListInput>;
}

/**
 * An object with a file `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredFile = Readable &
  Editable & {
    readonly __typename?: 'SecuredFile';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value?: Maybe<File>;
  };

export interface FileListOutput {
  readonly __typename?: 'FileListOutput';
  /**
   * The page of file nodes.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly FileNode[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
}

export type Ceremony = Resource & {
  readonly __typename?: 'Ceremony';
  readonly id: Scalars['ID'];
  readonly createdAt: Scalars['DateTime'];
  readonly type: CeremonyType;
  readonly planned: SecuredBoolean;
  readonly estimatedDate: SecuredDate;
  readonly actualDate: SecuredDate;
};

export type CeremonyType = 'Dedication' | 'Certification';

/**
 * An object with a ceremony `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredCeremony = Readable &
  Editable & {
    readonly __typename?: 'SecuredCeremony';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value?: Maybe<Ceremony>;
  };

export interface CeremonyListOutput {
  readonly __typename?: 'CeremonyListOutput';
  /**
   * The page of ceremony.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly Ceremony[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
}

export interface UpdateCeremonyOutput {
  readonly __typename?: 'UpdateCeremonyOutput';
  readonly ceremony: Ceremony;
}

/**
 * An object with a project step `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredProjectStep = Readable &
  Editable & {
    readonly __typename?: 'SecuredProjectStep';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value?: Maybe<ProjectStep>;
  };

export type ProjectStep =
  | 'EarlyConversations'
  | 'PendingConceptApproval'
  | 'PrepForConsultantEndorsement'
  | 'PendingConsultantEndorsement'
  | 'PrepForGrowthPlanEndorsement'
  | 'PendingGrowthPlanEndorsement'
  | 'PrepForFinancialEndorsement'
  | 'PendingFinancialEndorsement'
  | 'FinalizingProposal'
  | 'PendingAreaDirectorApproval'
  | 'PendingRegionalDirectorApproval'
  | 'PendingFinanceConfirmation'
  | 'OnHoldFinanceConfirmation'
  | 'Active'
  | 'Rejected'
  | 'Suspended'
  | 'Terminated'
  | 'DidNotDevelop'
  | 'Completed';

export type TranslationProject = Project &
  Resource & {
    readonly __typename?: 'TranslationProject';
    readonly id: Scalars['ID'];
    readonly createdAt: Scalars['DateTime'];
    readonly type: ProjectType;
    readonly sensitivity: Sensitivity;
    readonly name: SecuredString;
    /** The legacy department ID */
    readonly deptId: SecuredString;
    readonly step: SecuredProjectStep;
    readonly status: ProjectStatus;
    readonly location: SecuredCountry;
    readonly mouStart: SecuredDate;
    readonly mouEnd: SecuredDate;
    readonly estimatedSubmission: SecuredDate;
    readonly modifiedAt: Scalars['DateTime'];
    readonly avatarLetters?: Maybe<Scalars['String']>;
    /** The project's current budget */
    readonly budget: SecuredBudget;
    readonly engagements: SecuredEngagementList;
    /** The project members */
    readonly team: SecuredProjectMemberList;
    readonly partnerships: SecuredPartnershipList;
    /** The root filesystem directory of this project */
    readonly rootDirectory: Directory;
  };

export interface TranslationProjectEngagementsArgs {
  input?: Maybe<EngagementListInput>;
}

export interface TranslationProjectTeamArgs {
  input?: Maybe<ProjectMemberListInput>;
}

export interface TranslationProjectPartnershipsArgs {
  input?: Maybe<PartnershipListInput>;
}

export type InternshipProject = Project &
  Resource & {
    readonly __typename?: 'InternshipProject';
    readonly id: Scalars['ID'];
    readonly createdAt: Scalars['DateTime'];
    readonly type: ProjectType;
    readonly sensitivity: Sensitivity;
    readonly name: SecuredString;
    /** The legacy department ID */
    readonly deptId: SecuredString;
    readonly step: SecuredProjectStep;
    readonly status: ProjectStatus;
    readonly location: SecuredCountry;
    readonly mouStart: SecuredDate;
    readonly mouEnd: SecuredDate;
    readonly estimatedSubmission: SecuredDate;
    readonly modifiedAt: Scalars['DateTime'];
    readonly avatarLetters?: Maybe<Scalars['String']>;
    /** The project's current budget */
    readonly budget: SecuredBudget;
    readonly engagements: SecuredEngagementList;
    /** The project members */
    readonly team: SecuredProjectMemberList;
    readonly partnerships: SecuredPartnershipList;
    /** The root filesystem directory of this project */
    readonly rootDirectory: Directory;
  };

export interface InternshipProjectEngagementsArgs {
  input?: Maybe<EngagementListInput>;
}

export interface InternshipProjectTeamArgs {
  input?: Maybe<ProjectMemberListInput>;
}

export interface InternshipProjectPartnershipsArgs {
  input?: Maybe<PartnershipListInput>;
}

export interface CreateProjectOutput {
  readonly __typename?: 'CreateProjectOutput';
  readonly project: Project;
}

export interface ProjectListOutput {
  readonly __typename?: 'ProjectListOutput';
  /**
   * The page of projects.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly Project[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
}

/**
 * An object whose `items` is a list of projects and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is an empty list.
 * The `can*` properties are specific to the user making the request.
 */
export type SecuredProjectList = Readable & {
  readonly __typename?: 'SecuredProjectList';
  /**
   * The page of projects.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly Project[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
  /** Whether the current user can read the list of items */
  readonly canRead: Scalars['Boolean'];
  /** Whether the current user can add items to this list via the appropriate mutation */
  readonly canCreate: Scalars['Boolean'];
};

export interface UpdateProjectOutput {
  readonly __typename?: 'UpdateProjectOutput';
  readonly project: Project;
}

export interface EthnologueLanguage {
  readonly __typename?: 'EthnologueLanguage';
  readonly id: SecuredString;
  /** ISO 639-3 code */
  readonly code: SecuredString;
  /**
   * Provisional Ethnologue Code.
   * Used until official ethnologue code is created by SIL.
   */
  readonly provisionalCode: SecuredString;
  readonly name: SecuredString;
  readonly population: SecuredInt;
}

export type Language = Resource & {
  readonly __typename?: 'Language';
  readonly id: Scalars['ID'];
  readonly createdAt: Scalars['DateTime'];
  /** The real language name */
  readonly name: SecuredString;
  /**
   * The public name which will be used/shown when real name
   * is unauthorized to be viewed/read.
   * This should always be viewable.
   */
  readonly displayName: SecuredString;
  /** The pronunciation of the display name */
  readonly displayNamePronunciation: SecuredString;
  /** Whether this language is a dialect. */
  readonly isDialect: SecuredBoolean;
  readonly ethnologue: EthnologueLanguage;
  /** An override for the ethnologue's population */
  readonly populationOverride: SecuredInt;
  /**
   * Registry of Dialects Code.
   * 5 digit number including leading zeros.
   * https://globalrecordings.net/en/rod
   */
  readonly registryOfDialectsCode: SecuredString;
  /** Whether this language has a Least Of These grant. */
  readonly leastOfThese: SecuredBoolean;
  /** Reason why this language is apart of the Least of These program. */
  readonly leastOfTheseReason: SecuredString;
  /** The earliest start date from its engagements */
  readonly sponsorDate: SecuredDate;
  /**
   * The language's sensitivity.
   * It's based on its most sensitive location.
   */
  readonly sensitivity: Sensitivity;
  readonly avatarLetters?: Maybe<Scalars['String']>;
  /** The fiscal year of the sponsor date */
  readonly beginFiscalYear: SecuredInt;
  /**
   * The language's population.
   * This is either the `populationOverride` if defined
   * or the ethnologue population as a fallback.
   */
  readonly population: SecuredInt;
  readonly locations: SecuredLocationList;
  /** The list of projects the language is engagement in. */
  readonly projects: SecuredProjectList;
};

export interface LanguageLocationsArgs {
  input?: Maybe<LocationListInput>;
}

export interface LanguageProjectsArgs {
  input?: Maybe<ProjectListInput>;
}

export interface LocationListInput {
  /** The number of items to return in a single page */
  readonly count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  readonly page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  readonly sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  readonly order?: Maybe<Order>;
  readonly filter?: Maybe<LocationFilters>;
}

export interface LocationFilters {
  /** Only locations matching this name */
  readonly name?: Maybe<Scalars['String']>;
  /** Filter to only these types of locations */
  readonly types: ReadonlyArray<Scalars['String']>;
}

export interface ProjectListInput {
  /** The number of items to return in a single page */
  readonly count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  readonly page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  readonly sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  readonly order?: Maybe<Order>;
  readonly filter?: Maybe<ProjectFilters>;
}

export interface ProjectFilters {
  /** Only projects matching this name */
  readonly name?: Maybe<Scalars['String']>;
  /** Only projects of this type */
  readonly type?: Maybe<ProjectType>;
  /** Only projects with these sensitivities */
  readonly sensitivity?: Maybe<readonly Sensitivity[]>;
  /** Only projects matching these statuses */
  readonly status?: Maybe<readonly ProjectStatus[]>;
  /** Only projects matching these steps */
  readonly step?: Maybe<readonly ProjectStep[]>;
  /** Only projects in ANY of these locations */
  readonly locationIds?: Maybe<ReadonlyArray<Scalars['ID']>>;
  /** Only projects created within this time range */
  readonly createdAt?: Maybe<DateTimeFilter>;
  /** Only projects modified within this time range */
  readonly modifiedAt?: Maybe<DateTimeFilter>;
  /** only mine */
  readonly mine?: Maybe<Scalars['Boolean']>;
  /** Cluster project */
  readonly clusters?: Maybe<Scalars['Boolean']>;
}

/** A filter range designed for date time fields */
export interface DateTimeFilter {
  /** After or equal to this time */
  readonly after?: Maybe<Scalars['DateTime']>;
  /** Before or equal to this time */
  readonly before?: Maybe<Scalars['DateTime']>;
}

/**
 * An object with a language `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredLanguage = Readable &
  Editable & {
    readonly __typename?: 'SecuredLanguage';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value?: Maybe<Language>;
  };

export interface CreateLanguageOutput {
  readonly __typename?: 'CreateLanguageOutput';
  readonly language: Language;
}

export interface LanguageListOutput {
  readonly __typename?: 'LanguageListOutput';
  /**
   * The page of language.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly Language[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
}

export interface UpdateLanguageOutput {
  readonly __typename?: 'UpdateLanguageOutput';
  readonly language: Language;
}

export type BudgetRecord = Resource & {
  readonly __typename?: 'BudgetRecord';
  readonly id: Scalars['ID'];
  readonly createdAt: Scalars['DateTime'];
  readonly fiscalYear: SecuredInt;
  readonly amount: SecuredFloat;
  readonly organization: SecuredOrganization;
};

export type Budget = Resource & {
  readonly __typename?: 'Budget';
  readonly id: Scalars['ID'];
  readonly createdAt: Scalars['DateTime'];
  readonly status: Scalars['String'];
  readonly records: readonly BudgetRecord[];
  readonly total: Scalars['Int'];
};

/**
 * An object with a budget `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredBudget = Readable &
  Editable & {
    readonly __typename?: 'SecuredBudget';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value?: Maybe<Budget>;
  };

export interface CreateBudgetOutput {
  readonly __typename?: 'CreateBudgetOutput';
  readonly budget: Budget;
}

export interface BudgetListOutput {
  readonly __typename?: 'BudgetListOutput';
  /**
   * The page of budget.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly Budget[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
}

export interface UpdateBudgetOutput {
  readonly __typename?: 'UpdateBudgetOutput';
  readonly budget: Budget;
}

export interface UpdateBudgetRecordOutput {
  readonly __typename?: 'UpdateBudgetRecordOutput';
  readonly budgetRecord: BudgetRecord;
}

/**
 * An object with an intern position `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredInternPosition = Readable &
  Editable & {
    readonly __typename?: 'SecuredInternPosition';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value?: Maybe<InternshipEngagementPosition>;
  };

export type InternshipEngagementPosition =
  | 'ExegeticalFacilitator'
  | 'TranslationConsultantInTraining'
  | 'AdministrativeSupportSpecialist'
  | 'BusinessSupportSpecialist'
  | 'CommunicationSpecialistInternal'
  | 'CommunicationSpecialistMarketing'
  | 'LanguageProgramManager'
  | 'LanguageProgramManagerOrFieldOperations'
  | 'LanguageSoftwareSupportSpecialist'
  | 'LeadershipDevelopment'
  | 'LiteracySpecialist'
  | 'LukePartnershipFacilitatorOrSpecialist'
  | 'MobilizerOrPartnershipSupportSpecialist'
  | 'OralFacilitatorOrSpecialist'
  | 'PersonnelOrHrSpecialist'
  | 'ScriptureUseSpecialist'
  | 'TechnicalSupportSpecialist'
  | 'TranslationFacilitator'
  | 'Translator';

/**
 * An object whose `value` is a list of product mediums and has additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is empty: `[]`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredProductMediums = Readable &
  Editable & {
    readonly __typename?: 'SecuredProductMediums';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value: readonly ProductMedium[];
  };

/** How the product is delivered */
export type ProductMedium =
  | 'Print'
  | 'Web'
  | 'EBook'
  | 'App'
  | 'Audio'
  | 'OralTranslation'
  | 'Video'
  | 'Other';

/**
 * An object with a product methodology `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredMethodology = Readable &
  Editable & {
    readonly __typename?: 'SecuredMethodology';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value?: Maybe<ProductMethodology>;
  };

/** How is this translation being done */
export type ProductMethodology =
  | 'Paratext'
  | 'OtherWritten'
  | 'Render'
  | 'OtherOralTranslation'
  | 'BibleStories'
  | 'BibleStorying'
  | 'OneStory'
  | 'OtherOralStories'
  | 'Film'
  | 'SignLanguage'
  | 'OtherVisual';

/**
 * An object whose `value` is a list of methodologies and has additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is empty: `[]`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredMethodologies = Readable &
  Editable & {
    readonly __typename?: 'SecuredMethodologies';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value: readonly ProductMethodology[];
  };

/**
 * An object whose `value` is a list of product purposes and has additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is empty: `[]`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredProductPurposes = Readable &
  Editable & {
    readonly __typename?: 'SecuredProductPurposes';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value: readonly ProductPurpose[];
  };

export type ProductPurpose =
  | 'EvangelismChurchPlanting'
  | 'ChurchLife'
  | 'ChurchMaturity'
  | 'SocialIssues'
  | 'Discipleship';

/** A reference to a scripture verse */
export interface ScriptureReference {
  readonly __typename?: 'ScriptureReference';
  /** The code of the Bible book */
  readonly book: Scalars['String'];
  /** The chapter number */
  readonly chapter: Scalars['Int'];
  /** The verse number */
  readonly verse: Scalars['Int'];
  readonly bookName: Scalars['String'];
  readonly label: Scalars['String'];
}

/**
 * A range of scripture.
 * i.e. Matthew 1:1-2:10
 */
export interface ScriptureRange {
  readonly __typename?: 'ScriptureRange';
  /** The starting verse */
  readonly start: ScriptureReference;
  /** The ending verse */
  readonly end: ScriptureReference;
  /**
   * A human readable label for this range.
   *
   * Examples:
   *   - Matthew
   *   - Matthew 1
   *   - Matthew 1-4
   *   - Matthew 1:4-20
   *   - Matthew 1:4-3:21
   *   - Matthew 1-John 2
   *   - Matthew 1:3-John 2:4
   */
  readonly label: Scalars['String'];
  /** The total number of verses in this scripture range */
  readonly totalVerses: Scalars['Int'];
}

/**
 * An object whose `value` is a list of scripture ranges and has additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is empty: `[]`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredScriptureRanges = Readable &
  Editable & {
    readonly __typename?: 'SecuredScriptureRanges';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value: readonly ScriptureRange[];
  };

/**
 * An object with a producible `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredProducible = Readable &
  Editable & {
    readonly __typename?: 'SecuredProducible';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value?: Maybe<Producible>;
  };

/** A product producing direct scripture only. */
export type DirectScriptureProduct = Product &
  Producible &
  Resource & {
    readonly __typename?: 'DirectScriptureProduct';
    readonly id: Scalars['ID'];
    readonly createdAt: Scalars['DateTime'];
    readonly scriptureReferences: SecuredScriptureRanges;
    readonly mediums: SecuredProductMediums;
    readonly purposes: SecuredProductPurposes;
    readonly methodology: SecuredMethodology;
    readonly approach?: Maybe<ProductApproach>;
    /** Provide what would be the "type" of product in the old schema. */
    readonly legacyType: ProductType;
  };

/**
 * A product producing derivative of scripture.
 * Only meaning that this has a relationship to a `Producible` object.
 */
export type DerivativeScriptureProduct = Product &
  Producible &
  Resource & {
    readonly __typename?: 'DerivativeScriptureProduct';
    readonly id: Scalars['ID'];
    readonly createdAt: Scalars['DateTime'];
    readonly scriptureReferences: SecuredScriptureRanges;
    readonly mediums: SecuredProductMediums;
    readonly purposes: SecuredProductPurposes;
    readonly methodology: SecuredMethodology;
    readonly approach?: Maybe<ProductApproach>;
    /** Provide what would be the "type" of product in the old schema. */
    readonly legacyType: ProductType;
    /**
     * The object that this product is producing.
     * i.e. A film named "Jesus Film".
     */
    readonly produces: SecuredProducible;
    /**
     * The `Producible` defines a `scriptureReferences` list, and this is
     * used by default in this product's `scriptureReferences` list.
     * If this product _specifically_ needs to customize the references, then
     * this property can be set (and read) to "override" the `producible`'s list.
     */
    readonly scriptureReferencesOverride?: Maybe<SecuredScriptureRanges>;
  };

export interface CreateProductOutput {
  readonly __typename?: 'CreateProductOutput';
  readonly product: Product;
}

export interface UpdateProductOutput {
  readonly __typename?: 'UpdateProductOutput';
  readonly product: Product;
}

export interface ProductListOutput {
  readonly __typename?: 'ProductListOutput';
  /**
   * The page of product.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly Product[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
}

/**
 * An object whose `items` is a list of products and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is an empty list.
 * The `can*` properties are specific to the user making the request.
 */
export type SecuredProductList = Readable & {
  readonly __typename?: 'SecuredProductList';
  /**
   * The page of product.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly Product[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
  /** Whether the current user can read the list of items */
  readonly canRead: Scalars['Boolean'];
  /** Whether the current user can add items to this list via the appropriate mutation */
  readonly canCreate: Scalars['Boolean'];
};

export type LanguageEngagement = Engagement &
  Resource & {
    readonly __typename?: 'LanguageEngagement';
    readonly id: Scalars['ID'];
    readonly createdAt: Scalars['DateTime'];
    readonly status: EngagementStatus;
    /** Translation / Growth Plan complete date */
    readonly completeDate: SecuredDate;
    readonly disbursementCompleteDate: SecuredDate;
    readonly communicationsCompleteDate: SecuredDate;
    readonly startDate: SecuredDate;
    readonly endDate: SecuredDate;
    readonly initialEndDate: SecuredDate;
    readonly lastSuspendedAt: SecuredDateTime;
    readonly lastReactivatedAt: SecuredDateTime;
    /** The last time the engagement status was modified */
    readonly statusModifiedAt: SecuredDateTime;
    readonly modifiedAt: Scalars['DateTime'];
    readonly ceremony: SecuredCeremony;
    readonly firstScripture: SecuredBoolean;
    readonly lukePartnership: SecuredBoolean;
    /** Not used anymore, but exposing for legacy data. */
    readonly sentPrintingDate: SecuredDate;
    readonly paraTextRegistryId: SecuredString;
    readonly language: SecuredLanguage;
    readonly products: SecuredProductList;
    readonly pnp: SecuredFile;
  };

export interface LanguageEngagementProductsArgs {
  input?: Maybe<ProductListInput>;
}

export interface ProductListInput {
  /** The number of items to return in a single page */
  readonly count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  readonly page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  readonly sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  readonly order?: Maybe<Order>;
  readonly filter?: Maybe<ProductFilters>;
}

export interface ProductFilters {
  /** Only products matching this approach */
  readonly approach?: Maybe<ProductApproach>;
  /** Only products matching this methodology */
  readonly methodology?: Maybe<ProductMethodology>;
}

export type InternshipEngagement = Engagement &
  Resource & {
    readonly __typename?: 'InternshipEngagement';
    readonly id: Scalars['ID'];
    readonly createdAt: Scalars['DateTime'];
    readonly status: EngagementStatus;
    /** Translation / Growth Plan complete date */
    readonly completeDate: SecuredDate;
    readonly disbursementCompleteDate: SecuredDate;
    readonly communicationsCompleteDate: SecuredDate;
    readonly startDate: SecuredDate;
    readonly endDate: SecuredDate;
    readonly initialEndDate: SecuredDate;
    readonly lastSuspendedAt: SecuredDateTime;
    readonly lastReactivatedAt: SecuredDateTime;
    /** The last time the engagement status was modified */
    readonly statusModifiedAt: SecuredDateTime;
    readonly modifiedAt: Scalars['DateTime'];
    readonly ceremony: SecuredCeremony;
    readonly position: SecuredInternPosition;
    readonly methodologies: SecuredMethodologies;
    readonly growthPlan: SecuredFile;
    readonly intern: SecuredUser;
    readonly mentor: SecuredUser;
    readonly countryOfOrigin: SecuredCountry;
  };

export interface CreateLanguageEngagementOutput {
  readonly __typename?: 'CreateLanguageEngagementOutput';
  readonly engagement: LanguageEngagement;
}

export interface CreateInternshipEngagementOutput {
  readonly __typename?: 'CreateInternshipEngagementOutput';
  readonly engagement: InternshipEngagement;
}

export interface EngagementListOutput {
  readonly __typename?: 'EngagementListOutput';
  /**
   * The page of engagements.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly Engagement[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
}

/**
 * An object whose `items` is a list of engagements and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is an empty list.
 * The `can*` properties are specific to the user making the request.
 */
export type SecuredEngagementList = Readable & {
  readonly __typename?: 'SecuredEngagementList';
  /**
   * The page of engagements.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly Engagement[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
  /** Whether the current user can read the list of items */
  readonly canRead: Scalars['Boolean'];
  /** Whether the current user can add items to this list via the appropriate mutation */
  readonly canCreate: Scalars['Boolean'];
};

export interface UpdateLanguageEngagementOutput {
  readonly __typename?: 'UpdateLanguageEngagementOutput';
  readonly engagement: LanguageEngagement;
}

export interface UpdateInternshipEngagementOutput {
  readonly __typename?: 'UpdateInternshipEngagementOutput';
  readonly engagement: InternshipEngagement;
}

/**
 * An object with a partnership agreement status `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredPartnershipAgreementStatus = Readable &
  Editable & {
    readonly __typename?: 'SecuredPartnershipAgreementStatus';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value?: Maybe<PartnershipAgreementStatus>;
  };

export type PartnershipAgreementStatus =
  | 'NotAttached'
  | 'AwaitingSignature'
  | 'Signed';

/**
 * An object whose `value` is a list of partnership types and has additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is empty: `[]`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredPartnershipTypes = Readable &
  Editable & {
    readonly __typename?: 'SecuredPartnershipTypes';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value: readonly PartnershipType[];
  };

export type PartnershipType =
  | 'Managing'
  | 'Funding'
  | 'Impact'
  | 'Technical'
  | 'Resource';

export type Partnership = Resource & {
  readonly __typename?: 'Partnership';
  readonly id: Scalars['ID'];
  readonly createdAt: Scalars['DateTime'];
  readonly agreementStatus: SecuredPartnershipAgreementStatus;
  readonly mouStatus: SecuredPartnershipAgreementStatus;
  readonly mouStart: SecuredDate;
  readonly mouEnd: SecuredDate;
  readonly mouStartOverride: SecuredDate;
  readonly mouEndOverride: SecuredDate;
  readonly organization: Organization;
  readonly types: SecuredPartnershipTypes;
  /** The MOU agreement */
  readonly mou: SecuredFile;
  /** The partner agreement */
  readonly agreement: SecuredFile;
};

export interface CreatePartnershipOutput {
  readonly __typename?: 'CreatePartnershipOutput';
  readonly partnership: Partnership;
}

export interface UpdatePartnershipOutput {
  readonly __typename?: 'UpdatePartnershipOutput';
  readonly partnership: Partnership;
}

export interface PartnershipListOutput {
  readonly __typename?: 'PartnershipListOutput';
  /**
   * The page of partnership.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly Partnership[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
}

/**
 * An object whose `items` is a list of partnership objects and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is an empty list.
 * The `can*` properties are specific to the user making the request.
 */
export type SecuredPartnershipList = Readable & {
  readonly __typename?: 'SecuredPartnershipList';
  /**
   * The page of partnership.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly Partnership[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
  /** Whether the current user can read the list of items */
  readonly canRead: Scalars['Boolean'];
  /** Whether the current user can add items to this list via the appropriate mutation */
  readonly canCreate: Scalars['Boolean'];
};

/**
 * An object whose `value` is a list of roles and has additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is empty: `[]`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredRoles = Readable &
  Editable & {
    readonly __typename?: 'SecuredRoles';
    readonly canEdit: Scalars['Boolean'];
    readonly canRead: Scalars['Boolean'];
    readonly value: readonly Role[];
  };

export type ProjectMember = Resource & {
  readonly __typename?: 'ProjectMember';
  readonly id: Scalars['ID'];
  readonly createdAt: Scalars['DateTime'];
  readonly user: SecuredUser;
  readonly roles: SecuredRoles;
  readonly modifiedAt: Scalars['DateTime'];
};

export interface CreateProjectMemberOutput {
  readonly __typename?: 'CreateProjectMemberOutput';
  readonly projectMember: ProjectMember;
}

export interface UpdateProjectMemberOutput {
  readonly __typename?: 'UpdateProjectMemberOutput';
  readonly projectMember: ProjectMember;
}

export interface ProjectMemberListOutput {
  readonly __typename?: 'ProjectMemberListOutput';
  /**
   * The page of projectmember.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly ProjectMember[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
}

/**
 * An object whose `items` is a list of project members and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is an empty list.
 * The `can*` properties are specific to the user making the request.
 */
export type SecuredProjectMemberList = Readable & {
  readonly __typename?: 'SecuredProjectMemberList';
  /**
   * The page of projectmember.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly ProjectMember[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
  /** Whether the current user can read the list of items */
  readonly canRead: Scalars['Boolean'];
  /** Whether the current user can add items to this list via the appropriate mutation */
  readonly canCreate: Scalars['Boolean'];
};

export type Film = Producible &
  Resource & {
    readonly __typename?: 'Film';
    readonly id: Scalars['ID'];
    readonly createdAt: Scalars['DateTime'];
    readonly scriptureReferences: SecuredScriptureRanges;
    readonly name: SecuredString;
  };

export interface CreateFilmOutput {
  readonly __typename?: 'CreateFilmOutput';
  readonly film: Film;
}

export interface FilmListOutput {
  readonly __typename?: 'FilmListOutput';
  /**
   * The page of film.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly Film[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
}

export interface UpdateFilmOutput {
  readonly __typename?: 'UpdateFilmOutput';
  readonly film: Film;
}

export type LiteracyMaterial = Producible &
  Resource & {
    readonly __typename?: 'LiteracyMaterial';
    readonly id: Scalars['ID'];
    readonly createdAt: Scalars['DateTime'];
    readonly scriptureReferences: SecuredScriptureRanges;
    readonly name: SecuredString;
  };

export interface CreateLiteracyMaterialOutput {
  readonly __typename?: 'CreateLiteracyMaterialOutput';
  readonly literacyMaterial: LiteracyMaterial;
}

export interface LiteracyMaterialListOutput {
  readonly __typename?: 'LiteracyMaterialListOutput';
  /**
   * The page of literacymaterial.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly LiteracyMaterial[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
}

export interface UpdateLiteracyMaterialOutput {
  readonly __typename?: 'UpdateLiteracyMaterialOutput';
  readonly literacyMaterial: LiteracyMaterial;
}

export type Story = Producible &
  Resource & {
    readonly __typename?: 'Story';
    readonly id: Scalars['ID'];
    readonly createdAt: Scalars['DateTime'];
    readonly scriptureReferences: SecuredScriptureRanges;
    readonly name: SecuredString;
  };

export interface CreateStoryOutput {
  readonly __typename?: 'CreateStoryOutput';
  readonly story: Story;
}

export interface StoryListOutput {
  readonly __typename?: 'StoryListOutput';
  /**
   * The page of story.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly Story[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
}

export interface UpdateStoryOutput {
  readonly __typename?: 'UpdateStoryOutput';
  readonly story: Story;
}

export type Favorite = Resource & {
  readonly __typename?: 'Favorite';
  readonly id: Scalars['ID'];
  readonly createdAt: Scalars['DateTime'];
  readonly baseNodeId: Scalars['String'];
};

export interface FavoriteListOutput {
  readonly __typename?: 'FavoriteListOutput';
  /**
   * The page of favorite.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly Favorite[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
}

export interface SearchOutput {
  readonly __typename?: 'SearchOutput';
  /** The search string to look for. */
  readonly items: readonly SearchResult[];
}

export type SearchResult =
  | Organization
  | Country
  | Region
  | Zone
  | Language
  | TranslationProject
  | InternshipProject
  | User;

export type Song = Producible &
  Resource & {
    readonly __typename?: 'Song';
    readonly id: Scalars['ID'];
    readonly createdAt: Scalars['DateTime'];
    readonly scriptureReferences: SecuredScriptureRanges;
    readonly name: SecuredString;
  };

export interface CreateSongOutput {
  readonly __typename?: 'CreateSongOutput';
  readonly song: Song;
}

export interface SongListOutput {
  readonly __typename?: 'SongListOutput';
  /**
   * The page of song.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  readonly items: readonly Song[];
  /** The total number of items across all pages */
  readonly total: Scalars['Int'];
  /** Whether the next page exists */
  readonly hasMore: Scalars['Boolean'];
}

export interface UpdateSongOutput {
  readonly __typename?: 'UpdateSongOutput';
  readonly song: Song;
}

export interface State {
  readonly __typename?: 'State';
  readonly id: Scalars['ID'];
  readonly value: Scalars['String'];
}

export interface Workflow {
  readonly __typename?: 'Workflow';
  readonly id: Scalars['ID'];
  readonly stateIdentifier: Scalars['String'];
  readonly startingState: State;
}

export interface CreateWorkflowOutput {
  readonly __typename?: 'CreateWorkflowOutput';
  readonly workflow: Workflow;
}

export interface AddStateOutput {
  readonly __typename?: 'AddStateOutput';
  readonly state: State;
}

export interface StateListOutput {
  readonly __typename?: 'StateListOutput';
  readonly items: readonly State[];
}

export interface FieldObject {
  readonly __typename?: 'FieldObject';
  readonly value: Scalars['String'];
}

export interface RequiredFieldListOutput {
  readonly __typename?: 'RequiredFieldListOutput';
  readonly items: readonly FieldObject[];
}

export interface Query {
  readonly __typename?: 'Query';
  /** List security groups that user is a member of */
  readonly securityGroupsUserIsMemberOf: ListSecurityGroupOutput;
  /** List security groups that user is an admin of */
  readonly securityGroupsUserIsAdminOf: ListSecurityGroupOutput;
  /** List permissions that belong to a security group */
  readonly permissionsInSecurityGroup: ListPermissionOutput;
  /** Look up an organization by its ID */
  readonly organization: Organization;
  /** Look up organizations */
  readonly organizations: OrganizationListOutput;
  /** Check all organization nodes for consistency */
  readonly checkOrganizations: Scalars['Boolean'];
  /** Check Consistency in Organization Nodes */
  readonly checkOrganizationConsistency: Scalars['Boolean'];
  /** Look up an education by its ID */
  readonly education: Education;
  /** Look up educations by user id */
  readonly educations: EducationListOutput;
  /** Check Consistency across Education Nodes */
  readonly checkEducationConsistency: Scalars['Boolean'];
  /** Look up a unavailability by its ID */
  readonly unavailability: Unavailability;
  /** Look up unavailabilities by user id */
  readonly unavailabilities: UnavailabilityListOutput;
  /** Check Consistency across Unavailability Nodes */
  readonly checkUnavailabilityConsistency: Scalars['Boolean'];
  readonly timezones: readonly TimeZone[];
  readonly timezone?: Maybe<TimeZone>;
  readonly ianaCountries: readonly IanaCountry[];
  readonly ianaCountry?: Maybe<IanaCountry>;
  /** Look up a user by its ID */
  readonly user: User;
  /** Look up users */
  readonly users: UserListOutput;
  /** Checks whether a provided email already exists */
  readonly checkEmail: Scalars['Boolean'];
  /** Check Consistency across User Nodes */
  readonly checkUserConsistency: Scalars['Boolean'];
  /** Create or retrieve an existing session */
  readonly session: SessionOutput;
  /** Read one Location by id */
  readonly location: Location;
  /** Look up locations */
  readonly locations: LocationListOutput;
  /** Check location consistency */
  readonly checkLocationConsistency: Scalars['Boolean'];
  readonly directory: Directory;
  readonly file: File;
  readonly fileNode: FileNode;
  /**
   * Check Consistency in File Nodes
   * @deprecated This should have never existed
   */
  readonly checkFileConsistency: Scalars['Boolean'];
  /** Look up a ceremony by its ID */
  readonly ceremony: Ceremony;
  /** Look up ceremonies */
  readonly ceremonies: CeremonyListOutput;
  /** Check Consistency in Ceremony Nodes */
  readonly checkCeremonyConsistency: Scalars['Boolean'];
  /** Look up a project member by ID */
  readonly projectMember: ProjectMember;
  /** Look up project members */
  readonly projectMembers: ProjectMemberListOutput;
  /** Look up a partnership by ID */
  readonly partnership: Partnership;
  /** Look up partnerships */
  readonly partnerships: PartnershipListOutput;
  /** Check partnership node consistency */
  readonly checkPartnershipConsistency: Scalars['Boolean'];
  /** Look up a project by its ID */
  readonly project: Project;
  /** Look up projects */
  readonly projects: ProjectListOutput;
  /** Check Consistency in Project Nodes */
  readonly checkProjectConsistency: Scalars['Boolean'];
  /** Look up a language by its ID */
  readonly language: Language;
  /** Look up languages */
  readonly languages: LanguageListOutput;
  /** Check language node consistency */
  readonly checkLanguageConsistency: Scalars['Boolean'];
  /** Look up a film by its ID */
  readonly film: Film;
  /** Look up films */
  readonly films: FilmListOutput;
  /** Look up a literacy material */
  readonly literacyMaterial: LiteracyMaterial;
  /** Look up literacy materials */
  readonly literacyMaterials: LiteracyMaterialListOutput;
  /** Look up a story by its ID */
  readonly story: Story;
  /** Look up stories */
  readonly stories: StoryListOutput;
  /** Read a product by id */
  readonly product: Product;
  /** Look up products */
  readonly products: ProductListOutput;
  /** Lookup an engagement by ID */
  readonly engagement: Engagement;
  /** Look up engagements */
  readonly engagements: EngagementListOutput;
  /** Check Consistency in Engagement Nodes */
  readonly checkEngagementConsistency: Scalars['Boolean'];
  /** Look up a budget by its ID */
  readonly budget: Budget;
  /** Look up budgets by projectId */
  readonly budgets: BudgetListOutput;
  /** Check Consistency in Budget Nodes */
  readonly checkBudgetConsistency: Scalars['Boolean'];
  /** Look up favorites */
  readonly favorites: FavoriteListOutput;
  /** Perform a search across resources */
  readonly search: SearchOutput;
  /** Look up a song by its ID */
  readonly song: Song;
  /** Look up stories */
  readonly songs: SongListOutput;
  /** Look up all states on workflow */
  readonly states: StateListOutput;
  /** Look up all next possible states on workflow */
  readonly nextStates: StateListOutput;
  /** List required fields in state */
  readonly listRequiredFields: RequiredFieldListOutput;
}

export interface QuerySecurityGroupsUserIsMemberOfArgs {
  input: ListSecurityGroupInput;
}

export interface QuerySecurityGroupsUserIsAdminOfArgs {
  input: ListSecurityGroupInput;
}

export interface QueryPermissionsInSecurityGroupArgs {
  input: ListPermissionInput;
}

export interface QueryOrganizationArgs {
  id: Scalars['ID'];
}

export interface QueryOrganizationsArgs {
  input?: Maybe<OrganizationListInput>;
}

export interface QueryEducationArgs {
  id: Scalars['ID'];
}

export interface QueryEducationsArgs {
  input?: Maybe<EducationListInput>;
}

export interface QueryUnavailabilityArgs {
  id: Scalars['ID'];
}

export interface QueryUnavailabilitiesArgs {
  input?: Maybe<UnavailabilityListInput>;
}

export interface QueryTimezoneArgs {
  name: Scalars['String'];
}

export interface QueryIanaCountryArgs {
  code: Scalars['String'];
}

export interface QueryUserArgs {
  id: Scalars['ID'];
}

export interface QueryUsersArgs {
  input?: Maybe<UserListInput>;
}

export interface QueryCheckEmailArgs {
  email: Scalars['String'];
}

export interface QuerySessionArgs {
  browser?: Maybe<Scalars['Boolean']>;
}

export interface QueryLocationArgs {
  id: Scalars['ID'];
}

export interface QueryLocationsArgs {
  input?: Maybe<LocationListInput>;
}

export interface QueryDirectoryArgs {
  id: Scalars['ID'];
}

export interface QueryFileArgs {
  id: Scalars['ID'];
}

export interface QueryFileNodeArgs {
  id: Scalars['ID'];
}

export interface QueryCheckFileConsistencyArgs {
  type: FileNodeType;
}

export interface QueryCeremonyArgs {
  id: Scalars['ID'];
}

export interface QueryCeremoniesArgs {
  input?: Maybe<CeremonyListInput>;
}

export interface QueryProjectMemberArgs {
  id: Scalars['ID'];
}

export interface QueryProjectMembersArgs {
  input?: Maybe<ProjectMemberListInput>;
}

export interface QueryPartnershipArgs {
  id: Scalars['ID'];
}

export interface QueryPartnershipsArgs {
  input?: Maybe<PartnershipListInput>;
}

export interface QueryProjectArgs {
  id: Scalars['ID'];
}

export interface QueryProjectsArgs {
  input?: Maybe<ProjectListInput>;
}

export interface QueryLanguageArgs {
  id: Scalars['ID'];
}

export interface QueryLanguagesArgs {
  input?: Maybe<LanguageListInput>;
}

export interface QueryFilmArgs {
  id: Scalars['ID'];
}

export interface QueryFilmsArgs {
  input?: Maybe<FilmListInput>;
}

export interface QueryLiteracyMaterialArgs {
  id: Scalars['ID'];
}

export interface QueryLiteracyMaterialsArgs {
  input?: Maybe<LiteracyMaterialListInput>;
}

export interface QueryStoryArgs {
  id: Scalars['ID'];
}

export interface QueryStoriesArgs {
  input?: Maybe<StoryListInput>;
}

export interface QueryProductArgs {
  id: Scalars['ID'];
}

export interface QueryProductsArgs {
  input?: Maybe<ProductListInput>;
}

export interface QueryEngagementArgs {
  id: Scalars['ID'];
}

export interface QueryEngagementsArgs {
  input?: Maybe<EngagementListInput>;
}

export interface QueryCheckEngagementConsistencyArgs {
  input: EngagementConsistencyInput;
}

export interface QueryBudgetArgs {
  id: Scalars['ID'];
}

export interface QueryBudgetsArgs {
  input?: Maybe<BudgetListInput>;
}

export interface QueryFavoritesArgs {
  input?: Maybe<FavoriteListInput>;
}

export interface QuerySearchArgs {
  input?: Maybe<SearchInput>;
}

export interface QuerySongArgs {
  id: Scalars['ID'];
}

export interface QuerySongsArgs {
  input?: Maybe<SongListInput>;
}

export interface QueryStatesArgs {
  id: Scalars['ID'];
}

export interface QueryNextStatesArgs {
  id: Scalars['ID'];
}

export interface QueryListRequiredFieldsArgs {
  id: Scalars['ID'];
}

export interface ListSecurityGroupInput {
  readonly userId: Scalars['ID'];
}

export interface ListPermissionInput {
  readonly sgId: Scalars['ID'];
}

export interface UserListInput {
  /** The number of items to return in a single page */
  readonly count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  readonly page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  readonly sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  readonly order?: Maybe<Order>;
  readonly filter?: Maybe<UserFilters>;
}

export interface UserFilters {
  /** Only users matching this first name */
  readonly displayFirstName?: Maybe<Scalars['String']>;
  /** Only users matching this last name */
  readonly displayLastName?: Maybe<Scalars['String']>;
}

export interface CeremonyListInput {
  /** The number of items to return in a single page */
  readonly count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  readonly page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  readonly sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  readonly order?: Maybe<Order>;
  readonly filter?: Maybe<CeremonyFilters>;
}

export interface CeremonyFilters {
  /** Only ceremonies of this type */
  readonly type?: Maybe<CeremonyType>;
}

export interface LanguageListInput {
  /** The number of items to return in a single page */
  readonly count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  readonly page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  readonly sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  readonly order?: Maybe<Order>;
  readonly filter?: Maybe<LanguageFilters>;
}

export interface LanguageFilters {
  /** Only languages matching this name */
  readonly name?: Maybe<Scalars['String']>;
}

export interface FilmListInput {
  /** The number of items to return in a single page */
  readonly count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  readonly page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  readonly sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  readonly order?: Maybe<Order>;
  readonly filter?: Maybe<FilmFilters>;
}

export interface FilmFilters {
  /** Only films matching this name */
  readonly name?: Maybe<Scalars['String']>;
}

export interface LiteracyMaterialListInput {
  /** The number of items to return in a single page */
  readonly count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  readonly page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  readonly sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  readonly order?: Maybe<Order>;
  readonly filter?: Maybe<LiteracyMaterialFilters>;
}

export interface LiteracyMaterialFilters {
  /** Only literacy material matching this name */
  readonly name?: Maybe<Scalars['String']>;
}

export interface StoryListInput {
  /** The number of items to return in a single page */
  readonly count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  readonly page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  readonly sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  readonly order?: Maybe<Order>;
  readonly filter?: Maybe<StoryFilters>;
}

export interface StoryFilters {
  /** Only stories matching this name */
  readonly name?: Maybe<Scalars['String']>;
}

export interface EngagementConsistencyInput {
  /** engagement type */
  readonly baseNode: Scalars['String'];
}

export interface BudgetListInput {
  /** The number of items to return in a single page */
  readonly count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  readonly page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  readonly sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  readonly order?: Maybe<Order>;
  readonly filter?: Maybe<BudgetFilters>;
}

export interface BudgetFilters {
  /** Only budgets matching this projectId */
  readonly projectId?: Maybe<Scalars['ID']>;
}

export interface FavoriteListInput {
  /** The number of items to return in a single page */
  readonly count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  readonly page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  readonly sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  readonly order?: Maybe<Order>;
  readonly filter?: Maybe<FavoriteFilters>;
}

export interface FavoriteFilters {
  /** Only items matching this node */
  readonly baseNode?: Maybe<BaseNode>;
}

export type BaseNode =
  | 'Project'
  | 'Language'
  | 'Organization'
  | 'Location'
  | 'Film'
  | 'Story'
  | 'LiteracyMaterial'
  | 'User';

export interface SearchInput {
  /** The number of items to return in a single page */
  readonly count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  readonly page?: Maybe<Scalars['Int']>;
  /** The search string to look for. */
  readonly query: Scalars['String'];
  /** Limit results to one of these types */
  readonly type?: Maybe<readonly SearchType[]>;
}

export type SearchType =
  | 'Organization'
  | 'Country'
  | 'Region'
  | 'Zone'
  | 'Language'
  | 'TranslationProject'
  | 'InternshipProject'
  | 'User'
  | 'Project'
  | 'Location';

export interface SongListInput {
  /** The number of items to return in a single page */
  readonly count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  readonly page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  readonly sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  readonly order?: Maybe<Order>;
  readonly filter?: Maybe<SongFilters>;
}

export interface SongFilters {
  /** Only songs matching this name */
  readonly name?: Maybe<Scalars['String']>;
}

export interface Mutation {
  readonly __typename?: 'Mutation';
  /** Create a new permission between a security group and a base node */
  readonly createPermission: CreatePermissionOutput;
  /** Create a new security group */
  readonly createSecurityGroup: CreateSecurityGroupOutput;
  /** Attach a user to a security group (without admin privileges) */
  readonly attachUserToSecurityGroup: Scalars['Boolean'];
  /** Add a property to a security group */
  readonly addPropertyToSecurityGroup: Scalars['Boolean'];
  /** Remove a permission from a security group */
  readonly removePermissionFromSecurityGroup: Scalars['Boolean'];
  /** Remove a user from a security group */
  readonly removeUserFromSecurityGroup: Scalars['Boolean'];
  /** Promote a user to become an admin of a security group */
  readonly promoteUserToAdminOfSecurityGroup: Scalars['Boolean'];
  /** Promote a user to become an admin of a base node */
  readonly promoteUserToAdminOfBaseNode: Scalars['Boolean'];
  /** Delete a security group */
  readonly deleteSecurityGroup: Scalars['Boolean'];
  /** Update a security group's name */
  readonly updateSecurityGroupName: UpdateSecurityGroupNameOutput;
  /** Create an organization */
  readonly createOrganization: CreateOrganizationOutput;
  /** Update an organization */
  readonly updateOrganization: UpdateOrganizationOutput;
  /** Delete an organization */
  readonly deleteOrganization: Scalars['Boolean'];
  /** Create an education entry */
  readonly createEducation: CreateEducationOutput;
  /** Update an education */
  readonly updateEducation: UpdateEducationOutput;
  /** Delete an education */
  readonly deleteEducation: Scalars['Boolean'];
  /** Create an unavailability */
  readonly createUnavailability: CreateUnavailabilityOutput;
  /** Update an unavailability */
  readonly updateUnavailability: UpdateUnavailabilityOutput;
  /** Delete an unavailability */
  readonly deleteUnavailability: Scalars['Boolean'];
  /** Create a person */
  readonly createPerson: CreatePersonOutput;
  /** Update a user */
  readonly updateUser: UpdateUserOutput;
  /** Delete a user */
  readonly deleteUser: Scalars['Boolean'];
  /** Assign organization OR primaryOrganization to user */
  readonly assignOrganizationToUser: Scalars['Boolean'];
  /** Remove organization OR primaryOrganization from user */
  readonly removeOrganizationFromUser: Scalars['Boolean'];
  /** Login a user */
  readonly login: LoginOutput;
  /** Logout a user */
  readonly logout: Scalars['Boolean'];
  /** Register a new user */
  readonly register: RegisterOutput;
  /** Change your password */
  readonly changePassword: Scalars['Boolean'];
  /** Forgot password; send password reset email */
  readonly forgotPassword: Scalars['Boolean'];
  /** Reset Password */
  readonly resetPassword: Scalars['Boolean'];
  /** Create a zone */
  readonly createZone: CreateZoneOutput;
  /** Create a region */
  readonly createRegion: CreateRegionOutput;
  /** Create a country */
  readonly createCountry: CreateCountryOutput;
  /** Update a zone */
  readonly updateZone: UpdateZoneOutput;
  /** Update a region */
  readonly updateRegion: UpdateRegionOutput;
  /** Update a country */
  readonly updateCountry: UpdateCountryOutput;
  /** Delete a location */
  readonly deleteLocation: Scalars['Boolean'];
  readonly createDirectory: Directory;
  /** Delete a file or directory */
  readonly deleteFileNode: Scalars['Boolean'];
  /** Start the file upload process by requesting an upload */
  readonly requestFileUpload: RequestUploadOutput;
  /**
   * Create a new file version.
   * This is always the second step after `requestFileUpload` mutation.
   * If the given parent is a file, this will attach the new version to it.
   * If the given parent is a directory, this will attach the new version to
   * the existing file with the same name or create a new file if not found.
   */
  readonly createFileVersion: File;
  /** Rename a file or directory */
  readonly renameFileNode: FileNode;
  /** Move a file or directory */
  readonly moveFileNode: FileNode;
  /** Update a ceremony */
  readonly updateCeremony: UpdateCeremonyOutput;
  /** Create a project member */
  readonly createProjectMember: CreateProjectMemberOutput;
  /** Update a project member */
  readonly updateProjectMember: UpdateProjectMemberOutput;
  /** Delete a project member */
  readonly deleteProjectMember: Scalars['Boolean'];
  /** Create a Partnership entry */
  readonly createPartnership: CreatePartnershipOutput;
  /** Update a Partnership */
  readonly updatePartnership: UpdatePartnershipOutput;
  /** Delete a Partnership */
  readonly deletePartnership: Scalars['Boolean'];
  /** Create a project */
  readonly createProject: CreateProjectOutput;
  /** Update a project */
  readonly updateProject: UpdateProjectOutput;
  /** Delete a project */
  readonly deleteProject: Scalars['Boolean'];
  /** Create a language */
  readonly createLanguage: CreateLanguageOutput;
  /** Update a language */
  readonly updateLanguage: UpdateLanguageOutput;
  /** Delete a language */
  readonly deleteLanguage: Scalars['Boolean'];
  /** Add a location to a language */
  readonly addLocationToLanguage: Language;
  /** Remove a location from a language */
  readonly removeLocationFromLanguage: Language;
  /** Create a film */
  readonly createFilm: CreateFilmOutput;
  /** Update a film */
  readonly updateFilm: UpdateFilmOutput;
  /** Delete a film */
  readonly deleteFilm: Scalars['Boolean'];
  /** Create a literacy material */
  readonly createLiteracyMaterial: CreateLiteracyMaterialOutput;
  /** Update a literacy material */
  readonly updateLiteracyMaterial: UpdateLiteracyMaterialOutput;
  /** Delete a literacy material */
  readonly deleteLiteracyMaterial: Scalars['Boolean'];
  /** Create a story */
  readonly createStory: CreateStoryOutput;
  /** Update a story */
  readonly updateStory: UpdateStoryOutput;
  /** Delete a story */
  readonly deleteStory: Scalars['Boolean'];
  /** Create a product entry */
  readonly createProduct: CreateProductOutput;
  /** Update a product entry */
  readonly updateProduct: UpdateProductOutput;
  /** Delete a product entry */
  readonly deleteProduct: Scalars['Boolean'];
  /** Create a language engagement */
  readonly createLanguageEngagement: CreateLanguageEngagementOutput;
  /** Create an internship engagement */
  readonly createInternshipEngagement: CreateInternshipEngagementOutput;
  /** Update a language engagement */
  readonly updateLanguageEngagement: UpdateLanguageEngagementOutput;
  /** Update an internship engagement */
  readonly updateInternshipEngagement: UpdateInternshipEngagementOutput;
  /** Delete an engagement */
  readonly deleteEngagement: Scalars['Boolean'];
  /** Update a budgetRecord */
  readonly updateBudgetRecord: UpdateBudgetRecordOutput;
  /** Create a budget */
  readonly createBudget: CreateBudgetOutput;
  /** Update a budget */
  readonly updateBudget: UpdateBudgetOutput;
  /** Delete an budget */
  readonly deleteBudget: Scalars['Boolean'];
  /** add an favorite */
  readonly addFavorite: Scalars['String'];
  /** Delete an favorite */
  readonly removeFavorite: Scalars['Boolean'];
  /** Create a song */
  readonly createSong: CreateSongOutput;
  /** Update a song */
  readonly updateSong: UpdateSongOutput;
  /** Delete a song */
  readonly deleteSong: Scalars['Boolean'];
  /** Create an Workflow */
  readonly createWorkflow: CreateWorkflowOutput;
  /** Delete an Workflow */
  readonly deleteWorkflow: Scalars['Boolean'];
  /** Add a State to a Workflow */
  readonly addState: AddStateOutput;
  /** Update a State */
  readonly updateState: AddStateOutput;
  /** Delete an State from Workflow */
  readonly deleteState: Scalars['Boolean'];
  /** Attach securitygroup to state */
  readonly attachSecurityGroup: Scalars['Boolean'];
  /** Remove security group from state */
  readonly removeSecurityGroup: Scalars['Boolean'];
  /** Attach notification group to state */
  readonly attachNotificationGroup: Scalars['Boolean'];
  /** Remove notification group to state */
  readonly removeNotificationGroup: Scalars['Boolean'];
  /** Change current statee in workflow */
  readonly changeCurrentState: Scalars['Boolean'];
  /** Add possible state to a state */
  readonly addPossibleState: Scalars['Boolean'];
  /** Remove possible state to a state */
  readonly removePossibleState: Scalars['Boolean'];
  /** Add a required field to a state */
  readonly addRequiredField: Scalars['Boolean'];
  /** Remove a required field from state */
  readonly removeRequiredField: Scalars['Boolean'];
}

export interface MutationCreatePermissionArgs {
  input: CreatePermissionInput;
}

export interface MutationCreateSecurityGroupArgs {
  input: CreateSecurityGroupInput;
}

export interface MutationAttachUserToSecurityGroupArgs {
  input: AttachUserToSecurityGroupInput;
}

export interface MutationAddPropertyToSecurityGroupArgs {
  input: AddPropertyToSecurityGroupInput;
}

export interface MutationRemovePermissionFromSecurityGroupArgs {
  input: RemovePermissionFromSecurityGroupInput;
}

export interface MutationRemoveUserFromSecurityGroupArgs {
  input: RemoveUserFromSecurityGroupInput;
}

export interface MutationPromoteUserToAdminOfSecurityGroupArgs {
  input: PromoteUserToAdminOfSecurityGroupInput;
}

export interface MutationPromoteUserToAdminOfBaseNodeArgs {
  input: PromoteUserToAdminOfBaseNodeInput;
}

export interface MutationDeleteSecurityGroupArgs {
  id: Scalars['ID'];
}

export interface MutationUpdateSecurityGroupNameArgs {
  input: UpdateSecurityGroupNameInput;
}

export interface MutationCreateOrganizationArgs {
  input: CreateOrganizationInput;
}

export interface MutationUpdateOrganizationArgs {
  input: UpdateOrganizationInput;
}

export interface MutationDeleteOrganizationArgs {
  id: Scalars['ID'];
}

export interface MutationCreateEducationArgs {
  input: CreateEducationInput;
}

export interface MutationUpdateEducationArgs {
  input: UpdateEducationInput;
}

export interface MutationDeleteEducationArgs {
  id: Scalars['ID'];
}

export interface MutationCreateUnavailabilityArgs {
  input: CreateUnavailabilityInput;
}

export interface MutationUpdateUnavailabilityArgs {
  input: UpdateUnavailabilityInput;
}

export interface MutationDeleteUnavailabilityArgs {
  id: Scalars['ID'];
}

export interface MutationCreatePersonArgs {
  input: CreatePersonInput;
}

export interface MutationUpdateUserArgs {
  input: UpdateUserInput;
}

export interface MutationDeleteUserArgs {
  id: Scalars['ID'];
}

export interface MutationAssignOrganizationToUserArgs {
  input: AssignOrganizationToUserInput;
}

export interface MutationRemoveOrganizationFromUserArgs {
  input: RemoveOrganizationFromUserInput;
}

export interface MutationLoginArgs {
  input: LoginInput;
}

export interface MutationRegisterArgs {
  input: RegisterInput;
}

export interface MutationChangePasswordArgs {
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
}

export interface MutationForgotPasswordArgs {
  email: Scalars['String'];
}

export interface MutationResetPasswordArgs {
  input: ResetPasswordInput;
}

export interface MutationCreateZoneArgs {
  input: CreateZoneInput;
}

export interface MutationCreateRegionArgs {
  input: CreateRegionInput;
}

export interface MutationCreateCountryArgs {
  input: CreateCountryInput;
}

export interface MutationUpdateZoneArgs {
  input: UpdateZoneInput;
}

export interface MutationUpdateRegionArgs {
  input: UpdateRegionInput;
}

export interface MutationUpdateCountryArgs {
  input: UpdateCountryInput;
}

export interface MutationDeleteLocationArgs {
  id: Scalars['ID'];
}

export interface MutationCreateDirectoryArgs {
  input: CreateDirectoryInput;
}

export interface MutationDeleteFileNodeArgs {
  id: Scalars['ID'];
}

export interface MutationCreateFileVersionArgs {
  input: CreateFileVersionInput;
}

export interface MutationRenameFileNodeArgs {
  input: RenameFileInput;
}

export interface MutationMoveFileNodeArgs {
  input: MoveFileInput;
}

export interface MutationUpdateCeremonyArgs {
  input: UpdateCeremonyInput;
}

export interface MutationCreateProjectMemberArgs {
  input: CreateProjectMemberInput;
}

export interface MutationUpdateProjectMemberArgs {
  input: UpdateProjectMemberInput;
}

export interface MutationDeleteProjectMemberArgs {
  id: Scalars['ID'];
}

export interface MutationCreatePartnershipArgs {
  input: CreatePartnershipInput;
}

export interface MutationUpdatePartnershipArgs {
  input: UpdatePartnershipInput;
}

export interface MutationDeletePartnershipArgs {
  id: Scalars['ID'];
}

export interface MutationCreateProjectArgs {
  input: CreateProjectInput;
}

export interface MutationUpdateProjectArgs {
  input: UpdateProjectInput;
}

export interface MutationDeleteProjectArgs {
  id: Scalars['ID'];
}

export interface MutationCreateLanguageArgs {
  input: CreateLanguageInput;
}

export interface MutationUpdateLanguageArgs {
  input: UpdateLanguageInput;
}

export interface MutationDeleteLanguageArgs {
  id: Scalars['ID'];
}

export interface MutationAddLocationToLanguageArgs {
  locationId: Scalars['ID'];
  languageId: Scalars['ID'];
}

export interface MutationRemoveLocationFromLanguageArgs {
  locationId: Scalars['ID'];
  languageId: Scalars['ID'];
}

export interface MutationCreateFilmArgs {
  input: CreateFilmInput;
}

export interface MutationUpdateFilmArgs {
  input: UpdateFilmInput;
}

export interface MutationDeleteFilmArgs {
  id: Scalars['ID'];
}

export interface MutationCreateLiteracyMaterialArgs {
  input: CreateLiteracyMaterialInput;
}

export interface MutationUpdateLiteracyMaterialArgs {
  input: UpdateLiteracyMaterialInput;
}

export interface MutationDeleteLiteracyMaterialArgs {
  id: Scalars['ID'];
}

export interface MutationCreateStoryArgs {
  input: CreateStoryInput;
}

export interface MutationUpdateStoryArgs {
  input: UpdateStoryInput;
}

export interface MutationDeleteStoryArgs {
  id: Scalars['ID'];
}

export interface MutationCreateProductArgs {
  input: CreateProductInput;
}

export interface MutationUpdateProductArgs {
  input: UpdateProductInput;
}

export interface MutationDeleteProductArgs {
  id: Scalars['ID'];
}

export interface MutationCreateLanguageEngagementArgs {
  input: CreateLanguageEngagementInput;
}

export interface MutationCreateInternshipEngagementArgs {
  input: CreateInternshipEngagementInput;
}

export interface MutationUpdateLanguageEngagementArgs {
  input: UpdateLanguageEngagementInput;
}

export interface MutationUpdateInternshipEngagementArgs {
  input: UpdateInternshipEngagementInput;
}

export interface MutationDeleteEngagementArgs {
  id: Scalars['ID'];
}

export interface MutationUpdateBudgetRecordArgs {
  input: UpdateBudgetRecordInput;
}

export interface MutationCreateBudgetArgs {
  input: CreateBudgetInput;
}

export interface MutationUpdateBudgetArgs {
  input: UpdateBudgetInput;
}

export interface MutationDeleteBudgetArgs {
  id: Scalars['ID'];
}

export interface MutationAddFavoriteArgs {
  input: AddFavoriteInput;
}

export interface MutationRemoveFavoriteArgs {
  id: Scalars['ID'];
}

export interface MutationCreateSongArgs {
  input: CreateSongInput;
}

export interface MutationUpdateSongArgs {
  input: UpdateSongInput;
}

export interface MutationDeleteSongArgs {
  id: Scalars['ID'];
}

export interface MutationCreateWorkflowArgs {
  input: CreateWorkflowInput;
}

export interface MutationDeleteWorkflowArgs {
  id: Scalars['ID'];
}

export interface MutationAddStateArgs {
  input: AddStateInput;
}

export interface MutationUpdateStateArgs {
  input: UpdateStateInput;
}

export interface MutationDeleteStateArgs {
  id: Scalars['ID'];
}

export interface MutationAttachSecurityGroupArgs {
  input: GroupStateInput;
}

export interface MutationRemoveSecurityGroupArgs {
  input: GroupStateInput;
}

export interface MutationAttachNotificationGroupArgs {
  input: GroupStateInput;
}

export interface MutationRemoveNotificationGroupArgs {
  input: GroupStateInput;
}

export interface MutationChangeCurrentStateArgs {
  input: ChangeCurrentStateInput;
}

export interface MutationAddPossibleStateArgs {
  input: PossibleStateInput;
}

export interface MutationRemovePossibleStateArgs {
  input: PossibleStateInput;
}

export interface MutationAddRequiredFieldArgs {
  input: RequiredFieldInput;
}

export interface MutationRemoveRequiredFieldArgs {
  input: RequiredFieldInput;
}

export interface CreatePermissionInput {
  readonly request: CreatePermission;
}

export interface CreatePermission {
  readonly sgId: Scalars['ID'];
  readonly baseNodeId: Scalars['ID'];
  readonly propertyName: Scalars['String'];
  readonly read: Scalars['Boolean'];
  readonly write: Scalars['Boolean'];
}

export interface CreateSecurityGroupInput {
  readonly request: CreateSecurityGroup;
}

export interface CreateSecurityGroup {
  readonly name: Scalars['String'];
}

export interface AttachUserToSecurityGroupInput {
  readonly request: AttachUserToSecurityGroup;
}

export interface AttachUserToSecurityGroup {
  readonly sgId: Scalars['ID'];
  readonly userId: Scalars['ID'];
}

export interface AddPropertyToSecurityGroupInput {
  readonly request: AddPropertyToSecurityGroup;
}

export interface AddPropertyToSecurityGroup {
  readonly sgId: Scalars['ID'];
  readonly property: Scalars['String'];
}

export interface RemovePermissionFromSecurityGroupInput {
  readonly request: RemovePermissionFromSecurityGroup;
}

export interface RemovePermissionFromSecurityGroup {
  readonly id: Scalars['ID'];
  readonly sgId: Scalars['ID'];
  readonly baseNodeId: Scalars['ID'];
}

export interface RemoveUserFromSecurityGroupInput {
  readonly request: RemoveUserFromSecurityGroup;
}

export interface RemoveUserFromSecurityGroup {
  readonly sgId: Scalars['ID'];
  readonly userId: Scalars['ID'];
}

export interface PromoteUserToAdminOfSecurityGroupInput {
  readonly request: PromoteUserToAdminOfSecurityGroup;
}

export interface PromoteUserToAdminOfSecurityGroup {
  readonly sgId: Scalars['ID'];
  readonly userId: Scalars['ID'];
}

export interface PromoteUserToAdminOfBaseNodeInput {
  readonly request: PromoteUserToAdminOfBaseNode;
}

export interface PromoteUserToAdminOfBaseNode {
  readonly baseNodeId: Scalars['ID'];
  readonly userId: Scalars['ID'];
}

export interface UpdateSecurityGroupNameInput {
  readonly request: UpdateSecurityGroupName;
}

export interface UpdateSecurityGroupName {
  readonly id: Scalars['ID'];
  readonly name: Scalars['String'];
}

export interface CreateOrganizationInput {
  readonly organization: CreateOrganization;
}

export interface CreateOrganization {
  readonly name: Scalars['String'];
}

export interface UpdateOrganizationInput {
  readonly organization: UpdateOrganization;
}

export interface UpdateOrganization {
  readonly id: Scalars['ID'];
  readonly name?: Maybe<Scalars['String']>;
}

export interface CreateEducationInput {
  readonly education: CreateEducation;
}

export interface CreateEducation {
  readonly userId: Scalars['ID'];
  readonly degree: Degree;
  readonly major: Scalars['String'];
  readonly institution: Scalars['String'];
}

export type Degree =
  | 'Primary'
  | 'Secondary'
  | 'Associates'
  | 'Bachelors'
  | 'Masters'
  | 'Doctorate';

export interface UpdateEducationInput {
  readonly education: UpdateEducation;
}

export interface UpdateEducation {
  readonly id: Scalars['ID'];
  readonly degree?: Maybe<Degree>;
  readonly major?: Maybe<Scalars['String']>;
  readonly institution?: Maybe<Scalars['String']>;
}

export interface CreateUnavailabilityInput {
  readonly unavailability: CreateUnavailability;
}

export interface CreateUnavailability {
  readonly userId: Scalars['ID'];
  readonly description: Scalars['String'];
  readonly start: Scalars['DateTime'];
  readonly end: Scalars['DateTime'];
}

export interface UpdateUnavailabilityInput {
  readonly unavailability: UpdateUnavailability;
}

export interface UpdateUnavailability {
  readonly id: Scalars['ID'];
  readonly description?: Maybe<Scalars['String']>;
  readonly start?: Maybe<Scalars['DateTime']>;
  readonly end?: Maybe<Scalars['DateTime']>;
}

export interface CreatePersonInput {
  readonly person: CreatePerson;
}

export interface CreatePerson {
  readonly email: Scalars['String'];
  readonly realFirstName: Scalars['String'];
  readonly realLastName: Scalars['String'];
  readonly displayFirstName: Scalars['String'];
  readonly displayLastName: Scalars['String'];
  readonly phone?: Maybe<Scalars['String']>;
  readonly timezone?: Maybe<Scalars['String']>;
  readonly bio?: Maybe<Scalars['String']>;
  readonly status?: Maybe<UserStatus>;
}

export interface UpdateUserInput {
  readonly user: UpdateUser;
}

export interface UpdateUser {
  readonly id: Scalars['ID'];
  readonly email?: Maybe<Scalars['String']>;
  readonly realFirstName?: Maybe<Scalars['String']>;
  readonly realLastName?: Maybe<Scalars['String']>;
  readonly displayFirstName?: Maybe<Scalars['String']>;
  readonly displayLastName?: Maybe<Scalars['String']>;
  readonly phone?: Maybe<Scalars['String']>;
  readonly timezone?: Maybe<Scalars['String']>;
  readonly bio?: Maybe<Scalars['String']>;
  readonly status?: Maybe<UserStatus>;
}

export interface AssignOrganizationToUserInput {
  readonly request: AssignOrganizationToUser;
}

export interface AssignOrganizationToUser {
  readonly orgId: Scalars['ID'];
  readonly userId: Scalars['ID'];
  readonly primary?: Maybe<Scalars['Boolean']>;
}

export interface RemoveOrganizationFromUserInput {
  readonly request: RemoveOrganizationFromUser;
}

export interface RemoveOrganizationFromUser {
  readonly orgId: Scalars['ID'];
  readonly userId: Scalars['ID'];
}

export interface LoginInput {
  readonly email: Scalars['String'];
  readonly password: Scalars['String'];
}

export interface RegisterInput {
  readonly email: Scalars['String'];
  readonly realFirstName: Scalars['String'];
  readonly realLastName: Scalars['String'];
  readonly displayFirstName: Scalars['String'];
  readonly displayLastName: Scalars['String'];
  readonly phone?: Maybe<Scalars['String']>;
  readonly timezone?: Maybe<Scalars['String']>;
  readonly bio?: Maybe<Scalars['String']>;
  readonly status?: Maybe<UserStatus>;
  readonly password: Scalars['String'];
}

export interface ResetPasswordInput {
  readonly token: Scalars['String'];
  readonly password: Scalars['String'];
}

export interface CreateZoneInput {
  readonly zone: CreateZone;
}

export interface CreateZone {
  readonly name: Scalars['String'];
  /** A user ID that will be the director of the zone */
  readonly directorId: Scalars['ID'];
}

export interface CreateRegionInput {
  readonly region: CreateRegion;
}

export interface CreateRegion {
  readonly name: Scalars['String'];
  /** The zone ID that the region will be associated with */
  readonly zoneId: Scalars['ID'];
  /** A user ID that will be the director of the region */
  readonly directorId: Scalars['ID'];
}

export interface CreateCountryInput {
  readonly country: CreateCountry;
}

export interface CreateCountry {
  readonly name: Scalars['String'];
  readonly regionId: Scalars['ID'];
}

export interface UpdateZoneInput {
  readonly zone: UpdateZone;
}

export interface UpdateZone {
  readonly id: Scalars['ID'];
  readonly name?: Maybe<Scalars['String']>;
  /** A user ID that will be the new director of the zone */
  readonly directorId?: Maybe<Scalars['ID']>;
}

export interface UpdateRegionInput {
  readonly region: UpdateRegion;
}

export interface UpdateRegion {
  readonly id: Scalars['ID'];
  readonly name?: Maybe<Scalars['String']>;
  /** The zone ID that the region will be associated with */
  readonly zoneId?: Maybe<Scalars['ID']>;
  /** A user ID that will be the director of the region */
  readonly directorId?: Maybe<Scalars['ID']>;
}

export interface UpdateCountryInput {
  readonly country: UpdateCountry;
}

export interface UpdateCountry {
  readonly id: Scalars['ID'];
  readonly name?: Maybe<Scalars['String']>;
  readonly regionId?: Maybe<Scalars['ID']>;
}

export interface CreateDirectoryInput {
  /** The ID for the parent directory */
  readonly parentId: Scalars['ID'];
  /** The directory name */
  readonly name: Scalars['String'];
}

export interface CreateFileVersionInput {
  /** The ID returned from the `requestFileUpload` mutation */
  readonly uploadId: Scalars['ID'];
  /** The directory ID if creating a new file or the file ID if creating a new version */
  readonly parentId: Scalars['ID'];
  /** The file name */
  readonly name: Scalars['String'];
}

export interface RenameFileInput {
  /** The file node's ID */
  readonly id: Scalars['ID'];
  /** The new name */
  readonly name: Scalars['String'];
}

export interface MoveFileInput {
  /** The file or directory's ID */
  readonly id: Scalars['ID'];
  /** The new parent ID */
  readonly parentId: Scalars['ID'];
  /**
   * Optionally change the name as well.
   * Could be helpful for if the destination has a node with the same name.
   */
  readonly name?: Maybe<Scalars['String']>;
}

export interface UpdateCeremonyInput {
  readonly ceremony: UpdateCeremony;
}

export interface UpdateCeremony {
  readonly id: Scalars['ID'];
  readonly planned?: Maybe<Scalars['Boolean']>;
  readonly estimatedDate?: Maybe<Scalars['Date']>;
  readonly actualDate?: Maybe<Scalars['Date']>;
}

export interface CreateProjectMemberInput {
  readonly projectMember: CreateProjectMember;
}

export interface CreateProjectMember {
  /** A user ID */
  readonly userId: Scalars['ID'];
  /** A project ID */
  readonly projectId: Scalars['ID'];
  readonly roles?: Maybe<readonly Role[]>;
}

export interface UpdateProjectMemberInput {
  readonly projectMember: UpdateProjectMember;
}

export interface UpdateProjectMember {
  readonly id: Scalars['ID'];
  readonly roles?: Maybe<readonly Role[]>;
}

export interface CreatePartnershipInput {
  readonly partnership: CreatePartnership;
}

export interface CreatePartnership {
  readonly organizationId: Scalars['ID'];
  readonly projectId: Scalars['ID'];
  readonly agreementStatus?: Maybe<PartnershipAgreementStatus>;
  /** The partner agreement */
  readonly agreement?: Maybe<CreateDefinedFileVersionInput>;
  /** The MOU agreement */
  readonly mou?: Maybe<CreateDefinedFileVersionInput>;
  readonly mouStatus?: Maybe<PartnershipAgreementStatus>;
  readonly mouStartOverride?: Maybe<Scalars['Date']>;
  readonly mouEndOverride?: Maybe<Scalars['Date']>;
  readonly types?: Maybe<readonly PartnershipType[]>;
}

export interface CreateDefinedFileVersionInput {
  /** The ID returned from the `requestFileUpload` mutation */
  readonly uploadId: Scalars['ID'];
  /** An optional name. Defaults to file name. */
  readonly name: Scalars['String'];
}

export interface UpdatePartnershipInput {
  readonly partnership: UpdatePartnership;
}

export interface UpdatePartnership {
  readonly id: Scalars['ID'];
  readonly agreementStatus?: Maybe<PartnershipAgreementStatus>;
  /** The partner agreement */
  readonly agreement?: Maybe<CreateDefinedFileVersionInput>;
  /** The MOU agreement */
  readonly mou?: Maybe<CreateDefinedFileVersionInput>;
  readonly mouStatus?: Maybe<PartnershipAgreementStatus>;
  readonly mouStartOverride?: Maybe<Scalars['Date']>;
  readonly mouEndOverride?: Maybe<Scalars['Date']>;
  readonly types?: Maybe<readonly PartnershipType[]>;
}

export interface CreateProjectInput {
  readonly project: CreateProject;
}

export interface CreateProject {
  readonly name: Scalars['String'];
  readonly type: ProjectType;
  /** A country ID */
  readonly locationId?: Maybe<Scalars['ID']>;
  readonly mouStart?: Maybe<Scalars['Date']>;
  readonly mouEnd?: Maybe<Scalars['Date']>;
  readonly estimatedSubmission?: Maybe<Scalars['Date']>;
}

export interface UpdateProjectInput {
  readonly project: UpdateProject;
}

export interface UpdateProject {
  readonly id: Scalars['ID'];
  readonly name?: Maybe<Scalars['String']>;
  /** A country ID */
  readonly locationId?: Maybe<Scalars['ID']>;
  readonly mouStart?: Maybe<Scalars['Date']>;
  readonly mouEnd?: Maybe<Scalars['Date']>;
  readonly estimatedSubmission?: Maybe<Scalars['Date']>;
}

export interface CreateLanguageInput {
  readonly language: CreateLanguage;
}

export interface CreateLanguage {
  readonly name: Scalars['String'];
  readonly displayName: Scalars['String'];
  readonly displayNamePronunciation?: Maybe<Scalars['String']>;
  readonly isDialect?: Maybe<Scalars['Boolean']>;
  readonly ethnologue?: Maybe<CreateEthnologueLanguage>;
  readonly populationOverride?: Maybe<Scalars['Int']>;
  readonly registryOfDialectsCode?: Maybe<Scalars['String']>;
  readonly leastOfThese?: Maybe<Scalars['Boolean']>;
  readonly leastOfTheseReason?: Maybe<Scalars['String']>;
}

export interface CreateEthnologueLanguage {
  readonly id?: Maybe<Scalars['String']>;
  readonly code?: Maybe<Scalars['String']>;
  readonly provisionalCode?: Maybe<Scalars['String']>;
  readonly name?: Maybe<Scalars['String']>;
  readonly population?: Maybe<Scalars['Int']>;
}

export interface UpdateLanguageInput {
  readonly language: UpdateLanguage;
}

export interface UpdateLanguage {
  readonly id: Scalars['ID'];
  readonly name?: Maybe<Scalars['String']>;
  readonly displayName?: Maybe<Scalars['String']>;
  readonly displayNamePronunciation?: Maybe<Scalars['String']>;
  readonly isDialect?: Maybe<Scalars['Boolean']>;
  readonly ethnologue?: Maybe<UpdateEthnologueLanguage>;
  readonly populationOverride?: Maybe<Scalars['Int']>;
  readonly registryOfDialectsCode?: Maybe<Scalars['String']>;
  readonly leastOfThese?: Maybe<Scalars['Boolean']>;
  readonly leastOfTheseReason?: Maybe<Scalars['String']>;
}

export interface UpdateEthnologueLanguage {
  readonly id?: Maybe<Scalars['String']>;
  readonly code?: Maybe<Scalars['String']>;
  readonly provisionalCode?: Maybe<Scalars['String']>;
  readonly name?: Maybe<Scalars['String']>;
  readonly population?: Maybe<Scalars['Int']>;
}

export interface CreateFilmInput {
  readonly film: CreateFilm;
}

export interface CreateFilm {
  readonly name: Scalars['String'];
  readonly scriptureReferences?: Maybe<readonly ScriptureRangeInput[]>;
}

export interface ScriptureRangeInput {
  /** The starting verse */
  readonly start: ScriptureReferenceInput;
  /** The ending verse */
  readonly end: ScriptureReferenceInput;
}

/** A reference to a scripture verse */
export interface ScriptureReferenceInput {
  /** The code of the Bible book */
  readonly book: Scalars['String'];
  /** The chapter number */
  readonly chapter: Scalars['Int'];
  /** The verse number */
  readonly verse: Scalars['Int'];
}

export interface UpdateFilmInput {
  readonly film: UpdateFilm;
}

export interface UpdateFilm {
  readonly id: Scalars['ID'];
  readonly name?: Maybe<Scalars['String']>;
  readonly scriptureReferences?: Maybe<readonly ScriptureRangeInput[]>;
}

export interface CreateLiteracyMaterialInput {
  readonly literacyMaterial: CreateLiteracyMaterial;
}

export interface CreateLiteracyMaterial {
  readonly name: Scalars['String'];
  readonly scriptureReferences?: Maybe<readonly ScriptureRangeInput[]>;
}

export interface UpdateLiteracyMaterialInput {
  readonly literacyMaterial: UpdateLiteracyMaterial;
}

export interface UpdateLiteracyMaterial {
  readonly id: Scalars['ID'];
  readonly name?: Maybe<Scalars['String']>;
  readonly scriptureReferences?: Maybe<readonly ScriptureRangeInput[]>;
}

export interface CreateStoryInput {
  readonly story: CreateStory;
}

export interface CreateStory {
  readonly name: Scalars['String'];
  readonly scriptureReferences?: Maybe<readonly ScriptureRangeInput[]>;
}

export interface UpdateStoryInput {
  readonly story: UpdateStory;
}

export interface UpdateStory {
  readonly id: Scalars['ID'];
  readonly name?: Maybe<Scalars['String']>;
  readonly scriptureReferences?: Maybe<readonly ScriptureRangeInput[]>;
}

export interface CreateProductInput {
  readonly product: CreateProduct;
}

export interface CreateProduct {
  /** An ID of a `LanguageEngagement` to create this product for */
  readonly engagementId: Scalars['String'];
  /**
   * An ID of a `Producible` object, which will create a `DerivativeScriptureProduct`.
   * If omitted a `DirectScriptureProduct` will be created instead.
   */
  readonly produces?: Maybe<Scalars['ID']>;
  /**
   * Change this list of `scriptureReferences` if provided.
   *
   * Note only `DirectScriptureProduct`s can use this field.
   */
  readonly scriptureReferences?: Maybe<readonly ScriptureRangeInput[]>;
  /**
   * The `Producible` defines a `scriptureReferences` list, and this is
   * used by default in this product's `scriptureReferences` list.
   * If this product _specifically_ needs to customize the references, then
   * this property can be set (and read) to "override" the `producible`'s list.
   *
   * Note only `DerivativeScriptureProduct`s can use this field.
   */
  readonly scriptureReferencesOverride?: Maybe<readonly ScriptureRangeInput[]>;
  readonly mediums?: Maybe<readonly ProductMedium[]>;
  readonly purposes?: Maybe<readonly ProductPurpose[]>;
  readonly methodology?: Maybe<ProductMethodology>;
}

export interface UpdateProductInput {
  readonly product: UpdateProduct;
}

export interface UpdateProduct {
  /**
   * Change this list of `scriptureReferences` if provided.
   *
   * Note only `DirectScriptureProduct`s can use this field.
   */
  readonly scriptureReferences?: Maybe<readonly ScriptureRangeInput[]>;
  /**
   * The `Producible` defines a `scriptureReferences` list, and this is
   * used by default in this product's `scriptureReferences` list.
   * If this product _specifically_ needs to customize the references, then
   * this property can be set (and read) to "override" the `producible`'s list.
   *
   * Note only `DerivativeScriptureProduct`s can use this field.
   */
  readonly scriptureReferencesOverride?: Maybe<readonly ScriptureRangeInput[]>;
  readonly mediums?: Maybe<readonly ProductMedium[]>;
  readonly purposes?: Maybe<readonly ProductPurpose[]>;
  readonly methodology?: Maybe<ProductMethodology>;
  readonly id: Scalars['ID'];
  /**
   * An ID of a `Producible` object to change.
   *
   * Note only `DerivativeScriptureProduct`s can use this field.
   */
  readonly produces?: Maybe<Scalars['ID']>;
}

export interface CreateLanguageEngagementInput {
  readonly engagement: CreateLanguageEngagement;
}

export interface CreateLanguageEngagement {
  readonly projectId: Scalars['ID'];
  readonly completeDate?: Maybe<Scalars['Date']>;
  readonly disbursementCompleteDate?: Maybe<Scalars['Date']>;
  readonly communicationsCompleteDate?: Maybe<Scalars['Date']>;
  readonly startDate?: Maybe<Scalars['Date']>;
  readonly endDate?: Maybe<Scalars['Date']>;
  readonly languageId: Scalars['ID'];
  readonly firstScripture?: Maybe<Scalars['Boolean']>;
  readonly lukePartnership?: Maybe<Scalars['Boolean']>;
  readonly paraTextRegistryId?: Maybe<Scalars['String']>;
  readonly pnp?: Maybe<CreateDefinedFileVersionInput>;
}

export interface CreateInternshipEngagementInput {
  readonly engagement: CreateInternshipEngagement;
}

export interface CreateInternshipEngagement {
  readonly projectId: Scalars['ID'];
  readonly completeDate?: Maybe<Scalars['Date']>;
  readonly disbursementCompleteDate?: Maybe<Scalars['Date']>;
  readonly communicationsCompleteDate?: Maybe<Scalars['Date']>;
  readonly startDate?: Maybe<Scalars['Date']>;
  readonly endDate?: Maybe<Scalars['Date']>;
  readonly internId: Scalars['ID'];
  readonly mentorId?: Maybe<Scalars['ID']>;
  readonly countryOfOriginId?: Maybe<Scalars['ID']>;
  readonly position?: Maybe<InternshipEngagementPosition>;
  readonly methodologies?: Maybe<readonly ProductMethodology[]>;
  readonly growthPlan?: Maybe<CreateDefinedFileVersionInput>;
}

export interface UpdateLanguageEngagementInput {
  readonly engagement: UpdateLanguageEngagement;
}

export interface UpdateLanguageEngagement {
  readonly id: Scalars['ID'];
  readonly completeDate?: Maybe<Scalars['Date']>;
  readonly disbursementCompleteDate?: Maybe<Scalars['Date']>;
  readonly communicationsCompleteDate?: Maybe<Scalars['Date']>;
  readonly startDate?: Maybe<Scalars['Date']>;
  readonly endDate?: Maybe<Scalars['Date']>;
  readonly firstScripture?: Maybe<Scalars['Boolean']>;
  readonly lukePartnership?: Maybe<Scalars['Boolean']>;
  readonly paraTextRegistryId?: Maybe<Scalars['String']>;
  readonly pnp?: Maybe<CreateDefinedFileVersionInput>;
}

export interface UpdateInternshipEngagementInput {
  readonly engagement: UpdateInternshipEngagement;
}

export interface UpdateInternshipEngagement {
  readonly id: Scalars['ID'];
  readonly completeDate?: Maybe<Scalars['Date']>;
  readonly disbursementCompleteDate?: Maybe<Scalars['Date']>;
  readonly communicationsCompleteDate?: Maybe<Scalars['Date']>;
  readonly startDate?: Maybe<Scalars['Date']>;
  readonly endDate?: Maybe<Scalars['Date']>;
  readonly mentorId?: Maybe<Scalars['ID']>;
  readonly countryOfOriginId?: Maybe<Scalars['ID']>;
  readonly position?: Maybe<InternshipEngagementPosition>;
  readonly methodologies?: Maybe<readonly ProductMethodology[]>;
  readonly growthPlan?: Maybe<CreateDefinedFileVersionInput>;
}

export interface UpdateBudgetRecordInput {
  readonly budgetRecord: UpdateBudgetRecord;
}

export interface UpdateBudgetRecord {
  readonly id: Scalars['ID'];
  readonly amount: Scalars['Int'];
}

export interface CreateBudgetInput {
  readonly budget: CreateBudget;
}

export interface CreateBudget {
  readonly projectId: Scalars['ID'];
}

export interface UpdateBudgetInput {
  readonly budget: UpdateBudget;
}

export interface UpdateBudget {
  readonly id: Scalars['ID'];
  readonly status: BudgetStatus;
}

export type BudgetStatus = 'Pending' | 'Current' | 'Superceded' | 'Rejected';

export interface AddFavoriteInput {
  readonly favorite: AddFavorite;
}

export interface AddFavorite {
  readonly baseNodeId: Scalars['String'];
}

export interface CreateSongInput {
  readonly song: CreateSong;
}

export interface CreateSong {
  readonly name: Scalars['String'];
  readonly scriptureReferences?: Maybe<readonly ScriptureRangeInput[]>;
}

export interface UpdateSongInput {
  readonly song: UpdateSong;
}

export interface UpdateSong {
  readonly id: Scalars['ID'];
  readonly name?: Maybe<Scalars['String']>;
  readonly scriptureReferences?: Maybe<readonly ScriptureRangeInput[]>;
}

export interface CreateWorkflowInput {
  readonly workflow: CreateWorkflow;
}

export interface CreateWorkflow {
  readonly baseNodeId: Scalars['ID'];
  readonly startingStateName: Scalars['String'];
  readonly stateIdentifier: Scalars['String'];
}

export interface AddStateInput {
  readonly state: AddState;
}

export interface AddState {
  readonly workflowId: Scalars['ID'];
  readonly stateName: Scalars['String'];
}

export interface UpdateStateInput {
  readonly state: UpdateState;
}

export interface UpdateState {
  readonly stateId: Scalars['ID'];
  readonly workflowId: Scalars['ID'];
  readonly stateName: Scalars['String'];
}

export interface GroupStateInput {
  readonly groupState: GroupState;
}

export interface GroupState {
  readonly stateId: Scalars['ID'];
  readonly securityGroupId: Scalars['ID'];
}

export interface ChangeCurrentStateInput {
  readonly state: ChangeCurrentState;
}

export interface ChangeCurrentState {
  readonly newStateId: Scalars['ID'];
  readonly workflowId: Scalars['ID'];
}

export interface PossibleStateInput {
  readonly state: PossibleState;
}

export interface PossibleState {
  readonly fromStateId: Scalars['ID'];
  readonly toStateId: Scalars['ID'];
}

export interface RequiredFieldInput {
  readonly field: RequiredField;
}

export interface RequiredField {
  readonly stateId: Scalars['ID'];
  readonly propertyName: Scalars['String'];
}
