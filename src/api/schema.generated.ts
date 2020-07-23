import { DateTime } from 'luxon';
import { CalendarDate } from '../util';

export type Maybe<T> = T | null;
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
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  type: FileNodeType;
  category: FileNodeCategory;
  /**
   * The name of the node.
   * This is user defined but does not necessarily need to be url safe.
   */
  name: Scalars['String'];
  /**
   * The user who created this node.
   * For files, this is the user who uploaded the first version of the file.
   */
  createdBy: User;
  /**
   * A list of the parents all the way up the tree.
   * This can be used to populate a path-like UI,
   * without having to fetch each parent serially.
   */
  parents: FileNode[];
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
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  type: ProjectType;
  sensitivity: Sensitivity;
  name: SecuredString;
  /** The legacy department ID */
  deptId: SecuredString;
  step: SecuredProjectStep;
  status: ProjectStatus;
  location: SecuredCountry;
  mouStart: SecuredDate;
  mouEnd: SecuredDate;
  estimatedSubmission: SecuredDate;
  modifiedAt: Scalars['DateTime'];
  avatarLetters?: Maybe<Scalars['String']>;
  /** The project's current budget */
  budget: SecuredBudget;
  engagements: SecuredEngagementList;
  /** The project members */
  team: SecuredProjectMemberList;
  partnerships: SecuredPartnershipList;
  /** The root filesystem directory of this project */
  rootDirectory: Directory;
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
  count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  order?: Maybe<Order>;
  filter?: Maybe<EngagementFilters>;
}

/** A sort order either ascending or descending */
export type Order = 'ASC' | 'DESC';

export interface EngagementFilters {
  /** Only engagements matching this type */
  type?: Maybe<Scalars['String']>;
  /** Only engagements matching this projectId */
  projectId?: Maybe<Scalars['ID']>;
}

export interface ProjectMemberListInput {
  /** The number of items to return in a single page */
  count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  order?: Maybe<Order>;
  filter?: Maybe<ProjectMemberFilters>;
}

export interface ProjectMemberFilters {
  /** Only members with these roles */
  roles?: Maybe<Role[]>;
  /** Only members of this project */
  projectId?: Maybe<Scalars['ID']>;
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
  count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  order?: Maybe<Order>;
  filter?: Maybe<PartnershipFilters>;
}

export interface PartnershipFilters {
  /** Find all partnerships in a project */
  projectId?: Maybe<Scalars['ID']>;
}

/** Something that is _producible_ via a Product */
export interface Producible {
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  scriptureReferences: SecuredScriptureRanges;
}

export interface Product {
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  scriptureReferences: SecuredScriptureRanges;
  mediums: SecuredProductMediums;
  purposes: SecuredProductPurposes;
  methodology: SecuredMethodology;
  approach?: Maybe<ProductApproach>;
  /** Provide what would be the "type" of product in the old schema. */
  legacyType: ProductType;
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
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  status: EngagementStatus;
  /** Translation / Growth Plan complete date */
  completeDate: SecuredDate;
  disbursementCompleteDate: SecuredDate;
  communicationsCompleteDate: SecuredDate;
  startDate: SecuredDate;
  endDate: SecuredDate;
  initialEndDate: SecuredDate;
  lastSuspendedAt: SecuredDateTime;
  lastReactivatedAt: SecuredDateTime;
  /** The last time the engagement status was modified */
  statusModifiedAt: SecuredDateTime;
  modifiedAt: Scalars['DateTime'];
  ceremony: SecuredCeremony;
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
    __typename?: 'SecuredString';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value?: Maybe<Scalars['String']>;
  };

/** Entities that are readable */
export interface Readable {
  /** Whether the current user can read this object */
  canRead: Scalars['Boolean'];
}

/** Entities that are editable */
export interface Editable {
  /** Whether the current user can edit this object */
  canEdit: Scalars['Boolean'];
}

/**
 * An object with an integer `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredInt = Readable &
  Editable & {
    __typename?: 'SecuredInt';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value?: Maybe<Scalars['Int']>;
  };

/**
 * An object with a float `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredFloat = Readable &
  Editable & {
    __typename?: 'SecuredFloat';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value?: Maybe<Scalars['Float']>;
  };

/**
 * An object with a boolean `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredBoolean = Readable &
  Editable & {
    __typename?: 'SecuredBoolean';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value?: Maybe<Scalars['Boolean']>;
  };

export type SecuredDateTime = Readable &
  Editable & {
    __typename?: 'SecuredDateTime';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value?: Maybe<Scalars['DateTime']>;
  };

export type SecuredDate = Readable &
  Editable & {
    __typename?: 'SecuredDate';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value?: Maybe<Scalars['Date']>;
  };

export interface CreatePermissionOutput {
  __typename?: 'CreatePermissionOutput';
  success: Scalars['Boolean'];
  id?: Maybe<Scalars['ID']>;
}

export interface CreateSecurityGroupOutput {
  __typename?: 'CreateSecurityGroupOutput';
  success: Scalars['Boolean'];
  id?: Maybe<Scalars['ID']>;
}

export interface Permission {
  __typename?: 'Permission';
  id: Scalars['ID'];
  property: Scalars['String'];
  read: Scalars['Boolean'];
  write: Scalars['Boolean'];
}

export interface ListPermissionOutput {
  __typename?: 'ListPermissionOutput';
  items: Permission[];
}

export interface SecurityGroup {
  __typename?: 'SecurityGroup';
  id: Scalars['ID'];
  name: Scalars['String'];
}

export interface ListSecurityGroupOutput {
  __typename?: 'ListSecurityGroupOutput';
  items: SecurityGroup[];
}

export interface UpdateSecurityGroupNameOutput {
  __typename?: 'UpdateSecurityGroupNameOutput';
  id: Scalars['ID'];
  name: Scalars['String'];
}

export type Organization = Resource & {
  __typename?: 'Organization';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  name: SecuredString;
  avatarLetters?: Maybe<Scalars['String']>;
};

export interface Resource {
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
}

/**
 * An object with an organization `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredOrganization = Readable &
  Editable & {
    __typename?: 'SecuredOrganization';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value?: Maybe<Organization>;
  };

export interface CreateOrganizationOutput {
  __typename?: 'CreateOrganizationOutput';
  organization: Organization;
}

export interface OrganizationListOutput {
  __typename?: 'OrganizationListOutput';
  /**
   * The page of organization.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: Organization[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
}

/**
 * An object whose `items` is a list of organizations and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is an empty list.
 * The `can*` properties are specific to the user making the request.
 */
export type SecuredOrganizationList = Readable & {
  __typename?: 'SecuredOrganizationList';
  /**
   * The page of organization.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: Organization[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
  /** Whether the current user can read the list of items */
  canRead: Scalars['Boolean'];
  /** Whether the current user can add items to this list via the appropriate mutation */
  canCreate: Scalars['Boolean'];
};

export interface UpdateOrganizationOutput {
  __typename?: 'UpdateOrganizationOutput';
  organization: Organization;
}

/**
 * An object with a user status `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredUserStatus = Readable &
  Editable & {
    __typename?: 'SecuredUserStatus';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value?: Maybe<UserStatus>;
  };

export type UserStatus = 'Active' | 'Disabled';

export type User = Resource & {
  __typename?: 'User';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  email: SecuredString;
  realFirstName: SecuredString;
  realLastName: SecuredString;
  displayFirstName: SecuredString;
  displayLastName: SecuredString;
  phone: SecuredString;
  bio: SecuredString;
  status: SecuredUserStatus;
  fullName?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  avatarLetters?: Maybe<Scalars['String']>;
  timezone: SecuredTimeZone;
  unavailabilities: SecuredUnavailabilityList;
  organizations: SecuredOrganizationList;
  education: SecuredEducationList;
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
  count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  order?: Maybe<Order>;
  filter?: Maybe<UnavailabilityFilters>;
}

export interface UnavailabilityFilters {
  /** Unavailabilities for UserId */
  userId?: Maybe<Scalars['ID']>;
}

export interface OrganizationListInput {
  /** The number of items to return in a single page */
  count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  order?: Maybe<Order>;
  filter?: Maybe<OrganizationFilters>;
}

export interface OrganizationFilters {
  /** Only organizations matching this name */
  name?: Maybe<Scalars['String']>;
  /** User IDs ANY of which must belong to the organizations */
  userId?: Maybe<Array<Scalars['ID']>>;
}

export interface EducationListInput {
  /** The number of items to return in a single page */
  count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  order?: Maybe<Order>;
  filter?: Maybe<EducationFilters>;
}

export interface EducationFilters {
  /** Educations for UserId */
  userId?: Maybe<Scalars['ID']>;
}

/**
 * An object with a user `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredUser = Readable &
  Editable & {
    __typename?: 'SecuredUser';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value?: Maybe<User>;
  };

export interface UserListOutput {
  __typename?: 'UserListOutput';
  /**
   * The page of user.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: User[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
}

export interface CreatePersonOutput {
  __typename?: 'CreatePersonOutput';
  user: User;
}

export interface UpdateUserOutput {
  __typename?: 'UpdateUserOutput';
  user: User;
}

/**
 * An object with a string `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredDegree = Readable &
  Editable & {
    __typename?: 'SecuredDegree';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value?: Maybe<Scalars['String']>;
  };

export type Education = Resource & {
  __typename?: 'Education';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  degree: SecuredDegree;
  major: SecuredString;
  institution: SecuredString;
};

export interface CreateEducationOutput {
  __typename?: 'CreateEducationOutput';
  education: Education;
}

export interface EducationListOutput {
  __typename?: 'EducationListOutput';
  /**
   * The page of education.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: Education[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
}

/**
 * An object whose `items` is a list of education objects and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is an empty list.
 * The `can*` properties are specific to the user making the request.
 */
