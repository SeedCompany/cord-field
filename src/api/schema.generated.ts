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
  /**
   * An ISO-8601 date string.
   * Time should be ignored for this field.
   */
  Date: CalendarDate;
  /** An ISO-8601 date time string */
  DateTime: DateTime;
}

export interface AddFavorite {
  baseNodeId: Scalars['String'];
}

export interface AddFavoriteInput {
  favorite: AddFavorite;
}

export interface AddPropertyToSecurityGroup {
  sgId: Scalars['ID'];
  property: Scalars['String'];
}

export interface AddPropertyToSecurityGroupInput {
  request: AddPropertyToSecurityGroup;
}

export interface AddState {
  workflowId: Scalars['ID'];
  stateName: Scalars['String'];
}

export interface AddStateInput {
  state: AddState;
}

export interface AddStateOutput {
  __typename?: 'AddStateOutput';
  state: State;
}

export interface AssignOrganizationToUser {
  orgId: Scalars['ID'];
  userId: Scalars['ID'];
  primary?: Maybe<Scalars['Boolean']>;
}

export interface AssignOrganizationToUserInput {
  request: AssignOrganizationToUser;
}

export interface AttachUserToSecurityGroup {
  sgId: Scalars['ID'];
  userId: Scalars['ID'];
}

export interface AttachUserToSecurityGroupInput {
  request: AttachUserToSecurityGroup;
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

export type BibleBook =
  | 'Genesis'
  | 'Exodus'
  | 'Leviticus'
  | 'Numbers'
  | 'Deuteronomy'
  | 'Joshua'
  | 'Judges'
  | 'Ruth'
  | 'FirstSamuel'
  | 'SecondSamuel'
  | 'FirstKings'
  | 'SecondKings'
  | 'FirstChronicles'
  | 'SecondChronicles'
  | 'Ezra'
  | 'Nehemiah'
  | 'Esther'
  | 'Job'
  | 'Psalms'
  | 'Proverbs'
  | 'Ecclesiastes'
  | 'SongOfSolomon'
  | 'Isaiah'
  | 'Jeremiah'
  | 'Lamentations'
  | 'Ezekiel'
  | 'Daniel'
  | 'Hosea'
  | 'Joel'
  | 'Amos'
  | 'Obadiah'
  | 'Jonah'
  | 'Micah'
  | 'Nahum'
  | 'Habakkuk'
  | 'Zephaniah'
  | 'Haggai'
  | 'Zechariah'
  | 'Malachi'
  | 'Matthew'
  | 'Mark'
  | 'Luke'
  | 'John'
  | 'Acts'
  | 'Romans'
  | 'FirstCorinthians'
  | 'SecondCorinthians'
  | 'Galatians'
  | 'Ephesians'
  | 'Philippians'
  | 'Colossians'
  | 'FirstThessalonians'
  | 'SecondThessalonians'
  | 'FirstTimothy'
  | 'SecondTimothy'
  | 'Titus'
  | 'Philemon'
  | 'Hebrews'
  | 'James'
  | 'FirstPeter'
  | 'SecondPeter'
  | 'FirstJohn'
  | 'SecondJohn'
  | 'ThirdJohn'
  | 'Jude'
  | 'Revelation';

export type Budget = Resource & {
  __typename?: 'Budget';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  status: Scalars['String'];
  records: BudgetRecord[];
  total: Scalars['Int'];
};

export interface BudgetFilters {
  /** Only budgets matching this projectId */
  projectId?: Maybe<Scalars['ID']>;
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

export type BudgetRecord = Resource & {
  __typename?: 'BudgetRecord';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  fiscalYear: SecuredInt;
  amount: SecuredInt;
  organization: SecuredOrganization;
};

export type BudgetStatus = 'Pending' | 'Current' | 'Superceded' | 'Rejected';

export type Ceremony = Resource & {
  __typename?: 'Ceremony';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  type: CeremonyType;
  planned: SecuredBoolean;
  estimatedDate: SecuredDate;
  actualDate: SecuredDate;
};

export interface CeremonyFilters {
  /** Only ceremonies of this type */
  type?: Maybe<CeremonyType>;
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

export type CeremonyType = 'Dedication' | 'Certification';

export interface ChangeCurrentState {
  newStateId: Scalars['ID'];
  workflowId: Scalars['ID'];
}

export interface ChangeCurrentStateInput {
  state: ChangeCurrentState;
}

export type Country = Resource &
  Place & {
    __typename?: 'Country';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    name: SecuredString;
    region: SecuredRegion;
  };

export interface CreateBudget {
  projectId: Scalars['ID'];
}

export interface CreateBudgetInput {
  budget: CreateBudget;
}

export interface CreateBudgetOutput {
  __typename?: 'CreateBudgetOutput';
  budget: Budget;
}

export interface CreateCountry {
  name: Scalars['String'];
  regionId: Scalars['ID'];
}

export interface CreateCountryInput {
  country: CreateCountry;
}

export interface CreateCountryOutput {
  __typename?: 'CreateCountryOutput';
  country: Country;
}

export interface CreateDefinedFileVersionInput {
  /** The ID returned from the `requestFileUpload` mutation */
  uploadId: Scalars['ID'];
  /** An optional name. Defaults to file name. */
  name: Scalars['String'];
}

export interface CreateDirectoryInput {
  /** The ID for the parent directory */
  parentId: Scalars['ID'];
  /** The directory name */
  name: Scalars['String'];
}

export interface CreateEducation {
  userId: Scalars['ID'];
  degree: Degree;
  major: Scalars['String'];
  institution: Scalars['String'];
}

export interface CreateEducationInput {
  education: CreateEducation;
}

export interface CreateEducationOutput {
  __typename?: 'CreateEducationOutput';
  education: Education;
}

export interface CreateFileVersionInput {
  /** The ID returned from the `requestFileUpload` mutation */
  uploadId: Scalars['ID'];
  /** The directory ID if creating a new file or the file ID if creating a new version */
  parentId: Scalars['ID'];
  /** The file name */
  name: Scalars['String'];
}

export interface CreateFilm {
  name: Scalars['String'];
  ranges?: Maybe<CreateRange[]>;
}

export interface CreateFilmInput {
  film: CreateFilm;
}

export interface CreateFilmOutput {
  __typename?: 'CreateFilmOutput';
  film: Film;
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
}

export interface CreateInternshipEngagementInput {
  engagement: CreateInternshipEngagement;
}

export interface CreateInternshipEngagementOutput {
  __typename?: 'CreateInternshipEngagementOutput';
  engagement: InternshipEngagement;
}

export interface CreateLanguage {
  name: Scalars['String'];
  displayName: Scalars['String'];
  beginFiscalYear?: Maybe<Scalars['Int']>;
  ethnologueName?: Maybe<Scalars['String']>;
  ethnologuePopulation?: Maybe<Scalars['Int']>;
  organizationPopulation?: Maybe<Scalars['Int']>;
  rodNumber?: Maybe<Scalars['Int']>;
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
}

export interface CreateLanguageEngagementInput {
  engagement: CreateLanguageEngagement;
}

export interface CreateLanguageEngagementOutput {
  __typename?: 'CreateLanguageEngagementOutput';
  engagement: LanguageEngagement;
}

export interface CreateLanguageInput {
  language: CreateLanguage;
}

export interface CreateLanguageOutput {
  __typename?: 'CreateLanguageOutput';
  language: Language;
}

export interface CreateLiteracyMaterial {
  name: Scalars['String'];
  ranges?: Maybe<CreateRange[]>;
}

export interface CreateLiteracyMaterialInput {
  literacyMaterial: CreateLiteracyMaterial;
}

export interface CreateLiteracyMaterialOutput {
  __typename?: 'CreateLiteracyMaterialOutput';
  literacyMaterial: LiteracyMaterial;
}

export interface CreateOrganization {
  name: Scalars['String'];
}

export interface CreateOrganizationInput {
  organization: CreateOrganization;
}

export interface CreateOrganizationOutput {
  __typename?: 'CreateOrganizationOutput';
  organization: Organization;
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
  mouStart?: Maybe<Scalars['Date']>;
  mouEnd?: Maybe<Scalars['Date']>;
  types?: Maybe<PartnershipType[]>;
}

export interface CreatePartnershipInput {
  partnership: CreatePartnership;
}

export interface CreatePartnershipOutput {
  __typename?: 'CreatePartnershipOutput';
  partnership: Partnership;
}

export interface CreatePermission {
  sgId: Scalars['ID'];
  baseNodeId: Scalars['ID'];
  propertyName: Scalars['String'];
  read: Scalars['Boolean'];
  write: Scalars['Boolean'];
}

export interface CreatePermissionInput {
  request: CreatePermission;
}

export interface CreatePermissionOutput {
  __typename?: 'CreatePermissionOutput';
  success: Scalars['Boolean'];
  id?: Maybe<Scalars['ID']>;
}

export interface CreateProduct {
  type: ProductType;
  books: BibleBook[];
  mediums: ProductMedium[];
  purposes: ProductPurpose[];
  methodology: ProductMethodology;
}

export interface CreateProductInput {
  product: CreateProduct;
}

export interface CreateProductOutput {
  __typename?: 'CreateProductOutput';
  product: Product;
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

export interface CreateProjectInput {
  project: CreateProject;
}

export interface CreateProjectMember {
  /** A user ID */
  userId: Scalars['ID'];
  /** A project ID */
  projectId: Scalars['ID'];
  roles?: Maybe<Role[]>;
}

export interface CreateProjectMemberInput {
  projectMember: CreateProjectMember;
}

export interface CreateProjectMemberOutput {
  __typename?: 'CreateProjectMemberOutput';
  projectMember: ProjectMember;
}

export interface CreateProjectOutput {
  __typename?: 'CreateProjectOutput';
  project: Project;
}

export interface CreateRange {
  start: Scalars['Float'];
  end: Scalars['Float'];
}

export interface CreateRegion {
  name: Scalars['String'];
  /** The zone ID that the region will be associated with */
  zoneId: Scalars['ID'];
  /** A user ID that will be the director of the region */
  directorId: Scalars['ID'];
}

export interface CreateRegionInput {
  region: CreateRegion;
}

export interface CreateRegionOutput {
  __typename?: 'CreateRegionOutput';
  region: Region;
}

export interface CreateSecurityGroup {
  name: Scalars['String'];
}

export interface CreateSecurityGroupInput {
  request: CreateSecurityGroup;
}

export interface CreateSecurityGroupOutput {
  __typename?: 'CreateSecurityGroupOutput';
  success: Scalars['Boolean'];
  id?: Maybe<Scalars['ID']>;
}

export interface CreateStory {
  name: Scalars['String'];
  ranges?: Maybe<CreateRange[]>;
}

export interface CreateStoryInput {
  story: CreateStory;
}

export interface CreateStoryOutput {
  __typename?: 'CreateStoryOutput';
  story: Story;
}

export interface CreateUnavailability {
  userId: Scalars['ID'];
  description: Scalars['String'];
  start: Scalars['DateTime'];
  end: Scalars['DateTime'];
}

export interface CreateUnavailabilityInput {
  unavailability: CreateUnavailability;
}

export interface CreateUnavailabilityOutput {
  __typename?: 'CreateUnavailabilityOutput';
  unavailability: Unavailability;
}

export interface CreateUser {
  email: Scalars['String'];
  realFirstName: Scalars['String'];
  realLastName: Scalars['String'];
  displayFirstName: Scalars['String'];
  displayLastName: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  timezone?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  status?: Maybe<UserStatus>;
}

export interface CreateUserInput {
  user: CreateUser;
}

export interface CreateUserOutput {
  __typename?: 'CreateUserOutput';
  user: User;
}

export interface CreateWorkflow {
  baseNodeId: Scalars['ID'];
  startingStateName: Scalars['String'];
  stateIdentifier: Scalars['String'];
}

export interface CreateWorkflowInput {
  workflow: CreateWorkflow;
}

export interface CreateWorkflowOutput {
  __typename?: 'CreateWorkflowOutput';
  workflow: Workflow;
}

export interface CreateZone {
  name: Scalars['String'];
  /** A user ID that will be the director of the zone */
  directorId: Scalars['ID'];
}

export interface CreateZoneInput {
  zone: CreateZone;
}

export interface CreateZoneOutput {
  __typename?: 'CreateZoneOutput';
  zone: Zone;
}

/** A filter range designed for date time fields */
export interface DateTimeFilter {
  /** After or equal to this time */
  after?: Maybe<Scalars['DateTime']>;
  /** Before or equal to this time */
  before?: Maybe<Scalars['DateTime']>;
}

export type Degree =
  | 'Primary'
  | 'Secondary'
  | 'Associates'
  | 'Bachelors'
  | 'Masters'
  | 'Doctorate';

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
     * A list of the parents all the way up the tree.
     * This can be used to populate a path-like UI,
     * without having to fetch each parent serially.
     */
    parents: FileNode[];
    /** The user who created this directory */
    createdBy: User;
    /** Return the file nodes of this directory */
    children: FileListOutput;
  };

export interface DirectoryChildrenArgs {
  input?: Maybe<FileListInput>;
}

/** Entities that are editable */
export interface Editable {
  /** Whether the current user can edit this object */
  canEdit: Scalars['Boolean'];
}

export type Education = Resource & {
  __typename?: 'Education';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  degree: SecuredDegree;
  major: SecuredString;
  institution: SecuredString;
};

export interface EducationFilters {
  /** Educations for UserId */
  userId?: Maybe<Scalars['ID']>;
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

export interface Engagement {
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  status: EngagementStatus;
  ceremony: SecuredCeremony;
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
}

export interface EngagementConsistencyInput {
  /** engagement type */
  baseNode: Scalars['String'];
}

export interface EngagementFilters {
  /** Only engagements matching this type */
  type?: Maybe<Scalars['String']>;
  /** Only engagements matching this name */
  name?: Maybe<Scalars['String']>;
  /** Only engagements matching this projectId */
  projectId?: Maybe<Scalars['ID']>;
}

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

export type Favorite = Resource & {
  __typename?: 'Favorite';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  baseNodeId: Scalars['String'];
};

export interface FavoriteFilters {
  /** Only items matching this node */
  baseNode?: Maybe<BaseNode>;
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

export interface FieldObject {
  __typename?: 'FieldObject';
  value: Scalars['String'];
}

export type File = FileNode &
  Resource & {
    __typename?: 'File';
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
     * A list of the parents all the way up the tree.
     * This can be used to populate a path-like UI,
     * without having to fetch each parent serially.
     */
    parents: FileNode[];
    /** The user who uploaded the first version of this file */
    createdBy: User;
    mimeType: Scalars['String'];
    size: Scalars['Int'];
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

export interface FileFilters {
  /** Only file nodes matching this name */
  name?: Maybe<Scalars['String']>;
  /** Only file nodes matching this type */
  type?: Maybe<FileNodeType>;
  /** Only file nodes matching these categories */
  category?: Maybe<FileNodeCategory[]>;
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
   * A list of the parents all the way up the tree.
   * This can be used to populate a path-like UI,
   * without having to fetch each parent serially.
   */
  parents: FileNode[];
  /** The user who created this node */
  createdBy: User;
}

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

/** The type of node in the file tree. A file, directory or file version. */
export type FileNodeType = 'Directory' | 'File' | 'FileVersion';

export type FileVersion = FileNode &
  Resource & {
    __typename?: 'FileVersion';
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
     * A list of the parents all the way up the tree.
     * This can be used to populate a path-like UI,
     * without having to fetch each parent serially.
     */
    parents: FileNode[];
    /** The user who created this file version */
    createdBy: User;
    mimeType: Scalars['String'];
    size: Scalars['Int'];
    /** A direct url to download the file version */
    downloadUrl: Scalars['String'];
  };

export type Film = Resource & {
  __typename?: 'Film';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  name: SecuredString;
  ranges?: Maybe<SecuredRange>;
};

export interface FilmFilters {
  /** Only Film matching this name */
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

export interface GroupState {
  stateId: Scalars['ID'];
  securityGroupId: Scalars['ID'];
}

export interface GroupStateInput {
  groupState: GroupState;
}

export type InternshipEngagement = Engagement &
  Resource & {
    __typename?: 'InternshipEngagement';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    status: EngagementStatus;
    ceremony: SecuredCeremony;
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
    countryOfOrigin: SecuredCountry;
    intern: SecuredUser;
    mentor: SecuredUser;
    position: SecuredInternPosition;
    methodologies: SecuredMethodologies;
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
    /** The project members */
    team: SecuredProjectMemberList;
    engagements: SecuredEngagementList;
    /** The project's current budget */
    budget: SecuredBudget;
    partnerships: SecuredPartnershipList;
    /** The root filesystem directory of this project */
    rootDirectory: Directory;
  };

export interface InternshipProjectTeamArgs {
  input?: Maybe<ProjectMemberListInput>;
}

export interface InternshipProjectEngagementsArgs {
  input?: Maybe<EngagementListInput>;
}

export interface InternshipProjectPartnershipsArgs {
  input?: Maybe<PartnershipListInput>;
}

export type Language = Resource & {
  __typename?: 'Language';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  name: SecuredString;
  displayName: SecuredString;
  beginFiscalYear?: Maybe<SecuredInt>;
  ethnologueName?: Maybe<SecuredString>;
  ethnologuePopulation?: Maybe<SecuredInt>;
  organizationPopulation?: Maybe<SecuredInt>;
  rodNumber?: Maybe<SecuredInt>;
  sensitivity?: Maybe<Sensitivity>;
  avatarLetters?: Maybe<Scalars['String']>;
};

export type LanguageEngagement = Engagement &
  Resource & {
    __typename?: 'LanguageEngagement';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    status: EngagementStatus;
    ceremony: SecuredCeremony;
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
    language: SecuredLanguage;
    firstScripture: SecuredBoolean;
    lukePartnership: SecuredBoolean;
    /** Not used anymore, but exposing for legacy data. */
    sentPrintingDate: SecuredDate;
    products: SecuredProductList;
  };

export interface LanguageEngagementProductsArgs {
  input?: Maybe<ProductListInput>;
}

export interface LanguageFilters {
  /** Only languages matching this name */
  name?: Maybe<Scalars['String']>;
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

export interface ListPermissionInput {
  sgId: Scalars['ID'];
}

export interface ListPermissionOutput {
  __typename?: 'ListPermissionOutput';
  items: Permission[];
}

export interface ListSecurityGroupInput {
  userId: Scalars['ID'];
}

export interface ListSecurityGroupOutput {
  __typename?: 'ListSecurityGroupOutput';
  items: SecurityGroup[];
}

export type LiteracyMaterial = Resource & {
  __typename?: 'LiteracyMaterial';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  name: SecuredString;
  ranges?: Maybe<SecuredLiteracyMaterialRange>;
};

export interface LiteracyMaterialFilters {
  /** Only literacy material matching this name */
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

export type Location = Country | Region | Zone;

export interface LocationFilters {
  /** Only locations matching this name */
  name?: Maybe<Scalars['String']>;
  /** Filter to only these types of locations */
  types: Array<Scalars['String']>;
  /** User IDs ANY of which must be directors of the locations */
  userIds?: Maybe<Array<Scalars['ID']>>;
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

export interface LoginInput {
  email: Scalars['String'];
  password: Scalars['String'];
}

export interface LoginOutput {
  __typename?: 'LoginOutput';
  /** The logged-in user */
  user: User;
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
  /** Login a user */
  login: LoginOutput;
  /** Logout a user */
  logout: Scalars['Boolean'];
  /** Forgot password; send password reset email */
  forgotPassword: Scalars['Boolean'];
  /** Reset Password */
  resetPassword: Scalars['Boolean'];
  /** Create a user */
  createUser: CreateUserOutput;
  /** Update a user */
  updateUser: UpdateUserOutput;
  /** Delete a user */
  deleteUser: Scalars['Boolean'];
  /** Assign organization OR primaryOrganization to user */
  assignOrganizationToUser: Scalars['Boolean'];
  /** Remove organization OR primaryOrganization from user */
  removeOrganizationFromUser: Scalars['Boolean'];
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
  /** Create a Partnership entry */
  createPartnership: CreatePartnershipOutput;
  /** Update a Partnership */
  updatePartnership: UpdatePartnershipOutput;
  /** Delete a Partnership */
  deletePartnership: Scalars['Boolean'];
  /** Update a budgetRecord */
  updateBudgetRecord: UpdateBudgetRecordOutput;
  /** Update a budget */
  updateBudget: UpdateBudgetOutput;
  /** Delete an budget */
  deleteBudget: Scalars['Boolean'];
  /** Update a ceremony */
  updateCeremony: UpdateCeremonyOutput;
  /** Create a language */
  createLanguage: CreateLanguageOutput;
  /** Update a language */
  updateLanguage: UpdateLanguageOutput;
  /** Delete a language */
  deleteLanguage: Scalars['Boolean'];
  /** Create an film */
  createFilm: CreateFilmOutput;
  /** Update an film */
  updateFilm: UpdateFilmOutput;
  /** Delete an film */
  deleteFilm: Scalars['Boolean'];
  /** Create an literacy material */
  createLiteracyMaterial: CreateLiteracyMaterialOutput;
  /** Update an literacyMaterial */
  updateLiteracyMaterial: UpdateLiteracyMaterialOutput;
  /** Delete an literacyMaterial */
  deleteLiteracyMaterial: Scalars['Boolean'];
  /** Create a product entry */
  createProduct: CreateProductOutput;
  /** Update a product entry */
  updateProduct: UpdateProductOutput;
  /** Delete a product entry */
  deleteProduct: Scalars['Boolean'];
  /** Create an story */
  createStory: CreateStoryOutput;
  /** Update an story */
  updateStory: UpdateStoryOutput;
  /** Delete an story */
  deleteStory: Scalars['Boolean'];
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
  /** add an favorite */
  addFavorite: Scalars['String'];
  /** Delete an favorite */
  removeFavorite: Scalars['Boolean'];
  /** Create a project member */
  createProjectMember: CreateProjectMemberOutput;
  /** Update a project member */
  updateProjectMember: UpdateProjectMemberOutput;
  /** Delete a project member */
  deleteProjectMember: Scalars['Boolean'];
  /** Create a project */
  createProject: CreateProjectOutput;
  /** Update a project */
  updateProject: UpdateProjectOutput;
  /** Delete a project */
  deleteProject: Scalars['Boolean'];
  /** Create an budget entry */
  createBudget: CreateBudgetOutput;
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

export interface MutationLoginArgs {
  input: LoginInput;
}

export interface MutationForgotPasswordArgs {
  email: Scalars['String'];
}

export interface MutationResetPasswordArgs {
  input: ResetPasswordInput;
}

export interface MutationCreateUserArgs {
  input: CreateUserInput;
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

export interface MutationCreatePartnershipArgs {
  input: CreatePartnershipInput;
}

export interface MutationUpdatePartnershipArgs {
  input: UpdatePartnershipInput;
}

export interface MutationDeletePartnershipArgs {
  id: Scalars['ID'];
}

export interface MutationUpdateBudgetRecordArgs {
  input: UpdateBudgetRecordInput;
}

export interface MutationUpdateBudgetArgs {
  input: UpdateBudgetInput;
}

export interface MutationDeleteBudgetArgs {
  id: Scalars['ID'];
}

export interface MutationUpdateCeremonyArgs {
  input: UpdateCeremonyInput;
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

export interface MutationCreateProductArgs {
  input: CreateProductInput;
}

export interface MutationUpdateProductArgs {
  input: UpdateProductInput;
}

export interface MutationDeleteProductArgs {
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

export interface MutationAddFavoriteArgs {
  input: AddFavoriteInput;
}

export interface MutationRemoveFavoriteArgs {
  id: Scalars['ID'];
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

export interface MutationCreateProjectArgs {
  input: CreateProjectInput;
}

export interface MutationUpdateProjectArgs {
  input: UpdateProjectInput;
}

export interface MutationDeleteProjectArgs {
  id: Scalars['ID'];
}

export interface MutationCreateBudgetArgs {
  input: CreateBudgetInput;
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

/** A sort order either ascending or descending */
export type Order = 'ASC' | 'DESC';

export type Organization = Resource & {
  __typename?: 'Organization';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  name: SecuredString;
  avatarLetters?: Maybe<Scalars['String']>;
};

export interface OrganizationFilters {
  /** Only organizations matching this name */
  name?: Maybe<Scalars['String']>;
  /** User IDs ANY of which must belong to the organizations */
  userId?: Maybe<Array<Scalars['ID']>>;
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

export type Partnership = Resource & {
  __typename?: 'Partnership';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  agreementStatus: SecuredPartnershipAgreementStatus;
  mouStatus: SecuredPartnershipAgreementStatus;
  mouStart: SecuredDate;
  mouEnd: SecuredDate;
  organization: Organization;
  types: SecuredPartnershipTypes;
  /** The MOU agreement */
  mou: SecuredFile;
  /** The partner agreement */
  agreement: SecuredFile;
};

export type PartnershipAgreementStatus =
  | 'NotAttached'
  | 'AwaitingSignature'
  | 'Signed';

export interface PartnershipFilters {
  /** Only partnerships matching this agreement status */
  agreementStatus?: Maybe<PartnershipAgreementStatus>;
  /** Find all partnerships in a project */
  projectId?: Maybe<Scalars['ID']>;
}

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

export type PartnershipType =
  | 'Managing'
  | 'Funding'
  | 'Impact'
  | 'Technical'
  | 'Resource';

export interface Permission {
  __typename?: 'Permission';
  id: Scalars['ID'];
  property: Scalars['String'];
  read: Scalars['Boolean'];
  write: Scalars['Boolean'];
}

export interface Place {
  name: SecuredString;
}

export interface PossibleState {
  fromStateId: Scalars['ID'];
  toStateId: Scalars['ID'];
}

export interface PossibleStateInput {
  state: PossibleState;
}

export type Product = Resource & {
  __typename?: 'Product';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  type: ProductType;
  books: BibleBook[];
  mediums: ProductMedium[];
  purposes: ProductPurpose[];
  approach: ProductApproach;
  methodology: ProductMethodology;
};

/** This is a roll up of methodology, for easier querying */
export type ProductApproach =
  | 'Written'
  | 'OralTranslation'
  | 'OralStories'
  | 'Visual';

export interface ProductFilters {
  /** Only products matching this type */
  type?: Maybe<ProductType>;
  /** Only products matching this approach */
  approach?: Maybe<ProductApproach>;
  /** Only products matching this methodology */
  methodology?: Maybe<ProductMethodology>;
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

export type ProductPurpose =
  | 'EvangelismChurchPlanting'
  | 'ChurchLife'
  | 'ChurchMaturity'
  | 'SocialIssues'
  | 'Discipleship';

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
  /** The project members */
  team: SecuredProjectMemberList;
  engagements: SecuredEngagementList;
  budget: SecuredBudget;
  partnerships: SecuredPartnershipList;
  rootDirectory: Directory;
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
  /** User IDs ANY of which are team members */
  userIds?: Maybe<Array<Scalars['ID']>>;
  /** only mine */
  mine?: Maybe<Scalars['Boolean']>;
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

export type ProjectMember = Resource & {
  __typename?: 'ProjectMember';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  user: SecuredUser;
  roles: SecuredRoles;
  modifiedAt: Scalars['DateTime'];
};

export interface ProjectMemberFilters {
  /** Only members with these roles */
  roles?: Maybe<Role[]>;
  /** Only members of this project */
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

/** A alias for a group of project steps */
export type ProjectStatus =
  | 'InDevelopment'
  | 'Pending'
  | 'Active'
  | 'Stopped'
  | 'Finished';

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

export type ProjectType = 'Translation' | 'Internship';

export interface PromoteUserToAdminOfBaseNode {
  baseNodeId: Scalars['ID'];
  userId: Scalars['ID'];
}

export interface PromoteUserToAdminOfBaseNodeInput {
  request: PromoteUserToAdminOfBaseNode;
}

export interface PromoteUserToAdminOfSecurityGroup {
  sgId: Scalars['ID'];
  userId: Scalars['ID'];
}

export interface PromoteUserToAdminOfSecurityGroupInput {
  request: PromoteUserToAdminOfSecurityGroup;
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
  /** Create or retrieve an existing session */
  session: SessionOutput;
  /** Look up a user by its ID */
  user: User;
  /** Look up users */
  users: UserListOutput;
  /** Checks whether a provided email already exists */
  checkEmail: Scalars['Boolean'];
  /** Check Consistency across User Nodes */
  checkUserConsistency: Scalars['Boolean'];
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
  /** Look up a partnership by ID */
  partnership: Partnership;
  /** Look up partnerships */
  partnerships: PartnershipListOutput;
  /** Check partnership node consistency */
  checkPartnershipConsistency: Scalars['Boolean'];
  /** Look up a budget by its ID */
  budget: Budget;
  /** Look up budgets by projectId */
  budgets: BudgetListOutput;
  /** Check Consistency in Budget Nodes */
  checkBudgetConsistency: Scalars['Boolean'];
  /** Look up a ceremony by its ID */
  ceremony: Ceremony;
  /** Look up ceremonies */
  ceremonies: CeremonyListOutput;
  /** Check Consistency in Ceremony Nodes */
  checkCeremonyConsistency: Scalars['Boolean'];
  /** Look up a language by its ID */
  language: Language;
  /** Look up languages */
  languages: LanguageListOutput;
  /** Check language node consistency */
  checkLanguageConsistency: Scalars['Boolean'];
  /** Look up an film by its ID */
  film: Film;
  /** Look up films */
  films: FilmListOutput;
  /** Look up an literacyMaterial by its ID */
  literacyMaterial: LiteracyMaterial;
  /** Look up literacyMaterials */
  literacyMaterials: LiteracyMaterialListOutput;
  /** Read a product by id */
  product: Product;
  /** Look up products */
  products: ProductListOutput;
  /** Look up an story by its ID */
  story: Story;
  /** Look up storys */
  storys: StoryListOutput;
  /** Lookup an engagement by ID */
  engagement: Engagement;
  /** Look up engagements */
  engagements: EngagementListOutput;
  /** Check Consistency in Engagement Nodes */
  checkEngagementConsistency: Scalars['Boolean'];
  /** Look up favorites */
  favorites: FavoriteListOutput;
  /** Look up a project member by ID */
  projectMember: ProjectMember;
  /** Look up project members */
  projectMembers: ProjectMemberListOutput;
  /** Look up a project by its ID */
  project: Project;
  /** Look up projects */
  projects: ProjectListOutput;
  /** Check Consistency in Project Nodes */
  checkProjectConsistency: Scalars['Boolean'];
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

export interface QuerySessionArgs {
  browser?: Maybe<Scalars['Boolean']>;
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

export interface QueryPartnershipArgs {
  id: Scalars['ID'];
}

export interface QueryPartnershipsArgs {
  input?: Maybe<PartnershipListInput>;
}

export interface QueryBudgetArgs {
  id: Scalars['ID'];
}

export interface QueryBudgetsArgs {
  input?: Maybe<BudgetListInput>;
}

export interface QueryCeremonyArgs {
  id: Scalars['ID'];
}

export interface QueryCeremoniesArgs {
  input?: Maybe<CeremonyListInput>;
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

export interface QueryProductArgs {
  id: Scalars['ID'];
}

export interface QueryProductsArgs {
  input?: Maybe<ProductListInput>;
}

export interface QueryStoryArgs {
  id: Scalars['ID'];
}

export interface QueryStorysArgs {
  input?: Maybe<StoryListInput>;
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

export interface QueryFavoritesArgs {
  input?: Maybe<FavoriteListInput>;
}

export interface QueryProjectMemberArgs {
  id: Scalars['ID'];
}

export interface QueryProjectMembersArgs {
  input?: Maybe<ProjectMemberListInput>;
}

export interface QueryProjectArgs {
  id: Scalars['ID'];
}

export interface QueryProjectsArgs {
  input?: Maybe<ProjectListInput>;
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

export type Range = Resource & {
  __typename?: 'Range';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  start: Scalars['Float'];
  end: Scalars['Float'];
};

/** Entities that are readable */
export interface Readable {
  /** Whether the current user can read this object */
  canRead: Scalars['Boolean'];
}

export type Region = Resource &
  Place & {
    __typename?: 'Region';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    name: SecuredString;
    zone: SecuredZone;
    director: SecuredUser;
  };

export interface RemoveOrganizationFromUser {
  orgId: Scalars['ID'];
  userId: Scalars['ID'];
}

export interface RemoveOrganizationFromUserInput {
  request: RemoveOrganizationFromUser;
}

export interface RemovePermissionFromSecurityGroup {
  id: Scalars['ID'];
  sgId: Scalars['ID'];
  baseNodeId: Scalars['ID'];
}

export interface RemovePermissionFromSecurityGroupInput {
  request: RemovePermissionFromSecurityGroup;
}

export interface RemoveUserFromSecurityGroup {
  sgId: Scalars['ID'];
  userId: Scalars['ID'];
}

export interface RemoveUserFromSecurityGroupInput {
  request: RemoveUserFromSecurityGroup;
}

export interface RenameFileInput {
  /** The file node's ID */
  id: Scalars['ID'];
  /** The new name */
  name: Scalars['String'];
}

export interface RequestUploadOutput {
  __typename?: 'RequestUploadOutput';
  id: Scalars['ID'];
  /** A pre-signed url to upload the file to */
  url: Scalars['String'];
}

export interface RequiredField {
  stateId: Scalars['ID'];
  propertyName: Scalars['String'];
}

export interface RequiredFieldInput {
  field: RequiredField;
}

export interface RequiredFieldListOutput {
  __typename?: 'RequiredFieldListOutput';
  items: FieldObject[];
}

export interface ResetPasswordInput {
  token: Scalars['String'];
  password: Scalars['String'];
}

export interface Resource {
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
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

/**
 * An object with a boolean `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredBoolean = Readable &
  Editable & {
    __typename?: 'SecuredBoolean';
    canRead: Scalars['Boolean'];
    canEdit: Scalars['Boolean'];
    value?: Maybe<Scalars['Boolean']>;
  };

/**
 * An object with a budget `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredBudget = Readable &
  Editable & {
    __typename?: 'SecuredBudget';
    canRead: Scalars['Boolean'];
    canEdit: Scalars['Boolean'];
    value?: Maybe<Budget>;
  };

/**
 * An object with a ceremony `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredCeremony = Readable &
  Editable & {
    __typename?: 'SecuredCeremony';
    canRead: Scalars['Boolean'];
    canEdit: Scalars['Boolean'];
    value?: Maybe<Ceremony>;
  };

/**
 * An object with a country `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredCountry = Readable &
  Editable & {
    __typename?: 'SecuredCountry';
    canRead: Scalars['Boolean'];
    canEdit: Scalars['Boolean'];
    value?: Maybe<Country>;
  };

export type SecuredDate = Readable &
  Editable & {
    __typename?: 'SecuredDate';
    canRead: Scalars['Boolean'];
    canEdit: Scalars['Boolean'];
    value?: Maybe<Scalars['Date']>;
  };

export type SecuredDateTime = Readable &
  Editable & {
    __typename?: 'SecuredDateTime';
    canRead: Scalars['Boolean'];
    canEdit: Scalars['Boolean'];
    value?: Maybe<Scalars['DateTime']>;
  };

/**
 * An object with a string `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredDegree = Readable &
  Editable & {
    __typename?: 'SecuredDegree';
    canRead: Scalars['Boolean'];
    canEdit: Scalars['Boolean'];
    value?: Maybe<Scalars['String']>;
  };

/**
 * An object whose `items` is a list of education objects and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is an empty list.
 * The `can*` properties are specific to the user making the request.
 */
export type SecuredEducationList = Readable & {
  __typename?: 'SecuredEducationList';
  /** Whether the current user can read the list of items */
  canRead: Scalars['Boolean'];
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
  /** Whether the current user can create an education in this list */
  canCreate: Scalars['Boolean'];
};

/**
 * An object whose `items` is a list of engagements and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is an empty list.
 * The `can*` properties are specific to the user making the request.
 */
export type SecuredEngagementList = Readable & {
  __typename?: 'SecuredEngagementList';
  /** Whether the current user can read the list of items */
  canRead: Scalars['Boolean'];
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
  /** Whether the current user can create an iengagement in this list */
  canCreate: Scalars['Boolean'];
};

/**
 * An object with a file `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredFile = Readable &
  Editable & {
    __typename?: 'SecuredFile';
    canRead: Scalars['Boolean'];
    canEdit: Scalars['Boolean'];
    value?: Maybe<File>;
  };

/**
 * An object with an integer `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredInt = Readable &
  Editable & {
    __typename?: 'SecuredInt';
    canRead: Scalars['Boolean'];
    canEdit: Scalars['Boolean'];
    value?: Maybe<Scalars['Int']>;
  };

/**
 * An object with an intern position `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredInternPosition = Readable &
  Editable & {
    __typename?: 'SecuredInternPosition';
    canRead: Scalars['Boolean'];
    canEdit: Scalars['Boolean'];
    value?: Maybe<InternshipEngagementPosition>;
  };

/**
 * An object with a language `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredLanguage = Readable &
  Editable & {
    __typename?: 'SecuredLanguage';
    canRead: Scalars['Boolean'];
    canEdit: Scalars['Boolean'];
    value?: Maybe<Language>;
  };

/**
 * An object whose `value` is a list of literacymaterials and has additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is empty: `[]`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredLiteracyMaterialRange = Readable &
  Editable & {
    __typename?: 'SecuredLiteracyMaterialRange';
    canRead: Scalars['Boolean'];
    canEdit: Scalars['Boolean'];
    value: Range[];
  };

/**
 * An object whose `value` is a list of methodologies and has additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is empty: `[]`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredMethodologies = Readable &
  Editable & {
    __typename?: 'SecuredMethodologies';
    canRead: Scalars['Boolean'];
    canEdit: Scalars['Boolean'];
    value: ProductMethodology[];
  };

/**
 * An object with an organization `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredOrganization = Readable &
  Editable & {
    __typename?: 'SecuredOrganization';
    canRead: Scalars['Boolean'];
    canEdit: Scalars['Boolean'];
    value?: Maybe<Organization>;
  };

/**
 * An object whose `items` is a list of organizations and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is an empty list.
 * The `can*` properties are specific to the user making the request.
 */
export type SecuredOrganizationList = Readable & {
  __typename?: 'SecuredOrganizationList';
  /** Whether the current user can read the list of items */
  canRead: Scalars['Boolean'];
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
  /** Whether the current user can create an organization in this list */
  canCreate: Scalars['Boolean'];
};

/**
 * An object with a partnership agreement status `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredPartnershipAgreementStatus = Readable &
  Editable & {
    __typename?: 'SecuredPartnershipAgreementStatus';
    canRead: Scalars['Boolean'];
    canEdit: Scalars['Boolean'];
    value?: Maybe<PartnershipAgreementStatus>;
  };

/**
 * An object whose `items` is a list of partnership objects and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is an empty list.
 * The `can*` properties are specific to the user making the request.
 */
export type SecuredPartnershipList = Readable & {
  __typename?: 'SecuredPartnershipList';
  /** Whether the current user can read the list of items */
  canRead: Scalars['Boolean'];
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
  /** Whether the current user can create an partnership in this list */
  canCreate: Scalars['Boolean'];
};

/**
 * An object whose `value` is a list of partnership types and has additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is empty: `[]`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredPartnershipTypes = Readable &
  Editable & {
    __typename?: 'SecuredPartnershipTypes';
    canRead: Scalars['Boolean'];
    canEdit: Scalars['Boolean'];
    value: PartnershipType[];
  };

/**
 * An object whose `items` is a list of products and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is an empty list.
 * The `can*` properties are specific to the user making the request.
 */
export type SecuredProductList = Readable & {
  __typename?: 'SecuredProductList';
  /** Whether the current user can read the list of items */
  canRead: Scalars['Boolean'];
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
  /** Whether the current user can create an product in this list */
  canCreate: Scalars['Boolean'];
};

/**
 * An object whose `items` is a list of project members and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is an empty list.
 * The `can*` properties are specific to the user making the request.
 */
export type SecuredProjectMemberList = Readable & {
  __typename?: 'SecuredProjectMemberList';
  /** Whether the current user can read the list of items */
  canRead: Scalars['Boolean'];
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
  /** Whether the current user can create an projectmember in this list */
  canCreate: Scalars['Boolean'];
};

/**
 * An object with a project step `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredProjectStep = Readable &
  Editable & {
    __typename?: 'SecuredProjectStep';
    canRead: Scalars['Boolean'];
    canEdit: Scalars['Boolean'];
    value?: Maybe<ProjectStep>;
  };

/**
 * An object whose `value` is a list of ranges and has additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is empty: `[]`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredRange = Readable &
  Editable & {
    __typename?: 'SecuredRange';
    canRead: Scalars['Boolean'];
    canEdit: Scalars['Boolean'];
    value: Range[];
  };

/**
 * An object with a region `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredRegion = Readable &
  Editable & {
    __typename?: 'SecuredRegion';
    canRead: Scalars['Boolean'];
    canEdit: Scalars['Boolean'];
    value?: Maybe<Region>;
  };

/**
 * An object whose `value` is a list of roles and has additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is empty: `[]`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredRoles = Readable &
  Editable & {
    __typename?: 'SecuredRoles';
    canRead: Scalars['Boolean'];
    canEdit: Scalars['Boolean'];
    value: Role[];
  };

/**
 * An object whose `value` is a list of ranges and has additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is empty: `[]`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredStoryRange = Readable &
  Editable & {
    __typename?: 'SecuredStoryRange';
    canRead: Scalars['Boolean'];
    canEdit: Scalars['Boolean'];
    value: Range[];
  };

/**
 * An object with a string `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredString = Readable &
  Editable & {
    __typename?: 'SecuredString';
    canRead: Scalars['Boolean'];
    canEdit: Scalars['Boolean'];
    value?: Maybe<Scalars['String']>;
  };

/**
 * An object whose `items` is a list of unavailabilities and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is an empty list.
 * The `can*` properties are specific to the user making the request.
 */
export type SecuredUnavailabilityList = Readable & {
  __typename?: 'SecuredUnavailabilityList';
  /** Whether the current user can read the list of items */
  canRead: Scalars['Boolean'];
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
  /** Whether the current user can create an unavailability in this list */
  canCreate: Scalars['Boolean'];
};

/**
 * An object with a user `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredUser = Readable &
  Editable & {
    __typename?: 'SecuredUser';
    canRead: Scalars['Boolean'];
    canEdit: Scalars['Boolean'];
    value?: Maybe<User>;
  };

/**
 * An object with a user status `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredUserStatus = Readable &
  Editable & {
    __typename?: 'SecuredUserStatus';
    canRead: Scalars['Boolean'];
    canEdit: Scalars['Boolean'];
    value?: Maybe<UserStatus>;
  };

/**
 * An object with a zone `value` and additional authorization information.
 * The value is only given if `canRead` is `true` otherwise it is `null`.
 * These `can*` authorization properties are specific to the user making the request.
 */
export type SecuredZone = Readable &
  Editable & {
    __typename?: 'SecuredZone';
    canRead: Scalars['Boolean'];
    canEdit: Scalars['Boolean'];
    value?: Maybe<Zone>;
  };

export interface SecurityGroup {
  __typename?: 'SecurityGroup';
  id: Scalars['ID'];
  name: Scalars['String'];
}

export type Sensitivity = 'Low' | 'Medium' | 'High';

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

export interface State {
  __typename?: 'State';
  id: Scalars['ID'];
  value: Scalars['String'];
}

export interface StateListOutput {
  __typename?: 'StateListOutput';
  items: State[];
}

export type Story = Resource & {
  __typename?: 'Story';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  name: SecuredString;
  ranges?: Maybe<SecuredStoryRange>;
};

export interface StoryFilters {
  /** Only story matching this name */
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
    /** The project members */
    team: SecuredProjectMemberList;
    engagements: SecuredEngagementList;
    /** The project's current budget */
    budget: SecuredBudget;
    partnerships: SecuredPartnershipList;
    /** The root filesystem directory of this project */
    rootDirectory: Directory;
  };

export interface TranslationProjectTeamArgs {
  input?: Maybe<ProjectMemberListInput>;
}

export interface TranslationProjectEngagementsArgs {
  input?: Maybe<EngagementListInput>;
}

export interface TranslationProjectPartnershipsArgs {
  input?: Maybe<PartnershipListInput>;
}

export type Unavailability = Resource & {
  __typename?: 'Unavailability';
  id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  description: SecuredString;
  start: Scalars['DateTime'];
  end: Scalars['DateTime'];
};

export interface UnavailabilityFilters {
  /** Unavailabilities for UserId */
  userId?: Maybe<Scalars['ID']>;
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

export interface UpdateBudget {
  id: Scalars['ID'];
  status: BudgetStatus;
}

export interface UpdateBudgetInput {
  budget: UpdateBudget;
}

export interface UpdateBudgetOutput {
  __typename?: 'UpdateBudgetOutput';
  budget: Budget;
}

export interface UpdateBudgetRecord {
  id: Scalars['ID'];
  amount: Scalars['Int'];
}

export interface UpdateBudgetRecordInput {
  budgetRecord: UpdateBudgetRecord;
}

export interface UpdateBudgetRecordOutput {
  __typename?: 'UpdateBudgetRecordOutput';
  budgetRecord: BudgetRecord;
}

export interface UpdateCeremony {
  id: Scalars['ID'];
  planned?: Maybe<Scalars['Boolean']>;
  estimatedDate?: Maybe<Scalars['Date']>;
  actualDate?: Maybe<Scalars['Date']>;
}

export interface UpdateCeremonyInput {
  ceremony: UpdateCeremony;
}

export interface UpdateCeremonyOutput {
  __typename?: 'UpdateCeremonyOutput';
  ceremony: Ceremony;
}

export interface UpdateCountry {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  regionId?: Maybe<Scalars['ID']>;
}

export interface UpdateCountryInput {
  country: UpdateCountry;
}

export interface UpdateCountryOutput {
  __typename?: 'UpdateCountryOutput';
  country: Country;
}

export interface UpdateEducation {
  id: Scalars['ID'];
  degree?: Maybe<Degree>;
  major?: Maybe<Scalars['String']>;
  institution?: Maybe<Scalars['String']>;
}

export interface UpdateEducationInput {
  education: UpdateEducation;
}

export interface UpdateEducationOutput {
  __typename?: 'UpdateEducationOutput';
  education: Education;
}

export interface UpdateFilm {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  ranges?: Maybe<UpdateRange[]>;
}

export interface UpdateFilmInput {
  film: UpdateFilm;
}

export interface UpdateFilmOutput {
  __typename?: 'UpdateFilmOutput';
  film: Film;
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
}

export interface UpdateInternshipEngagementInput {
  engagement: UpdateInternshipEngagement;
}

export interface UpdateInternshipEngagementOutput {
  __typename?: 'UpdateInternshipEngagementOutput';
  engagement: InternshipEngagement;
}

export interface UpdateLanguage {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  beginFiscalYear?: Maybe<Scalars['Int']>;
  ethnologueName?: Maybe<Scalars['String']>;
  ethnologuePopulation?: Maybe<Scalars['Int']>;
  organizationPopulation?: Maybe<Scalars['Int']>;
  rodNumber?: Maybe<Scalars['Int']>;
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
}

export interface UpdateLanguageEngagementInput {
  engagement: UpdateLanguageEngagement;
}

export interface UpdateLanguageEngagementOutput {
  __typename?: 'UpdateLanguageEngagementOutput';
  engagement: LanguageEngagement;
}

export interface UpdateLanguageInput {
  language: UpdateLanguage;
}

export interface UpdateLanguageOutput {
  __typename?: 'UpdateLanguageOutput';
  language: Language;
}

export interface UpdateLiteracyMaterial {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  ranges?: Maybe<UpdateRange[]>;
}

export interface UpdateLiteracyMaterialInput {
  literacyMaterial: UpdateLiteracyMaterial;
}

export interface UpdateLiteracyMaterialOutput {
  __typename?: 'UpdateLiteracyMaterialOutput';
  literacyMaterial: LiteracyMaterial;
}

export interface UpdateOrganization {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
}

export interface UpdateOrganizationInput {
  organization: UpdateOrganization;
}

export interface UpdateOrganizationOutput {
  __typename?: 'UpdateOrganizationOutput';
  organization: Organization;
}

export interface UpdatePartnership {
  id: Scalars['ID'];
  agreementStatus?: Maybe<PartnershipAgreementStatus>;
  /** The partner agreement */
  agreement?: Maybe<CreateDefinedFileVersionInput>;
  /** The MOU agreement */
  mou?: Maybe<CreateDefinedFileVersionInput>;
  mouStatus?: Maybe<PartnershipAgreementStatus>;
  mouStart?: Maybe<Scalars['Date']>;
  mouEnd?: Maybe<Scalars['Date']>;
  types?: Maybe<PartnershipType[]>;
}

export interface UpdatePartnershipInput {
  partnership: UpdatePartnership;
}

export interface UpdatePartnershipOutput {
  __typename?: 'UpdatePartnershipOutput';
  partnership: Partnership;
}

export interface UpdateProduct {
  id: Scalars['ID'];
  type?: Maybe<ProductType>;
  books?: Maybe<BibleBook[]>;
  mediums?: Maybe<ProductMedium[]>;
  purposes?: Maybe<ProductPurpose[]>;
  methodology?: Maybe<ProductMethodology>;
}

export interface UpdateProductInput {
  product: UpdateProduct;
}

export interface UpdateProductOutput {
  __typename?: 'UpdateProductOutput';
  product: Product;
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

export interface UpdateProjectInput {
  project: UpdateProject;
}

export interface UpdateProjectMember {
  id: Scalars['ID'];
  roles?: Maybe<Role[]>;
}

export interface UpdateProjectMemberInput {
  projectMember: UpdateProjectMember;
}

export interface UpdateProjectMemberOutput {
  __typename?: 'UpdateProjectMemberOutput';
  projectMember: ProjectMember;
}

export interface UpdateProjectOutput {
  __typename?: 'UpdateProjectOutput';
  project: Project;
}

export interface UpdateRange {
  id: Scalars['ID'];
  start: Scalars['Float'];
  end: Scalars['Float'];
}

export interface UpdateRegion {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  /** The zone ID that the region will be associated with */
  zoneId?: Maybe<Scalars['ID']>;
  /** A user ID that will be the director of the region */
  directorId?: Maybe<Scalars['ID']>;
}

export interface UpdateRegionInput {
  region: UpdateRegion;
}

export interface UpdateRegionOutput {
  __typename?: 'UpdateRegionOutput';
  region: Region;
}

export interface UpdateSecurityGroupName {
  id: Scalars['ID'];
  name: Scalars['String'];
}

export interface UpdateSecurityGroupNameInput {
  request: UpdateSecurityGroupName;
}

export interface UpdateSecurityGroupNameOutput {
  __typename?: 'UpdateSecurityGroupNameOutput';
  id: Scalars['ID'];
  name: Scalars['String'];
}

export interface UpdateState {
  stateId: Scalars['ID'];
  workflowId: Scalars['ID'];
  stateName: Scalars['String'];
}

export interface UpdateStateInput {
  state: UpdateState;
}

export interface UpdateStory {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  ranges?: Maybe<UpdateRange[]>;
}

export interface UpdateStoryInput {
  story: UpdateStory;
}

export interface UpdateStoryOutput {
  __typename?: 'UpdateStoryOutput';
  story: Story;
}

export interface UpdateUnavailability {
  id: Scalars['ID'];
  description?: Maybe<Scalars['String']>;
  start?: Maybe<Scalars['DateTime']>;
  end?: Maybe<Scalars['DateTime']>;
}

export interface UpdateUnavailabilityInput {
  unavailability: UpdateUnavailability;
}

export interface UpdateUnavailabilityOutput {
  __typename?: 'UpdateUnavailabilityOutput';
  unavailability: Unavailability;
}

export interface UpdateUser {
  id: Scalars['ID'];
  realFirstName?: Maybe<Scalars['String']>;
  realLastName?: Maybe<Scalars['String']>;
  displayFirstName?: Maybe<Scalars['String']>;
  displayLastName?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  timezone?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  status?: Maybe<UserStatus>;
}

export interface UpdateUserInput {
  user: UpdateUser;
}

export interface UpdateUserOutput {
  __typename?: 'UpdateUserOutput';
  user: User;
}

export interface UpdateZone {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  /** A user ID that will be the new director of the zone */
  directorId?: Maybe<Scalars['ID']>;
}

export interface UpdateZoneInput {
  zone: UpdateZone;
}

export interface UpdateZoneOutput {
  __typename?: 'UpdateZoneOutput';
  zone: Zone;
}

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
  timezone: SecuredString;
  bio: SecuredString;
  status: SecuredUserStatus;
  fullName?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  avatarLetters?: Maybe<Scalars['String']>;
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

export interface UserFilters {
  /** Only users matching this first name */
  displayFirstName?: Maybe<Scalars['String']>;
  /** Only users matching this last name */
  displayLastName?: Maybe<Scalars['String']>;
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

export type UserStatus = 'Active' | 'Disabled';

export interface Workflow {
  __typename?: 'Workflow';
  id: Scalars['ID'];
  stateIdentifier: Scalars['String'];
  startingState: State;
}

export type Zone = Resource &
  Place & {
    __typename?: 'Zone';
    id: Scalars['ID'];
    createdAt: Scalars['DateTime'];
    name: SecuredString;
    director: SecuredUser;
  };
