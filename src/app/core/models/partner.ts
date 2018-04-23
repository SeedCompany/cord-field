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
  Managing = 'managing',
  Funding = 'funcding',
  Impact = 'impact',
  Technical = 'technical',
  Resource = 'resource'
}

export enum PartnerAgreementStatus {
  NotAttached = 'not_attached',
  AwaitingSignature = 'awaiting_signature',
  Signed = 'signed'
}

export const PartnerTypeList = [
  PartnerType.Managing,
  PartnerType.Funding,
  PartnerType.Impact,
  PartnerType.Technical,
  PartnerType.Resource
];

export const PartnerAgreementStatusList = [
  PartnerAgreementStatus.AwaitingSignature,
  PartnerAgreementStatus.NotAttached,
  PartnerAgreementStatus.Signed
];

export function PartnerTypeToString(partnerType: PartnerType): string {
  const partnerTypes = {
    [PartnerType.Resource]: 'Resource',
    [PartnerType.Technical]: 'Technical',
    [PartnerType.Impact]: 'Impact',
    [PartnerType.Funding]: 'Funding',
    [PartnerType.Managing]: 'Managing'
  };

  return partnerTypes[partnerType];
}

export function PartnerAgreementStatusToString(partnerAgreementStatus: PartnerAgreementStatus): string {
  const partnerAgreementStatuses = {
    [PartnerAgreementStatus.Signed]: 'Signed',
    [PartnerAgreementStatus.NotAttached]: 'Not Attached',
    [PartnerAgreementStatus.AwaitingSignature]: 'Awaiting Signature'
  };

  return partnerAgreementStatuses[partnerAgreementStatus];
}