export type SecuredEducationList = Readable & {
  __typename?: 'SecuredEducationList';
  /**
   * The page of education.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: Education[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
  /** Whether the current user can read the list of items */
  canRead: Scalars['Boolean'];
  /** Whether the current user can add items to this list via the appropriate mutation */
  canCreate: Scalars['Boolean'];
};

export interface UpdateEducationOutput {
  __typename?: 'UpdateEducationOutput';
  education: Education;
}

export type Unavailability = Resource & {
  __typename?: 'Unavailability';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  description: SecuredString;
  start: Scalars['DateTime'];
  end: Scalars['DateTime'];
};

export interface CreateUnavailabilityOutput {
  __typename?: 'CreateUnavailabilityOutput';
  unavailability: Unavailability;
}

export interface UnavailabilityListOutput {
  __typename?: 'UnavailabilityListOutput';
  /**
   * The page of unavailability.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: Unavailability[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
}

/**
 * An object whose `items` is a list of unavailabilities and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is an empty list.
 * The `can*` properties are specific to the user making the request.
 */
export type SecuredUnavailabilityList = Readable & {
  __typename?: 'SecuredUnavailabilityList';
  /**
   * The page of unavailability.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: Unavailability[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
  /** Whether the current user can read the list of items */
  canRead: Scalars['Boolean'];
  /** Whether the current user can add items to this list via the appropriate mutation */
  canCreate: Scalars['Boolean'];
};

export interface UpdateUnavailabilityOutput {
  __typename?: 'UpdateUnavailabilityOutput';
  unavailability: Unavailability;
}

export interface RegisterOutput {
  __typename?: 'RegisterOutput';
  user: User;
}

/** An IANA Time Zone */
export interface TimeZone {
  __typename?: 'TimeZone';
  name: Scalars['String'];
  lat: Scalars['Float'];
  long: Scalars['Float'];
  countries: IanaCountry[];
}

/** An IANA Country associated with timezones */
export interface IanaCountry {
  __typename?: 'IanaCountry';
  code: Scalars['String'];
  name: Scalars['String'];
  zones: TimeZone[];
}

/**
 * An object with a timezone `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredTimeZone = Readable &
  Editable & {
    __typename?: 'SecuredTimeZone';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value?: Maybe<TimeZone>;
  };

export interface SessionOutput {
  __typename?: 'SessionOutput';
  /**
   * Use this token in future requests in the Authorization header.
   * Authorization: Bearer {token}.
   * This token is only returned when the `browser` argument is not set to `true`.
   */
  token?: Maybe<Scalars['String']>;
  /** Only returned if there is a logged-in user tied to the current session. */
  user?: Maybe<User>;
}

export interface LoginOutput {
  __typename?: 'LoginOutput';
  /** The logged-in user */
  user: User;
}

export type Zone = Resource &
  Place & {
    __typename?: 'Zone';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    name: SecuredString;
    director: SecuredUser;
  };

export interface Place {
  name: SecuredString;
}

/**
 * An object with a zone `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredZone = Readable &
  Editable & {
    __typename?: 'SecuredZone';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value?: Maybe<Zone>;
  };

export type Region = Resource &
  Place & {
    __typename?: 'Region';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    name: SecuredString;
    zone: SecuredZone;
    director: SecuredUser;
  };

/**
 * An object with a region `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredRegion = Readable &
  Editable & {
    __typename?: 'SecuredRegion';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value?: Maybe<Region>;
  };

export type Country = Resource &
  Place & {
    __typename?: 'Country';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    name: SecuredString;
    region: SecuredRegion;
  };

/**
 * An object with a country `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredCountry = Readable &
  Editable & {
    __typename?: 'SecuredCountry';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value?: Maybe<Country>;
  };

export interface CreateZoneOutput {
  __typename?: 'CreateZoneOutput';
  zone: Zone;
}

export interface CreateRegionOutput {
  __typename?: 'CreateRegionOutput';
  region: Region;
}

export interface CreateCountryOutput {
  __typename?: 'CreateCountryOutput';
  country: Country;
}

export interface UpdateZoneOutput {
  __typename?: 'UpdateZoneOutput';
  zone: Zone;
}

export interface UpdateRegionOutput {
  __typename?: 'UpdateRegionOutput';
  region: Region;
}

export interface UpdateCountryOutput {
  __typename?: 'UpdateCountryOutput';
  country: Country;
}

export interface LocationListOutput {
  __typename?: 'LocationListOutput';
  /**
   * The page of locations.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: Location[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
}

export type Location = Country | Region | Zone;

export type SecuredLocationList = Readable & {
  __typename?: 'SecuredLocationList';
  /**
   * An object whose `items` is a list of locations and additional authorization information.
   * The value is only given if `canRead` is `true` otherwise it is an empty list.
   * The `can*` properties are specific to the user making the request.
   */
  items: Location[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
  /** Whether the current user can read the list of items */
  canRead: Scalars['Boolean'];
  /** Whether the current user can add items to this list via the appropriate mutation */
  canCreate: Scalars['Boolean'];
};

export interface RequestUploadOutput {
  __typename?: 'RequestUploadOutput';
  id: Scalars['ID'];
  /** A pre-signed url to upload the file to */
  url: Scalars['String'];
}

export type FileVersion = FileNode &
  Resource & {
    __typename?: 'FileVersion';
    mimeType: Scalars['String'];
    size: Scalars['Int'];
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    type: FileNodeType;
    category: FileNodeCategory;
    /**
     * The name of the node.
     * This is user defined but does not necessarily need to be url safe.
     */
    name: Scalars['String'];
    /**
     * The user who created this node.
     * For files, this is the user who uploaded the first version of the file.
     */
    createdBy: User;
    /**
     * A list of the parents all the way up the tree.
     * This can be used to populate a path-like UI,
     * without having to fetch each parent serially.
     */
    parents: FileNode[];
    /** A direct url to download the file version */
    downloadUrl: Scalars['String'];
  };

export type File = FileNode &
  Resource & {
    __typename?: 'File';
    mimeType: Scalars['String'];
    size: Scalars['Int'];
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    type: FileNodeType;
    category: FileNodeCategory;
    /**
     * The name of the node.
     * This is user defined but does not necessarily need to be url safe.
     */
    name: Scalars['String'];
    /**
     * The user who created this node.
     * For files, this is the user who uploaded the first version of the file.
     */
    createdBy: User;
    /**
     * A list of the parents all the way up the tree.
     * This can be used to populate a path-like UI,
     * without having to fetch each parent serially.
     */
    parents: FileNode[];
    modifiedAt: Scalars['DateTime'];
    /** The user who uploaded the most recent version of this file */
    modifiedBy: User;
    /** Return the versions of this file */
    children: FileListOutput;
    /** A direct url to download the file */
    downloadUrl: Scalars['String'];
  };

export interface FileChildrenArgs {
  input?: Maybe<FileListInput>;
}

export interface FileListInput {
  /** The number of items to return in a single page */
  count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  order?: Maybe<Order>;
  filter?: Maybe<FileFilters>;
}

export interface FileFilters {
  /** Only file nodes matching this name */
  name?: Maybe<Scalars['String']>;
  /** Only file nodes matching this type */
  type?: Maybe<FileNodeType>;
  /** Only file nodes matching these categories */
  category?: Maybe<FileNodeCategory[]>;
}

export type Directory = FileNode &
  Resource & {
    __typename?: 'Directory';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    type: FileNodeType;
    category: FileNodeCategory;
    /**
     * The name of the node.
     * This is user defined but does not necessarily need to be url safe.
     */
    name: Scalars['String'];
    /**
     * The user who created this node.
     * For files, this is the user who uploaded the first version of the file.
     */
    createdBy: User;
    /**
     * A list of the parents all the way up the tree.
     * This can be used to populate a path-like UI,
     * without having to fetch each parent serially.
     */
    parents: FileNode[];
    /** Return the file nodes of this directory */
    children: FileListOutput;
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
    __typename?: 'SecuredFile';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value?: Maybe<File>;
  };

export interface FileListOutput {
  __typename?: 'FileListOutput';
  /**
   * The page of file nodes.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: FileNode[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
}

export type Ceremony = Resource & {
  __typename?: 'Ceremony';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  type: CeremonyType;
  planned: SecuredBoolean;
  estimatedDate: SecuredDate;
  actualDate: SecuredDate;
};

export type CeremonyType = 'Dedication' | 'Certification';

/**
 * An object with a ceremony `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredCeremony = Readable &
  Editable & {
    __typename?: 'SecuredCeremony';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value?: Maybe<Ceremony>;
  };

export interface CeremonyListOutput {
  __typename?: 'CeremonyListOutput';
  /**
   * The page of ceremony.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: Ceremony[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
}

export interface UpdateCeremonyOutput {
  __typename?: 'UpdateCeremonyOutput';
  ceremony: Ceremony;
}

/**
 * An object with a project step `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredProjectStep = Readable &
  Editable & {
    __typename?: 'SecuredProjectStep';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value?: Maybe<ProjectStep>;
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
    __typename?: 'TranslationProject';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    type: ProjectType;
    sensitivity: Sensitivity;
    name: SecuredString;
    /** The legacy department ID */
    deptId: SecuredString;
    step: SecuredProjectStep;
    status: ProjectStatus;
    location: SecuredCountry;
    mouStart: SecuredDate;
    mouEnd: SecuredDate;
    estimatedSubmission: SecuredDate;
    modifiedAt: Scalars['DateTime'];
    avatarLetters?: Maybe<Scalars['String']>;
    /** The project's current budget */
    budget: SecuredBudget;
    engagements: SecuredEngagementList;
    /** The project members */
    team: SecuredProjectMemberList;
    partnerships: SecuredPartnershipList;
    /** The root filesystem directory of this project */
    rootDirectory: Directory;
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
    __typename?: 'InternshipProject';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    type: ProjectType;
    sensitivity: Sensitivity;
    name: SecuredString;
    /** The legacy department ID */
    deptId: SecuredString;
    step: SecuredProjectStep;
    status: ProjectStatus;
    location: SecuredCountry;
    mouStart: SecuredDate;
    mouEnd: SecuredDate;
    estimatedSubmission: SecuredDate;
    modifiedAt: Scalars['DateTime'];
    avatarLetters?: Maybe<Scalars['String']>;
    /** The project's current budget */
    budget: SecuredBudget;
    engagements: SecuredEngagementList;
    /** The project members */
    team: SecuredProjectMemberList;
    partnerships: SecuredPartnershipList;
    /** The root filesystem directory of this project */
    rootDirectory: Directory;
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
  __typename?: 'CreateProjectOutput';
  project: Project;
}

