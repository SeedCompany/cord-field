import { buildEnum } from './enum';

export class Partner {
  id: string;
  name: string;

  static fromJson(json: any): Partner {
    json = json || {};
    const partner = new Partner();

    partner.id = json.id || '';
    partner.name = json.name || 0;

    return partner;
  }
}

export enum PartnerType {
  Managing = 'm',
  Funding = 'f',
  Impact = 'i',
  Technical = 't',
  Resource = 'r'
}
export namespace PartnerType {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum(PartnerType, {
    [PartnerType.Managing]: 'Managing',
    [PartnerType.Funding]: 'Funding',
    [PartnerType.Impact]: 'Impact',
    [PartnerType.Technical]: 'Technical',
    [PartnerType.Resource]: 'Resource'
  });
}

export enum PartnerAgreementStatus {
  NotAttached = 'na',
  AwaitingSignature = 'as',
  Signed = 's'
}
export namespace PartnerAgreementStatus {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum(PartnerAgreementStatus, {
    [PartnerAgreementStatus.Signed]: 'Signed',
    [PartnerAgreementStatus.NotAttached]: 'Not Attached',
    [PartnerAgreementStatus.AwaitingSignature]: 'Awaiting Signature'
  });
}
