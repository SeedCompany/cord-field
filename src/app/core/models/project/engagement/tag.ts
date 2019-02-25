import { FieldConfig, modifiedListMerger } from '@app/core/change-engine';

export enum ProjectEngagementTag {
  LukePartnership = 'luke_partnership',
  FirstScripture = 'first_scripture',
  CeremonyPlanned = 'ceremony_planned',
}

export namespace ProjectEngagementTag {
  export const fieldConfigList: FieldConfig<ProjectEngagementTag[], ProjectEngagementTag[]> = ({
    toServer: modifiedListMerger(),
  });
}
