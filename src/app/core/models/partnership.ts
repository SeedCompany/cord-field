import { buildEnum } from './enum';

export class Partnership {
  id: string;
  name: string;

  static fromJson(json: any): Partnership {
    json = json || {};
    const partnership = new Partnership();

    partnership.id = json.id || '';
    partnership.name = json.name || 0;

    return partnership;
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
