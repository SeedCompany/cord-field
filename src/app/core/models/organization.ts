import { FieldConfig, mapChangeList, ModifiedList, returnId } from '@app/core/change-engine';

export class Organization {
  id: string;
  name: string;

  static fromJson(json: any): Organization {
    const org = new Organization();

    org.id = json.id;
    org.name = json.name;

    return org;
  }

  static fieldConfigList = (): FieldConfig<Organization[], ModifiedOrganizations> => ({
    accessor: returnId,
    toServer: mapChangeList(returnId, returnId),
  });
}

export type ModifiedOrganizations = ModifiedList<string, string, never>;