export interface ProjectListOutput {
  __typename?: 'ProjectListOutput';
  /**
   * The page of projects.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: Project[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
}

/**
 * An object whose `items` is a list of projects and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is an empty list.
 * The `can*` properties are specific to the user making the request.
 */
export type SecuredProjectList = Readable & {
  __typename?: 'SecuredProjectList';
  /**
   * The page of projects.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: Project[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
  /** Whether the current user can read the list of items */
  canRead: Scalars['Boolean'];
  /** Whether the current user can add items to this list via the appropriate mutation */
  canCreate: Scalars['Boolean'];
};

export interface UpdateProjectOutput {
  __typename?: 'UpdateProjectOutput';
  project: Project;
}

export interface EthnologueLanguage {
  __typename?: 'EthnologueLanguage';
  id: SecuredString;
  /** ISO 639-3 code */
  code: SecuredString;
  /**
   * Provisional Ethnologue Code.
   * Used until official ethnologue code is created by SIL.
   */
  provisionalCode: SecuredString;
  name: SecuredString;
  population: SecuredInt;
}

export type Language = Resource & {
  __typename?: 'Language';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  /** The real language name */
  name: SecuredString;
  /**
   * The public name which will be used/shown when real name
   * is unauthorized to be viewed/read.
   * This should always be viewable.
   */
  displayName: SecuredString;
  /** The pronunciation of the display name */
  displayNamePronunciation: SecuredString;
  /** Whether this language is a dialect. */
  isDialect: SecuredBoolean;
  ethnologue: EthnologueLanguage;
  /** An override for the ethnologue's population */
  populationOverride: SecuredInt;
  /**
   * Registry of Dialects Code.
   * 5 digit number including leading zeros.
   * https://globalrecordings.net/en/rod
   */
  registryOfDialectsCode: SecuredString;
  /** Whether this language has a Least Of These grant. */
  leastOfThese: SecuredBoolean;
  /** Reason why this language is apart of the Least of These program. */
  leastOfTheseReason: SecuredString;
  /** The earliest start date from its engagements */
  sponsorDate: SecuredDate;
  /**
   * The language's sensitivity.
   * It's based on its most sensitive location.
   */
  sensitivity: Sensitivity;
  avatarLetters?: Maybe<Scalars['String']>;
  /** The fiscal year of the sponsor date */
  beginFiscalYear: SecuredInt;
  /**
   * The language's population.
   * This is either the `populationOverride` if defined
   * or the ethnologue population as a fallback.
   */
  population: SecuredInt;
  locations: SecuredLocationList;
  /** The list of projects the language is engagement in. */
  projects: SecuredProjectList;
};

export interface LanguageLocationsArgs {
  input?: Maybe<LocationListInput>;
}

export interface LanguageProjectsArgs {
  input?: Maybe<ProjectListInput>;
}

export interface LocationListInput {
  /** The number of items to return in a single page */
  count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  order?: Maybe<Order>;
  filter?: Maybe<LocationFilters>;
}

export interface LocationFilters {
  /** Only locations matching this name */
  name?: Maybe<Scalars['String']>;
  /** Filter to only these types of locations */
  types: Array<Scalars['String']>;
}

export interface ProjectListInput {
  /** The number of items to return in a single page */
  count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  order?: Maybe<Order>;
  filter?: Maybe<ProjectFilters>;
}

export interface ProjectFilters {
  /** Only projects matching this name */
  name?: Maybe<Scalars['String']>;
  /** Only projects of this type */
  type?: Maybe<ProjectType>;
  /** Only projects with these sensitivities */
  sensitivity?: Maybe<Sensitivity[]>;
  /** Only projects matching these statuses */
  status?: Maybe<ProjectStatus[]>;
  /** Only projects matching these steps */
  step?: Maybe<ProjectStep[]>;
  /** Only projects in ANY of these locations */
  locationIds?: Maybe<Array<Scalars['ID']>>;
  /** Only projects created within this time range */
  createdAt?: Maybe<DateTimeFilter>;
  /** Only projects modified within this time range */
  modifiedAt?: Maybe<DateTimeFilter>;
  /** only mine */
  mine?: Maybe<Scalars['Boolean']>;
}

/** A filter range designed for date time fields */
export interface DateTimeFilter {
  /** After or equal to this time */
  after?: Maybe<Scalars['DateTime']>;
  /** Before or equal to this time */
  before?: Maybe<Scalars['DateTime']>;
}

/**
 * An object with a language `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredLanguage = Readable &
  Editable & {
    __typename?: 'SecuredLanguage';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value?: Maybe<Language>;
  };

export interface CreateLanguageOutput {
  __typename?: 'CreateLanguageOutput';
  language: Language;
}

export interface LanguageListOutput {
  __typename?: 'LanguageListOutput';
  /**
   * The page of language.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: Language[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
}

export interface UpdateLanguageOutput {
  __typename?: 'UpdateLanguageOutput';
  language: Language;
}

export type BudgetRecord = Resource & {
  __typename?: 'BudgetRecord';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  fiscalYear: SecuredInt;
  amount: SecuredFloat;
  organization: SecuredOrganization;
};

export type Budget = Resource & {
  __typename?: 'Budget';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  status: Scalars['String'];
  records: BudgetRecord[];
  total: Scalars['Int'];
};

/**
 * An object with a budget `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredBudget = Readable &
  Editable & {
    __typename?: 'SecuredBudget';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value?: Maybe<Budget>;
  };

export interface CreateBudgetOutput {
  __typename?: 'CreateBudgetOutput';
  budget: Budget;
}

export interface BudgetListOutput {
  __typename?: 'BudgetListOutput';
  /**
   * The page of budget.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: Budget[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
}

export interface UpdateBudgetOutput {
  __typename?: 'UpdateBudgetOutput';
  budget: Budget;
}

export interface UpdateBudgetRecordOutput {
  __typename?: 'UpdateBudgetRecordOutput';
  budgetRecord: BudgetRecord;
}

/**
 * An object with an intern position `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredInternPosition = Readable &
  Editable & {
    __typename?: 'SecuredInternPosition';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value?: Maybe<InternshipEngagementPosition>;
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
    __typename?: 'SecuredProductMediums';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value: ProductMedium[];
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
    __typename?: 'SecuredMethodology';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value?: Maybe<ProductMethodology>;
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
    __typename?: 'SecuredMethodologies';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value: ProductMethodology[];
  };

/**
 * An object whose `value` is a list of product purposes and has additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is empty: `[]`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredProductPurposes = Readable &
  Editable & {
    __typename?: 'SecuredProductPurposes';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value: ProductPurpose[];
  };

export type ProductPurpose =
  | 'EvangelismChurchPlanting'
  | 'ChurchLife'
  | 'ChurchMaturity'
  | 'SocialIssues'
  | 'Discipleship';

/** A reference to a scripture verse */
export interface ScriptureReference {
  __typename?: 'ScriptureReference';
  /** The code of the Bible book */
  book: Scalars['String'];
  /** The chapter number */
  chapter: Scalars['Int'];
  /** The verse number */
  verse: Scalars['Int'];
  bookName: Scalars['String'];
  label: Scalars['String'];
}

/**
 * A range of scripture.
 * i.e. Matthew 1:1-2:10
 */
export interface ScriptureRange {
  __typename?: 'ScriptureRange';
  /** The starting verse */
  start: ScriptureReference;
  /** The ending verse */
  end: ScriptureReference;
}

/**
 * An object whose `value` is a list of scripture ranges and has additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is empty: `[]`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredScriptureRanges = Readable &
  Editable & {
    __typename?: 'SecuredScriptureRanges';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value: ScriptureRange[];
  };

/**
 * An object with a producible `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredProducible = Readable &
  Editable & {
    __typename?: 'SecuredProducible';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value?: Maybe<Producible>;
  };

/** A product producing direct scripture only. */
export type DirectScriptureProduct = Product &
  Producible &
  Resource & {
    __typename?: 'DirectScriptureProduct';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    scriptureReferences: SecuredScriptureRanges;
    mediums: SecuredProductMediums;
    purposes: SecuredProductPurposes;
    methodology: SecuredMethodology;
    approach?: Maybe<ProductApproach>;
    /** Provide what would be the "type" of product in the old schema. */
    legacyType: ProductType;
  };

/**
 * A product producing derivative of scripture.
 * Only meaning that this has a relationship to a `Producible` object.
 */
export type DerivativeScriptureProduct = Product &
  Producible &
  Resource & {
    __typename?: 'DerivativeScriptureProduct';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    scriptureReferences: SecuredScriptureRanges;
    mediums: SecuredProductMediums;
    purposes: SecuredProductPurposes;
    methodology: SecuredMethodology;
    approach?: Maybe<ProductApproach>;
    /** Provide what would be the "type" of product in the old schema. */
    legacyType: ProductType;
    /**
     * The object that this product is producing.
     * i.e. A film named "Jesus Film".
     */
    produces: SecuredProducible;
    /**
     * The `Producible` defines a `scriptureReferences` list, and this is
     * used by default in this product's `scriptureReferences` list.
     * If this product _specifically_ needs to customize the references, then
     * this property can be set (and read) to "override" the `producible`'s list.
     */
    scriptureReferencesOverride?: Maybe<SecuredScriptureRanges>;
  };

export interface CreateProductOutput {
  __typename?: 'CreateProductOutput';
  product: Product;
}

export interface UpdateProductOutput {
  __typename?: 'UpdateProductOutput';
  product: Product;
}

export interface ProductListOutput {
  __typename?: 'ProductListOutput';
  /**
   * The page of product.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: Product[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
}

/**
 * An object whose `items` is a list of products and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is an empty list.
 * The `can*` properties are specific to the user making the request.
 */
export type SecuredProductList = Readable & {
  __typename?: 'SecuredProductList';
  /**
   * The page of product.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: Product[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
  /** Whether the current user can read the list of items */
  canRead: Scalars['Boolean'];
  /** Whether the current user can add items to this list via the appropriate mutation */
  canCreate: Scalars['Boolean'];
};

export type LanguageEngagement = Engagement &
  Resource & {
    __typename?: 'LanguageEngagement';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    status: EngagementStatus;
    /** Translation / Growth Plan complete date */
    completeDate: SecuredDate;
    disbursementCompleteDate: SecuredDate;
    communicationsCompleteDate: SecuredDate;
    startDate: SecuredDate;
    endDate: SecuredDate;
    initialEndDate: SecuredDate;
    lastSuspendedAt: SecuredDateTime;
    lastReactivatedAt: SecuredDateTime;
    /** The last time the engagement status was modified */
    statusModifiedAt: SecuredDateTime;
    modifiedAt: Scalars['DateTime'];
    ceremony: SecuredCeremony;
    firstScripture: SecuredBoolean;
    lukePartnership: SecuredBoolean;
    /** Not used anymore, but exposing for legacy data. */
    sentPrintingDate: SecuredDate;
    paraTextRegistryId: SecuredString;
    language: SecuredLanguage;
    products: SecuredProductList;
    pnp: SecuredFile;
  };

export interface LanguageEngagementProductsArgs {
  input?: Maybe<ProductListInput>;
}

export interface ProductListInput {
  /** The number of items to return in a single page */
  count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  order?: Maybe<Order>;
  filter?: Maybe<ProductFilters>;
}

export interface ProductFilters {
  /** Only products matching this approach */
  approach?: Maybe<ProductApproach>;
  /** Only products matching this methodology */
  methodology?: Maybe<ProductMethodology>;
}

export type InternshipEngagement = Engagement &
  Resource & {
    __typename?: 'InternshipEngagement';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    status: EngagementStatus;
    /** Translation / Growth Plan complete date */
    completeDate: SecuredDate;
    disbursementCompleteDate: SecuredDate;
    communicationsCompleteDate: SecuredDate;
    startDate: SecuredDate;
    endDate: SecuredDate;
    initialEndDate: SecuredDate;
    lastSuspendedAt: SecuredDateTime;
    lastReactivatedAt: SecuredDateTime;
    /** The last time the engagement status was modified */
    statusModifiedAt: SecuredDateTime;
    modifiedAt: Scalars['DateTime'];
    ceremony: SecuredCeremony;
    position: SecuredInternPosition;
    methodologies: SecuredMethodologies;
    growthPlan: SecuredFile;
    intern: SecuredUser;
    mentor: SecuredUser;
    countryOfOrigin: SecuredCountry;
  };

export interface CreateLanguageEngagementOutput {
  __typename?: 'CreateLanguageEngagementOutput';
  engagement: LanguageEngagement;
}

export interface CreateInternshipEngagementOutput {
  __typename?: 'CreateInternshipEngagementOutput';
  engagement: InternshipEngagement;
}

export interface EngagementListOutput {
  __typename?: 'EngagementListOutput';
  /**
   * The page of engagements.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: Engagement[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
}

/**
 * An object whose `items` is a list of engagements and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is an empty list.
 * The `can*` properties are specific to the user making the request.
 */
export type SecuredEngagementList = Readable & {
  __typename?: 'SecuredEngagementList';
  /**
   * The page of engagements.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: Engagement[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
  /** Whether the current user can read the list of items */
  canRead: Scalars['Boolean'];
  /** Whether the current user can add items to this list via the appropriate mutation */
  canCreate: Scalars['Boolean'];
};

export interface UpdateLanguageEngagementOutput {
  __typename?: 'UpdateLanguageEngagementOutput';
  engagement: LanguageEngagement;
}

export interface UpdateInternshipEngagementOutput {
  __typename?: 'UpdateInternshipEngagementOutput';
  engagement: InternshipEngagement;
}

/**
 * An object with a partnership agreement status `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredPartnershipAgreementStatus = Readable &
  Editable & {
    __typename?: 'SecuredPartnershipAgreementStatus';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value?: Maybe<PartnershipAgreementStatus>;
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
    __typename?: 'SecuredPartnershipTypes';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value: PartnershipType[];
  };

export type PartnershipType =
  | 'Managing'
  | 'Funding'
  | 'Impact'
  | 'Technical'
  | 'Resource';

export type Partnership = Resource & {
  __typename?: 'Partnership';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  agreementStatus: SecuredPartnershipAgreementStatus;
  mouStatus: SecuredPartnershipAgreementStatus;
  mouStart: SecuredDate;
  mouEnd: SecuredDate;
  mouStartOverride: SecuredDate;
  mouEndOverride: SecuredDate;
  organization: Organization;
  types: SecuredPartnershipTypes;
  /** The MOU agreement */
  mou: SecuredFile;
  /** The partner agreement */
  agreement: SecuredFile;
};

export interface CreatePartnershipOutput {
  __typename?: 'CreatePartnershipOutput';
  partnership: Partnership;
}

export interface UpdatePartnershipOutput {
  __typename?: 'UpdatePartnershipOutput';
  partnership: Partnership;
}

export interface PartnershipListOutput {
  __typename?: 'PartnershipListOutput';
  /**
   * The page of partnership.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: Partnership[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
}

/**
 * An object whose `items` is a list of partnership objects and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is an empty list.
 * The `can*` properties are specific to the user making the request.
 */
export type SecuredPartnershipList = Readable & {
  __typename?: 'SecuredPartnershipList';
  /**
   * The page of partnership.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: Partnership[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
  /** Whether the current user can read the list of items */
  canRead: Scalars['Boolean'];
  /** Whether the current user can add items to this list via the appropriate mutation */
  canCreate: Scalars['Boolean'];
};

/**
 * An object whose `value` is a list of roles and has additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is empty: `[]`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredRoles = Readable &
  Editable & {
    __typename?: 'SecuredRoles';
    canEdit: Scalars['Boolean'];
    canRead: Scalars['Boolean'];
    value: Role[];
  };

export type ProjectMember = Resource & {
  __typename?: 'ProjectMember';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  user: SecuredUser;
  roles: SecuredRoles;
  modifiedAt: Scalars['DateTime'];
};

export interface CreateProjectMemberOutput {
  __typename?: 'CreateProjectMemberOutput';
  projectMember: ProjectMember;
}

export interface UpdateProjectMemberOutput {
  __typename?: 'UpdateProjectMemberOutput';
  projectMember: ProjectMember;
}

export interface ProjectMemberListOutput {
  __typename?: 'ProjectMemberListOutput';
  /**
   * The page of projectmember.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: ProjectMember[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
}

/**
 * An object whose `items` is a list of project members and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is an empty list.
 * The `can*` properties are specific to the user making the request.
 */
export type SecuredProjectMemberList = Readable & {
  __typename?: 'SecuredProjectMemberList';
  /**
   * The page of projectmember.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: ProjectMember[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
  /** Whether the current user can read the list of items */
  canRead: Scalars['Boolean'];
  /** Whether the current user can add items to this list via the appropriate mutation */
  canCreate: Scalars['Boolean'];
};

export type Film = Producible &
  Resource & {
    __typename?: 'Film';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    scriptureReferences: SecuredScriptureRanges;
    name: SecuredString;
  };

export interface CreateFilmOutput {
  __typename?: 'CreateFilmOutput';
  film: Film;
}

export interface FilmListOutput {
  __typename?: 'FilmListOutput';
  /**
   * The page of film.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: Film[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
}

export interface UpdateFilmOutput {
  __typename?: 'UpdateFilmOutput';
  film: Film;
}

export type LiteracyMaterial = Producible &
  Resource & {
    __typename?: 'LiteracyMaterial';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    scriptureReferences: SecuredScriptureRanges;
    name: SecuredString;
  };

export interface CreateLiteracyMaterialOutput {
  __typename?: 'CreateLiteracyMaterialOutput';
  literacyMaterial: LiteracyMaterial;
}

export interface LiteracyMaterialListOutput {
  __typename?: 'LiteracyMaterialListOutput';
  /**
   * The page of literacymaterial.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: LiteracyMaterial[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
}

export interface UpdateLiteracyMaterialOutput {
  __typename?: 'UpdateLiteracyMaterialOutput';
  literacyMaterial: LiteracyMaterial;
}

export type Story = Producible &
  Resource & {
    __typename?: 'Story';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    scriptureReferences: SecuredScriptureRanges;
    name: SecuredString;
  };

export interface CreateStoryOutput {
  __typename?: 'CreateStoryOutput';
  story: Story;
}

export interface StoryListOutput {
  __typename?: 'StoryListOutput';
  /**
   * The page of story.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: Story[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
}

export interface UpdateStoryOutput {
  __typename?: 'UpdateStoryOutput';
  story: Story;
}

export type Favorite = Resource & {
  __typename?: 'Favorite';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  baseNodeId: Scalars['String'];
};

export interface FavoriteListOutput {
  __typename?: 'FavoriteListOutput';
  /**
   * The page of favorite.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: Favorite[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
}

export interface SearchOutput {
  __typename?: 'SearchOutput';
  /** The search string to look for. */
  items: SearchResult[];
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
    __typename?: 'Song';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    scriptureReferences: SecuredScriptureRanges;
    name: SecuredString;
  };

export interface CreateSongOutput {
  __typename?: 'CreateSongOutput';
  song: Song;
}

export interface SongListOutput {
  __typename?: 'SongListOutput';
  /**
   * The page of song.
   * Note that this could include items that where also in sibling pages;
   * you should de-duplicate these based on ID.
   */
  items: Song[];
  /** The total number of items across all pages */
  total: Scalars['Int'];
  /** Whether the next page exists */
  hasMore: Scalars['Boolean'];
}

export interface UpdateSongOutput {
  __typename?: 'UpdateSongOutput';
  song: Song;
}

export interface State {
  __typename?: 'State';
  id: Scalars['ID'];
  value: Scalars['String'];
}

export interface Workflow {
  __typename?: 'Workflow';
  id: Scalars['ID'];
  stateIdentifier: Scalars['String'];
  startingState: State;
}

export interface CreateWorkflowOutput {
  __typename?: 'CreateWorkflowOutput';
  workflow: Workflow;
}

export interface AddStateOutput {
  __typename?: 'AddStateOutput';
  state: State;
}

export interface StateListOutput {
  __typename?: 'StateListOutput';
  items: State[];
}

export interface FieldObject {
  __typename?: 'FieldObject';
  value: Scalars['String'];
}

export interface RequiredFieldListOutput {
  __typename?: 'RequiredFieldListOutput';
  items: FieldObject[];
}

export interface Query {
  __typename?: 'Query';
  /** List security groups that user is a member of */
  securityGroupsUserIsMemberOf: ListSecurityGroupOutput;
  /** List security groups that user is an admin of */
  securityGroupsUserIsAdminOf: ListSecurityGroupOutput;
  /** List permissions that belong to a security group */
  permissionsInSecurityGroup: ListPermissionOutput;
  /** Look up an organization by its ID */
  organization: Organization;
  /** Look up organizations */
  organizations: OrganizationListOutput;
  /** Check all organization nodes for consistency */
  checkOrganizations: Scalars['Boolean'];
  /** Check Consistency in Organization Nodes */
  checkOrganizationConsistency: Scalars['Boolean'];
  /** Look up an education by its ID */
  education: Education;
  /** Look up educations by user id */
  educations: EducationListOutput;
  /** Check Consistency across Education Nodes */
  checkEducationConsistency: Scalars['Boolean'];
  /** Look up a unavailability by its ID */
  unavailability: Unavailability;
  /** Look up unavailabilities by user id */
  unavailabilities: UnavailabilityListOutput;
  /** Check Consistency across Unavailability Nodes */
  checkUnavailabilityConsistency: Scalars['Boolean'];
  timezones: TimeZone[];
  timezone?: Maybe<TimeZone>;
  ianaCountries: IanaCountry[];
  ianaCountry?: Maybe<IanaCountry>;
  /** Look up a user by its ID */
  user: User;
  /** Look up users */
  users: UserListOutput;
  /** Checks whether a provided email already exists */
  checkEmail: Scalars['Boolean'];
  /** Check Consistency across User Nodes */
  checkUserConsistency: Scalars['Boolean'];
  /** Create or retrieve an existing session */
  session: SessionOutput;
  /** Read one Location by id */
  location: Location;
  /** Look up locations */
  locations: LocationListOutput;
  /** Check location consistency */
  checkLocationConsistency: Scalars['Boolean'];
  directory: Directory;
  file: File;
  fileNode: FileNode;
  /**
   * Check Consistency in File Nodes
   * @deprecated This should have never existed
   */
  checkFileConsistency: Scalars['Boolean'];
  /** Look up a ceremony by its ID */
  ceremony: Ceremony;
  /** Look up ceremonies */
  ceremonies: CeremonyListOutput;
  /** Check Consistency in Ceremony Nodes */
  checkCeremonyConsistency: Scalars['Boolean'];
  /** Look up a project member by ID */
  projectMember: ProjectMember;
  /** Look up project members */
  projectMembers: ProjectMemberListOutput;
  /** Look up a partnership by ID */
  partnership: Partnership;
  /** Look up partnerships */
  partnerships: PartnershipListOutput;
  /** Check partnership node consistency */
  checkPartnershipConsistency: Scalars['Boolean'];
  /** Look up a project by its ID */
  project: Project;
  /** Look up projects */
  projects: ProjectListOutput;
  /** Check Consistency in Project Nodes */
  checkProjectConsistency: Scalars['Boolean'];
  /** Look up a language by its ID */
  language: Language;
  /** Look up languages */
  languages: LanguageListOutput;
  /** Check language node consistency */
  checkLanguageConsistency: Scalars['Boolean'];
  /** Look up a film by its ID */
  film: Film;
  /** Look up films */
  films: FilmListOutput;
  /** Look up a literacy material */
  literacyMaterial: LiteracyMaterial;
  /** Look up literacy materials */
  literacyMaterials: LiteracyMaterialListOutput;
  /** Look up a story by its ID */
  story: Story;
  /** Look up stories */
  stories: StoryListOutput;
  /** Read a product by id */
  product: Product;
  /** Look up products */
  products: ProductListOutput;
  /** Lookup an engagement by ID */
  engagement: Engagement;
  /** Look up engagements */
  engagements: EngagementListOutput;
  /** Check Consistency in Engagement Nodes */
  checkEngagementConsistency: Scalars['Boolean'];
  /** Look up a budget by its ID */
  budget: Budget;
  /** Look up budgets by projectId */
  budgets: BudgetListOutput;
  /** Check Consistency in Budget Nodes */
  checkBudgetConsistency: Scalars['Boolean'];
  /** Look up favorites */
  favorites: FavoriteListOutput;
  /** Perform a search across resources */
  search: SearchOutput;
  /** Look up a song by its ID */
  song: Song;
  /** Look up stories */
  songs: SongListOutput;
  /** Look up all states on workflow */
  states: StateListOutput;
  /** Look up all next possible states on workflow */
  nextStates: StateListOutput;
  /** List required fields in state */
  listRequiredFields: RequiredFieldListOutput;
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
  userId: Scalars['ID'];
}

export interface ListPermissionInput {
  sgId: Scalars['ID'];
}

export interface UserListInput {
  /** The number of items to return in a single page */
  count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  order?: Maybe<Order>;
  filter?: Maybe<UserFilters>;
}

export interface UserFilters {
  /** Only users matching this first name */
  displayFirstName?: Maybe<Scalars['String']>;
  /** Only users matching this last name */
  displayLastName?: Maybe<Scalars['String']>;
}

export interface CeremonyListInput {
  /** The number of items to return in a single page */
  count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  order?: Maybe<Order>;
  filter?: Maybe<CeremonyFilters>;
}

export interface CeremonyFilters {
  /** Only ceremonies of this type */
  type?: Maybe<CeremonyType>;
}

export interface LanguageListInput {
  /** The number of items to return in a single page */
  count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  order?: Maybe<Order>;
  filter?: Maybe<LanguageFilters>;
}

export interface LanguageFilters {
  /** Only languages matching this name */
  name?: Maybe<Scalars['String']>;
}

export interface FilmListInput {
  /** The number of items to return in a single page */
  count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  order?: Maybe<Order>;
  filter?: Maybe<FilmFilters>;
}

export interface FilmFilters {
  /** Only films matching this name */
  name?: Maybe<Scalars['String']>;
}

export interface LiteracyMaterialListInput {
  /** The number of items to return in a single page */
  count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  order?: Maybe<Order>;
  filter?: Maybe<LiteracyMaterialFilters>;
}

export interface LiteracyMaterialFilters {
  /** Only literacy material matching this name */
  name?: Maybe<Scalars['String']>;
}

export interface StoryListInput {
  /** The number of items to return in a single page */
  count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  order?: Maybe<Order>;
  filter?: Maybe<StoryFilters>;
}

export interface StoryFilters {
  /** Only stories matching this name */
  name?: Maybe<Scalars['String']>;
}

export interface EngagementConsistencyInput {
  /** engagement type */
  baseNode: Scalars['String'];
}

export interface BudgetListInput {
  /** The number of items to return in a single page */
  count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  order?: Maybe<Order>;
  filter?: Maybe<BudgetFilters>;
}

export interface BudgetFilters {
  /** Only budgets matching this projectId */
  projectId?: Maybe<Scalars['ID']>;
}

export interface FavoriteListInput {
  /** The number of items to return in a single page */
  count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  order?: Maybe<Order>;
  filter?: Maybe<FavoriteFilters>;
}

export interface FavoriteFilters {
  /** Only items matching this node */
  baseNode?: Maybe<BaseNode>;
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
  count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  page?: Maybe<Scalars['Int']>;
  /** The search string to look for. */
  query: Scalars['String'];
  /** Limit results to one of these types */
  type?: Maybe<SearchType[]>;
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
  count?: Maybe<Scalars['Int']>;
  /** 1-indexed page number for offset pagination. */
  page?: Maybe<Scalars['Int']>;
  /** The field in which to sort on */
  sort?: Maybe<Scalars['String']>;
  /** The order in which to sort the list */
  order?: Maybe<Order>;
  filter?: Maybe<SongFilters>;
}

export interface SongFilters {
  /** Only songs matching this name */
  name?: Maybe<Scalars['String']>;
}

export interface Mutation {
  __typename?: 'Mutation';
  /** Create a new permission between a security group and a base node */
  createPermission: CreatePermissionOutput;
  /** Create a new security group */
  createSecurityGroup: CreateSecurityGroupOutput;
  /** Attach a user to a security group (without admin privileges) */
  attachUserToSecurityGroup: Scalars['Boolean'];
  /** Add a property to a security group */
  addPropertyToSecurityGroup: Scalars['Boolean'];
  /** Remove a permission from a security group */
  removePermissionFromSecurityGroup: Scalars['Boolean'];
  /** Remove a user from a security group */
  removeUserFromSecurityGroup: Scalars['Boolean'];
  /** Promote a user to become an admin of a security group */
  promoteUserToAdminOfSecurityGroup: Scalars['Boolean'];
  /** Promote a user to become an admin of a base node */
  promoteUserToAdminOfBaseNode: Scalars['Boolean'];
  /** Delete a security group */
  deleteSecurityGroup: Scalars['Boolean'];
  /** Update a security group's name */
  updateSecurityGroupName: UpdateSecurityGroupNameOutput;
  /** Create an organization */
  createOrganization: CreateOrganizationOutput;
  /** Update an organization */
  updateOrganization: UpdateOrganizationOutput;
  /** Delete an organization */
  deleteOrganization: Scalars['Boolean'];
  /** Create an education entry */
  createEducation: CreateEducationOutput;
  /** Update an education */
  updateEducation: UpdateEducationOutput;
  /** Delete an education */
  deleteEducation: Scalars['Boolean'];
  /** Create an unavailability */
  createUnavailability: CreateUnavailabilityOutput;
  /** Update an unavailability */
  updateUnavailability: UpdateUnavailabilityOutput;
  /** Delete an unavailability */
  deleteUnavailability: Scalars['Boolean'];
  /** Create a person */
  createPerson: CreatePersonOutput;
  /** Update a user */
  updateUser: UpdateUserOutput;
  /** Delete a user */
  deleteUser: Scalars['Boolean'];
  /** Assign organization OR primaryOrganization to user */
  assignOrganizationToUser: Scalars['Boolean'];
  /** Remove organization OR primaryOrganization from user */
  removeOrganizationFromUser: Scalars['Boolean'];
  /** Login a user */
  login: LoginOutput;
  /** Logout a user */
  logout: Scalars['Boolean'];
  /** Register a new user */
  register: RegisterOutput;
  /** Change your password */
  changePassword: Scalars['Boolean'];
  /** Forgot password; send password reset email */
  forgotPassword: Scalars['Boolean'];
  /** Reset Password */
  resetPassword: Scalars['Boolean'];
  /** Create a zone */
  createZone: CreateZoneOutput;
  /** Create a region */
  createRegion: CreateRegionOutput;
  /** Create a country */
  createCountry: CreateCountryOutput;
  /** Update a zone */
  updateZone: UpdateZoneOutput;
  /** Update a region */
  updateRegion: UpdateRegionOutput;
  /** Update a country */
  updateCountry: UpdateCountryOutput;
  /** Delete a location */
  deleteLocation: Scalars['Boolean'];
  createDirectory: Directory;
  /** Delete a file or directory */
  deleteFileNode: Scalars['Boolean'];
  /** Start the file upload process by requesting an upload */
  requestFileUpload: RequestUploadOutput;
  /**
   * Create a new file version.
   * This is always the second step after `requestFileUpload` mutation.
   * If the given parent is a file, this will attach the new version to it.
   * If the given parent is a directory, this will attach the new version to
   * the existing file with the same name or create a new file if not found.
   */
  createFileVersion: File;
  /** Rename a file or directory */
  renameFileNode: FileNode;
  /** Move a file or directory */
  moveFileNode: FileNode;
  /** Update a ceremony */
  updateCeremony: UpdateCeremonyOutput;
  /** Create a project member */
  createProjectMember: CreateProjectMemberOutput;
  /** Update a project member */
  updateProjectMember: UpdateProjectMemberOutput;
  /** Delete a project member */
  deleteProjectMember: Scalars['Boolean'];
  /** Create a Partnership entry */
  createPartnership: CreatePartnershipOutput;
  /** Update a Partnership */
  updatePartnership: UpdatePartnershipOutput;
  /** Delete a Partnership */
  deletePartnership: Scalars['Boolean'];
  /** Create a project */
  createProject: CreateProjectOutput;
  /** Update a project */
  updateProject: UpdateProjectOutput;
  /** Delete a project */
  deleteProject: Scalars['Boolean'];
  /** Create a language */
  createLanguage: CreateLanguageOutput;
  /** Update a language */
  updateLanguage: UpdateLanguageOutput;
  /** Delete a language */
  deleteLanguage: Scalars['Boolean'];
  /** Add a location to a language */
  addLocationToLanguage: Language;
  /** Remove a location from a language */
  removeLocationFromLanguage: Language;
  /** Create a film */
  createFilm: CreateFilmOutput;
  /** Update a film */
  updateFilm: UpdateFilmOutput;
  /** Delete a film */
  deleteFilm: Scalars['Boolean'];
  /** Create a literacy material */
  createLiteracyMaterial: CreateLiteracyMaterialOutput;
  /** Update a literacy material */
  updateLiteracyMaterial: UpdateLiteracyMaterialOutput;
  /** Delete a literacy material */
  deleteLiteracyMaterial: Scalars['Boolean'];
  /** Create a story */
  createStory: CreateStoryOutput;
  /** Update a story */
  updateStory: UpdateStoryOutput;
  /** Delete a story */
  deleteStory: Scalars['Boolean'];
  /** Create a product entry */
  createProduct: CreateProductOutput;
  /** Update a product entry */
  updateProduct: UpdateProductOutput;
  /** Delete a product entry */
  deleteProduct: Scalars['Boolean'];
  /** Create a language engagement */
  createLanguageEngagement: CreateLanguageEngagementOutput;
  /** Create an internship engagement */
  createInternshipEngagement: CreateInternshipEngagementOutput;
  /** Update a language engagement */
  updateLanguageEngagement: UpdateLanguageEngagementOutput;
  /** Update an internship engagement */
  updateInternshipEngagement: UpdateInternshipEngagementOutput;
  /** Delete an engagement */
  deleteEngagement: Scalars['Boolean'];
  /** Update a budgetRecord */
  updateBudgetRecord: UpdateBudgetRecordOutput;
  /** Create a budget */
  createBudget: CreateBudgetOutput;
  /** Update a budget */
  updateBudget: UpdateBudgetOutput;
  /** Delete an budget */
  deleteBudget: Scalars['Boolean'];
  /** add an favorite */
  addFavorite: Scalars['String'];
  /** Delete an favorite */
  removeFavorite: Scalars['Boolean'];
  /** Create a song */
  createSong: CreateSongOutput;
  /** Update a song */
  updateSong: UpdateSongOutput;
  /** Delete a song */
  deleteSong: Scalars['Boolean'];
  /** Create an Workflow */
  createWorkflow: CreateWorkflowOutput;
  /** Delete an Workflow */
  deleteWorkflow: Scalars['Boolean'];
  /** Add a State to a Workflow */
  addState: AddStateOutput;
  /** Update a State */
  updateState: AddStateOutput;
  /** Delete an State from Workflow */
  deleteState: Scalars['Boolean'];
  /** Attach securitygroup to state */
  attachSecurityGroup: Scalars['Boolean'];
  /** Remove security group from state */
  removeSecurityGroup: Scalars['Boolean'];
  /** Attach notification group to state */
  attachNotificationGroup: Scalars['Boolean'];
  /** Remove notification group to state */
  removeNotificationGroup: Scalars['Boolean'];
  /** Change current statee in workflow */
  changeCurrentState: Scalars['Boolean'];
  /** Add possible state to a state */
  addPossibleState: Scalars['Boolean'];
  /** Remove possible state to a state */
  removePossibleState: Scalars['Boolean'];
  /** Add a required field to a state */
  addRequiredField: Scalars['Boolean'];
  /** Remove a required field from state */
  removeRequiredField: Scalars['Boolean'];
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
  request: CreatePermission;
}

export interface CreatePermission {
  sgId: Scalars['ID'];
  baseNodeId: Scalars['ID'];
  propertyName: Scalars['String'];
  read: Scalars['Boolean'];
  write: Scalars['Boolean'];
}

export interface CreateSecurityGroupInput {
  request: CreateSecurityGroup;
}

export interface CreateSecurityGroup {
  name: Scalars['String'];
}

export interface AttachUserToSecurityGroupInput {
  request: AttachUserToSecurityGroup;
}

export interface AttachUserToSecurityGroup {
  sgId: Scalars['ID'];
  userId: Scalars['ID'];
}

export interface AddPropertyToSecurityGroupInput {
  request: AddPropertyToSecurityGroup;
}

export interface AddPropertyToSecurityGroup {
  sgId: Scalars['ID'];
  property: Scalars['String'];
}

export interface RemovePermissionFromSecurityGroupInput {
  request: RemovePermissionFromSecurityGroup;
}

export interface RemovePermissionFromSecurityGroup {
  id: Scalars['ID'];
  sgId: Scalars['ID'];
  baseNodeId: Scalars['ID'];
}

export interface RemoveUserFromSecurityGroupInput {
  request: RemoveUserFromSecurityGroup;
}

export interface RemoveUserFromSecurityGroup {
  sgId: Scalars['ID'];
  userId: Scalars['ID'];
}

export interface PromoteUserToAdminOfSecurityGroupInput {
  request: PromoteUserToAdminOfSecurityGroup;
}

export interface PromoteUserToAdminOfSecurityGroup {
  sgId: Scalars['ID'];
  userId: Scalars['ID'];
}

export interface PromoteUserToAdminOfBaseNodeInput {
  request: PromoteUserToAdminOfBaseNode;
}

export interface PromoteUserToAdminOfBaseNode {
  baseNodeId: Scalars['ID'];
  userId: Scalars['ID'];
}

export interface UpdateSecurityGroupNameInput {
  request: UpdateSecurityGroupName;
}

export interface UpdateSecurityGroupName {
  id: Scalars['ID'];
  name: Scalars['String'];
}

export interface CreateOrganizationInput {
  organization: CreateOrganization;
}

export interface CreateOrganization {
  name: Scalars['String'];
}

export interface UpdateOrganizationInput {
  organization: UpdateOrganization;
}

export interface UpdateOrganization {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
}

export interface CreateEducationInput {
  education: CreateEducation;
}

export interface CreateEducation {
  userId: Scalars['ID'];
  degree: Degree;
  major: Scalars['String'];
  institution: Scalars['String'];
}

export type Degree =
  | 'Primary'
  | 'Secondary'
  | 'Associates'
  | 'Bachelors'
  | 'Masters'
  | 'Doctorate';

export interface UpdateEducationInput {
  education: UpdateEducation;
}

export interface UpdateEducation {
  id: Scalars['ID'];
  degree?: Maybe<Degree>;
  major?: Maybe<Scalars['String']>;
  institution?: Maybe<Scalars['String']>;
}

export interface CreateUnavailabilityInput {
  unavailability: CreateUnavailability;
}

export interface CreateUnavailability {
  userId: Scalars['ID'];
  description: Scalars['String'];
  start: Scalars['DateTime'];
  end: Scalars['DateTime'];
}

export interface UpdateUnavailabilityInput {
  unavailability: UpdateUnavailability;
}

export interface UpdateUnavailability {
  id: Scalars['ID'];
  description?: Maybe<Scalars['String']>;
  start?: Maybe<Scalars['DateTime']>;
  end?: Maybe<Scalars['DateTime']>;
}

export interface CreatePersonInput {
  person: CreatePerson;
}

export interface CreatePerson {
  email: Scalars['String'];
  realFirstName: Scalars['String'];
  realLastName: Scalars['String'];
  displayFirstName: Scalars['String'];
  displayLastName: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  timezone?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  status?: Maybe<UserStatus>;
}

export interface UpdateUserInput {
  user: UpdateUser;
}

export interface UpdateUser {
  id: Scalars['ID'];
  email?: Maybe<Scalars['String']>;
  realFirstName?: Maybe<Scalars['String']>;
  realLastName?: Maybe<Scalars['String']>;
  displayFirstName?: Maybe<Scalars['String']>;
  displayLastName?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  timezone?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  status?: Maybe<UserStatus>;
}

export interface AssignOrganizationToUserInput {
  request: AssignOrganizationToUser;
}

export interface AssignOrganizationToUser {
  orgId: Scalars['ID'];
  userId: Scalars['ID'];
  primary?: Maybe<Scalars['Boolean']>;
}

export interface RemoveOrganizationFromUserInput {
  request: RemoveOrganizationFromUser;
}

export interface RemoveOrganizationFromUser {
  orgId: Scalars['ID'];
  userId: Scalars['ID'];
}

export interface LoginInput {
  email: Scalars['String'];
  password: Scalars['String'];
}

export interface RegisterInput {
  email: Scalars['String'];
  realFirstName: Scalars['String'];
  realLastName: Scalars['String'];
  displayFirstName: Scalars['String'];
  displayLastName: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  timezone?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  status?: Maybe<UserStatus>;
  password: Scalars['String'];
}

export interface ResetPasswordInput {
  token: Scalars['String'];
  password: Scalars['String'];
}

export interface CreateZoneInput {
  zone: CreateZone;
}

export interface CreateZone {
  name: Scalars['String'];
  /** A user ID that will be the director of the zone */
  directorId: Scalars['ID'];
}

export interface CreateRegionInput {
  region: CreateRegion;
}

export interface CreateRegion {
  name: Scalars['String'];
  /** The zone ID that the region will be associated with */
  zoneId: Scalars['ID'];
  /** A user ID that will be the director of the region */
  directorId: Scalars['ID'];
}

export interface CreateCountryInput {
  country: CreateCountry;
}

export interface CreateCountry {
  name: Scalars['String'];
  regionId: Scalars['ID'];
}

export interface UpdateZoneInput {
  zone: UpdateZone;
}

export interface UpdateZone {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  /** A user ID that will be the new director of the zone */
  directorId?: Maybe<Scalars['ID']>;
}

export interface UpdateRegionInput {
  region: UpdateRegion;
}

export interface UpdateRegion {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  /** The zone ID that the region will be associated with */
  zoneId?: Maybe<Scalars['ID']>;
  /** A user ID that will be the director of the region */
  directorId?: Maybe<Scalars['ID']>;
}

export interface UpdateCountryInput {
  country: UpdateCountry;
}

export interface UpdateCountry {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  regionId?: Maybe<Scalars['ID']>;
}

export interface CreateDirectoryInput {
  /** The ID for the parent directory */
  parentId: Scalars['ID'];
  /** The directory name */
  name: Scalars['String'];
}

export interface CreateFileVersionInput {
  /** The ID returned from the `requestFileUpload` mutation */
  uploadId: Scalars['ID'];
  /** The directory ID if creating a new file or the file ID if creating a new version */
  parentId: Scalars['ID'];
  /** The file name */
  name: Scalars['String'];
}

export interface RenameFileInput {
  /** The file node's ID */
  id: Scalars['ID'];
  /** The new name */
  name: Scalars['String'];
}

export interface MoveFileInput {
  /** The file or directory's ID */
  id: Scalars['ID'];
  /** The new parent ID */
  parentId: Scalars['ID'];
  /**
   * Optionally change the name as well.
   * Could be helpful for if the destination has a node with the same name.
   */
  name?: Maybe<Scalars['String']>;
}

export interface UpdateCeremonyInput {
  ceremony: UpdateCeremony;
}

export interface UpdateCeremony {
  id: Scalars['ID'];
  planned?: Maybe<Scalars['Boolean']>;
  estimatedDate?: Maybe<Scalars['Date']>;
  actualDate?: Maybe<Scalars['Date']>;
}

export interface CreateProjectMemberInput {
  projectMember: CreateProjectMember;
}

export interface CreateProjectMember {
  /** A user ID */
  userId: Scalars['ID'];
  /** A project ID */
  projectId: Scalars['ID'];
  roles?: Maybe<Role[]>;
}

export interface UpdateProjectMemberInput {
  projectMember: UpdateProjectMember;
}

export interface UpdateProjectMember {
  id: Scalars['ID'];
  roles?: Maybe<Role[]>;
}

export interface CreatePartnershipInput {
  partnership: CreatePartnership;
}

export interface CreatePartnership {
  organizationId: Scalars['ID'];
  projectId: Scalars['ID'];
  agreementStatus?: Maybe<PartnershipAgreementStatus>;
  /** The partner agreement */
  agreement?: Maybe<CreateDefinedFileVersionInput>;
  /** The MOU agreement */
  mou?: Maybe<CreateDefinedFileVersionInput>;
  mouStatus?: Maybe<PartnershipAgreementStatus>;
  mouStartOverride?: Maybe<Scalars['Date']>;
  mouEndOverride?: Maybe<Scalars['Date']>;
  types?: Maybe<PartnershipType[]>;
}

export interface CreateDefinedFileVersionInput {
  /** The ID returned from the `requestFileUpload` mutation */
  uploadId: Scalars['ID'];
  /** An optional name. Defaults to file name. */
  name: Scalars['String'];
}

export interface UpdatePartnershipInput {
  partnership: UpdatePartnership;
}

export interface UpdatePartnership {
  id: Scalars['ID'];
  agreementStatus?: Maybe<PartnershipAgreementStatus>;
  /** The partner agreement */
  agreement?: Maybe<CreateDefinedFileVersionInput>;
  /** The MOU agreement */
  mou?: Maybe<CreateDefinedFileVersionInput>;
  mouStatus?: Maybe<PartnershipAgreementStatus>;
  mouStartOverride?: Maybe<Scalars['Date']>;
  mouEndOverride?: Maybe<Scalars['Date']>;
  types?: Maybe<PartnershipType[]>;
}

export interface CreateProjectInput {
  project: CreateProject;
}

export interface CreateProject {
  name: Scalars['String'];
  type: ProjectType;
  /** A country ID */
  locationId?: Maybe<Scalars['ID']>;
  mouStart?: Maybe<Scalars['Date']>;
  mouEnd?: Maybe<Scalars['Date']>;
  estimatedSubmission?: Maybe<Scalars['Date']>;
}

export interface UpdateProjectInput {
  project: UpdateProject;
}

export interface UpdateProject {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  /** A country ID */
  locationId?: Maybe<Scalars['ID']>;
  mouStart?: Maybe<Scalars['Date']>;
  mouEnd?: Maybe<Scalars['Date']>;
  estimatedSubmission?: Maybe<Scalars['Date']>;
}

export interface CreateLanguageInput {
  language: CreateLanguage;
}

export interface CreateLanguage {
  name: Scalars['String'];
  displayName: Scalars['String'];
  displayNamePronunciation?: Maybe<Scalars['String']>;
  isDialect?: Maybe<Scalars['Boolean']>;
  ethnologue?: Maybe<CreateEthnologueLanguage>;
  populationOverride?: Maybe<Scalars['Int']>;
  registryOfDialectsCode?: Maybe<Scalars['String']>;
  leastOfThese?: Maybe<Scalars['Boolean']>;
  leastOfTheseReason?: Maybe<Scalars['String']>;
}

export interface CreateEthnologueLanguage {
  id?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  provisionalCode?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  population?: Maybe<Scalars['Int']>;
}

export interface UpdateLanguageInput {
  language: UpdateLanguage;
}

export interface UpdateLanguage {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  displayNamePronunciation?: Maybe<Scalars['String']>;
  isDialect?: Maybe<Scalars['Boolean']>;
  ethnologue?: Maybe<UpdateEthnologueLanguage>;
  populationOverride?: Maybe<Scalars['Int']>;
  registryOfDialectsCode?: Maybe<Scalars['String']>;
  leastOfThese?: Maybe<Scalars['Boolean']>;
  leastOfTheseReason?: Maybe<Scalars['String']>;
}

export interface UpdateEthnologueLanguage {
  id?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  provisionalCode?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  population?: Maybe<Scalars['Int']>;
}

export interface CreateFilmInput {
  film: CreateFilm;
}

export interface CreateFilm {
  name: Scalars['String'];
  scriptureReferences?: Maybe<ScriptureRangeInput[]>;
}

export interface ScriptureRangeInput {
  /** The starting verse */
  start: ScriptureReferenceInput;
  /** The ending verse */
  end: ScriptureReferenceInput;
}

/** A reference to a scripture verse */
export interface ScriptureReferenceInput {
  /** The code of the Bible book */
  book: Scalars['String'];
  /** The chapter number */
  chapter: Scalars['Int'];
  /** The verse number */
  verse: Scalars['Int'];
}

export interface UpdateFilmInput {
  film: UpdateFilm;
}

export interface UpdateFilm {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  scriptureReferences?: Maybe<ScriptureRangeInput[]>;
}

export interface CreateLiteracyMaterialInput {
  literacyMaterial: CreateLiteracyMaterial;
}

export interface CreateLiteracyMaterial {
  name: Scalars['String'];
  scriptureReferences?: Maybe<ScriptureRangeInput[]>;
}

export interface UpdateLiteracyMaterialInput {
  literacyMaterial: UpdateLiteracyMaterial;
}

export interface UpdateLiteracyMaterial {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  scriptureReferences?: Maybe<ScriptureRangeInput[]>;
}

export interface CreateStoryInput {
  story: CreateStory;
}

export interface CreateStory {
  name: Scalars['String'];
  scriptureReferences?: Maybe<ScriptureRangeInput[]>;
}

export interface UpdateStoryInput {
  story: UpdateStory;
}

export interface UpdateStory {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  scriptureReferences?: Maybe<ScriptureRangeInput[]>;
}

export interface CreateProductInput {
  product: CreateProduct;
}

export interface CreateProduct {
  /** An ID of a `LanguageEngagement` to create this product for */
  engagementId: Scalars['String'];
  /**
   * An ID of a `Producible` object, which will create a `DerivativeScriptureProduct`.
   * If omitted a `DirectScriptureProduct` will be created instead.
   */
  produces?: Maybe<Scalars['ID']>;
  /**
   * Change this list of `scriptureReferences` if provided.
   *
   * Note only `DirectScriptureProduct`s can use this field.
   */
  scriptureReferences?: Maybe<ScriptureRangeInput[]>;
  /**
   * The `Producible` defines a `scriptureReferences` list, and this is
   * used by default in this product's `scriptureReferences` list.
   * If this product _specifically_ needs to customize the references, then
   * this property can be set (and read) to "override" the `producible`'s list.
   *
   * Note only `DerivativeScriptureProduct`s can use this field.
   */
  scriptureReferencesOverride?: Maybe<ScriptureRangeInput[]>;
  mediums?: Maybe<ProductMedium[]>;
  purposes?: Maybe<ProductPurpose[]>;
  methodology?: Maybe<ProductMethodology>;
}

export interface UpdateProductInput {
  product: UpdateProduct;
}

export interface UpdateProduct {
  /**
   * Change this list of `scriptureReferences` if provided.
   *
   * Note only `DirectScriptureProduct`s can use this field.
   */
  scriptureReferences?: Maybe<ScriptureRangeInput[]>;
  /**
   * The `Producible` defines a `scriptureReferences` list, and this is
   * used by default in this product's `scriptureReferences` list.
   * If this product _specifically_ needs to customize the references, then
   * this property can be set (and read) to "override" the `producible`'s list.
   *
   * Note only `DerivativeScriptureProduct`s can use this field.
   */
  scriptureReferencesOverride?: Maybe<ScriptureRangeInput[]>;
  mediums?: Maybe<ProductMedium[]>;
  purposes?: Maybe<ProductPurpose[]>;
  methodology?: Maybe<ProductMethodology>;
  id: Scalars['ID'];
  /**
   * An ID of a `Producible` object to change.
   *
   * Note only `DerivativeScriptureProduct`s can use this field.
   */
  produces?: Maybe<Scalars['ID']>;
}

export interface CreateLanguageEngagementInput {
  engagement: CreateLanguageEngagement;
}

export interface CreateLanguageEngagement {
  projectId: Scalars['ID'];
  completeDate?: Maybe<Scalars['Date']>;
  disbursementCompleteDate?: Maybe<Scalars['Date']>;
  communicationsCompleteDate?: Maybe<Scalars['Date']>;
  startDate?: Maybe<Scalars['Date']>;
  endDate?: Maybe<Scalars['Date']>;
  languageId: Scalars['ID'];
  firstScripture?: Maybe<Scalars['Boolean']>;
  lukePartnership?: Maybe<Scalars['Boolean']>;
  paraTextRegistryId?: Maybe<Scalars['String']>;
  pnp?: Maybe<CreateDefinedFileVersionInput>;
}

export interface CreateInternshipEngagementInput {
  engagement: CreateInternshipEngagement;
}

export interface CreateInternshipEngagement {
  projectId: Scalars['ID'];
  completeDate?: Maybe<Scalars['Date']>;
  disbursementCompleteDate?: Maybe<Scalars['Date']>;
  communicationsCompleteDate?: Maybe<Scalars['Date']>;
  startDate?: Maybe<Scalars['Date']>;
  endDate?: Maybe<Scalars['Date']>;
  internId: Scalars['ID'];
  mentorId?: Maybe<Scalars['ID']>;
  countryOfOriginId?: Maybe<Scalars['ID']>;
  position?: Maybe<InternshipEngagementPosition>;
  methodologies?: Maybe<ProductMethodology[]>;
  growthPlan?: Maybe<CreateDefinedFileVersionInput>;
}

export interface UpdateLanguageEngagementInput {
  engagement: UpdateLanguageEngagement;
}

export interface UpdateLanguageEngagement {
  id: Scalars['ID'];
  completeDate?: Maybe<Scalars['Date']>;
  disbursementCompleteDate?: Maybe<Scalars['Date']>;
  communicationsCompleteDate?: Maybe<Scalars['Date']>;
  startDate?: Maybe<Scalars['Date']>;
  endDate?: Maybe<Scalars['Date']>;
  firstScripture?: Maybe<Scalars['Boolean']>;
  lukePartnership?: Maybe<Scalars['Boolean']>;
  paraTextRegistryId?: Maybe<Scalars['String']>;
  pnp?: Maybe<CreateDefinedFileVersionInput>;
}

export interface UpdateInternshipEngagementInput {
  engagement: UpdateInternshipEngagement;
}

export interface UpdateInternshipEngagement {
  id: Scalars['ID'];
  completeDate?: Maybe<Scalars['Date']>;
  disbursementCompleteDate?: Maybe<Scalars['Date']>;
  communicationsCompleteDate?: Maybe<Scalars['Date']>;
  startDate?: Maybe<Scalars['Date']>;
  endDate?: Maybe<Scalars['Date']>;
  mentorId?: Maybe<Scalars['ID']>;
  countryOfOriginId?: Maybe<Scalars['ID']>;
  position?: Maybe<InternshipEngagementPosition>;
  methodologies?: Maybe<ProductMethodology[]>;
  growthPlan?: Maybe<CreateDefinedFileVersionInput>;
}

export interface UpdateBudgetRecordInput {
  budgetRecord: UpdateBudgetRecord;
}

export interface UpdateBudgetRecord {
  id: Scalars['ID'];
  amount: Scalars['Int'];
}

export interface CreateBudgetInput {
  budget: CreateBudget;
}

export interface CreateBudget {
  projectId: Scalars['ID'];
}

export interface UpdateBudgetInput {
  budget: UpdateBudget;
}

export interface UpdateBudget {
  id: Scalars['ID'];
  status: BudgetStatus;
}

export type BudgetStatus = 'Pending' | 'Current' | 'Superceded' | 'Rejected';

export interface AddFavoriteInput {
  favorite: AddFavorite;
}

export interface AddFavorite {
  baseNodeId: Scalars['String'];
}

export interface CreateSongInput {
  song: CreateSong;
}

export interface CreateSong {
  name: Scalars['String'];
  scriptureReferences?: Maybe<ScriptureRangeInput[]>;
}

export interface UpdateSongInput {
  song: UpdateSong;
}

export interface UpdateSong {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  scriptureReferences?: Maybe<ScriptureRangeInput[]>;
}

export interface CreateWorkflowInput {
  workflow: CreateWorkflow;
}

export interface CreateWorkflow {
  baseNodeId: Scalars['ID'];
  startingStateName: Scalars['String'];
  stateIdentifier: Scalars['String'];
}

export interface AddStateInput {
  state: AddState;
}

export interface AddState {
  workflowId: Scalars['ID'];
  stateName: Scalars['String'];
}

export interface UpdateStateInput {
  state: UpdateState;
}

export interface UpdateState {
  stateId: Scalars['ID'];
  workflowId: Scalars['ID'];
  stateName: Scalars['String'];
}

export interface GroupStateInput {
  groupState: GroupState;
}

export interface GroupState {
  stateId: Scalars['ID'];
  securityGroupId: Scalars['ID'];
}

export interface ChangeCurrentStateInput {
  state: ChangeCurrentState;
}

export interface ChangeCurrentState {
  newStateId: Scalars['ID'];
  workflowId: Scalars['ID'];
}

export interface PossibleStateInput {
  state: PossibleState;
}

export interface PossibleState {
  fromStateId: Scalars['ID'];
  toStateId: Scalars['ID'];
}

export interface RequiredFieldInput {
  field: RequiredField;
}

export interface RequiredField {
  stateId: Scalars['ID'];
  propertyName: Scalars['String'];
}
