import { buildEnum } from './enum';
import { Organization } from './organization';

export interface PartnershipForSaveAPI {
  agreementStatus: PartnershipAgreementStatus;
  mouStatus: PartnershipAgreementStatus;
  mouStart: Date | null;
  mouEnd: Date | null;
  organizationId: string;
  types: PartnershipType[];
}

export class Partnership {
  agreementStatus: PartnershipAgreementStatus;
  mouStatus: PartnershipAgreementStatus;
  mouStart: Date | null;
  mouEnd: Date | null;
  organization: Organization;
  types: PartnershipType[];

  get id() {
    return this.organization.id;
  }

  get name() {
    return this.organization.name;
  }

  static fromJson(json: any): Partnership {
    json = json || {};
    const partnership = new Partnership();

    partnership.organization = Organization.fromJson(json.organization || {});
    partnership.agreementStatus = json.agreementStatus || PartnershipAgreementStatus.NotAttached;
    partnership.mouStatus = json.mouStatus || PartnershipAgreementStatus.NotAttached;
    partnership.mouStart = json.mouStart ? new Date(json.mouStart) : null;
    partnership.mouEnd = json.mouEnd ? new Date(json.mouEnd) : null;
    partnership.types = json.types || [];

    return partnership;
  }

  static fromOrganization(org: Organization): Partnership {
    const partnership = new Partnership();

    partnership.organization = org;
    partnership.agreementStatus = PartnershipAgreementStatus.NotAttached;
    partnership.mouStatus = PartnershipAgreementStatus.NotAttached;
    partnership.mouStart = null;
    partnership.mouEnd = null;
    partnership.types = [];

    return partnership;
  }

  static forSaveAPI(partnership: Partnership): PartnershipForSaveAPI {
    // replace organization object with orgId
    const {organization, ...rest} = partnership;
    return {...rest, organizationId: partnership.id} as PartnershipForSaveAPI;
  }
}

export enum PartnershipType {
  Managing = 'm',
  Funding = 'f',
  Impact = 'i',
  Technical = 't',
  Resource = 'r'
}
export namespace PartnershipType {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum(PartnershipType, {
    [PartnershipType.Managing]: 'Managing',
    [PartnershipType.Funding]: 'Funding',
    [PartnershipType.Impact]: 'Impact',
    [PartnershipType.Technical]: 'Technical',
    [PartnershipType.Resource]: 'Resource'
  });
}

export enum PartnershipAgreementStatus {
  NotAttached = 'na',
  AwaitingSignature = 'as',
  Signed = 's'
}
export namespace PartnershipAgreementStatus {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum(PartnershipAgreementStatus, {
    [PartnershipAgreementStatus.Signed]: 'Signed',
    [PartnershipAgreementStatus.NotAttached]: 'Not Attached',
    [PartnershipAgreementStatus.AwaitingSignature]: 'Awaiting Signature'
  });
}
