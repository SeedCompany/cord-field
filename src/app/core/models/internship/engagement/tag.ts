import { FieldConfig, modifiedListMerger } from '@app/core/change-engine';

export enum InternshipEngagementTag {
  CeremonyPlanned = 'ceremony_planned',
}

export namespace InternshipEngagementTag {
  export const fieldConfigList: FieldConfig<InternshipEngagementTag[], InternshipEngagementTag[]> = ({
    toServer: modifiedListMerger(),
  });
}
