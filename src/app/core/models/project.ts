export class Project {
  name: string;
  organization: string;
  organizationId: string;
  estimatedCompletionYear: number[];
  completionDate: Date;
  agreementEndDate: Date;
  agreementDate: Date;
  active: boolean;

  static fromJson(json: any): Project {
    json = json || {};
    const project = new Project();

    project.name = json.name || '';
    project.organization = json.organization || '';
    project.organizationId = json.organizationId || '';
    project.estimatedCompletionYear = json.estimatedCompletionYear || '';
    project.completionDate = json.completionDate || '';
    project.agreementEndDate = json.agreementEndDate || '';
    project.agreementDate = json.agreementDate || '';
    project.active = json.active || false;
    return project;
  }
}
