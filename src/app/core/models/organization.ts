export class Organization {
  id: string;
  name: string;

  static fromJson(json: any): Organization {
    const org = new Organization();

    org.id = json.id;
    org.name = json.name;

    return org;
  }
}
