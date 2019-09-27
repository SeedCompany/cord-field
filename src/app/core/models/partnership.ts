import { FieldConfig, mapChangeList, ModifiedList, returnId } from '@app/core/change-engine';
import { maybeServerDate } from '@app/core/util';
import { DateTime } from 'luxon';
import { buildEnum } from './enum';
import { Organization } from './organization';

export type ModifiedPartnerships = ModifiedList<PartnershipForSaveAPI, string>;

interface PartnershipForSaveAPI {
  agreementStatus: PartnershipAgreementStatus;
  mouStatus: PartnershipAgreementStatus;
  mouStart: DateTime | null;
  mouEnd: DateTime | null;
  organizationId: string;
  types: PartnershipType[];
}

export class Partnership {
  agreementStatus: PartnershipAgreementStatus;
  mouStatus: PartnershipAgreementStatus;
  mouStart: DateTime | null;
  mouEnd: DateTime | null;
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
    partnership.mouStart = maybeServerDate(json.mouStart);
    partnership.mouEnd = maybeServerDate(json.mouEnd);
    partnership.types = json.types || [];

    return partnership;
  }

  static fieldConfigList = (): FieldConfig<Partnership[], ModifiedPartnerships> => ({
    accessor: returnId,
    toServer: mapChangeList(Partnership.forSaveAPI, returnId),
    store: mapChangeList(Partnership.store, Partnership.store),
    restore: mapChangeList(Partnership.fromJson, Partnership.fromJson),
  });

  static store(partnership: Partnership) {
    return {
      ...partnership,
      mouStart: partnership.mouStart ? partnership.mouStart.toISO() : null,
      mouEnd: partnership.mouEnd ? partnership.mouEnd.toISO() : null,
    };
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
  Resource = 'r',
}
export namespace PartnershipType {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum(PartnershipType, {
    [PartnershipType.Managing]: 'Managing',
    [PartnershipType.Funding]: 'Funding',
    [PartnershipType.Impact]: 'Impact',
    [PartnershipType.Technical]: 'Technical',
    [PartnershipType.Resource]: 'Resource',
  });
}

export enum PartnershipAgreementStatus {
  NotAttached = 'na',
  AwaitingSignature = 'as',
  Signed = 's',
}
export namespace PartnershipAgreementStatus {
  export const {entries, forUI, values, trackEntryBy, trackValueBy} = buildEnum(PartnershipAgreementStatus, {
    [PartnershipAgreementStatus.NotAttached]: 'Not Attached',
    [PartnershipAgreementStatus.AwaitingSignature]: 'Awaiting Signature',
    [PartnershipAgreementStatus.Signed]: 'Signed',
  });
}
